"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FRAGMENT_SHADER, VERTEX_SHADER } from "./shader";
import { mixViews, orientationFor, viewFor, type Station, type View } from "./views";

/**
 * The N4IS environment: one physical place behind every page.
 *
 * A fixed canvas renders the hall (see ./shader.ts). On the homepage it is a
 * journey — each section marked `data-env="<station>"` is a place along the
 * hall, and scrolling walks the camera between them. Elsewhere it stands still
 * at one station.
 *
 * It only draws when something changes: while the camera is easing toward a
 * new station, on resize, or while the pointer drifts the view. Once the camera
 * settles the GPU goes idle, so reading a long page costs nothing. Resolution
 * is set by a pixel budget per device class rather than by device pixel ratio —
 * this is a soft, atmospheric image and does not need retina sharpness.
 */

const BUDGET = [320_000, 560_000, 900_000] as const; // mobile · tablet · desktop
const EASE = 3.2; // how quickly the camera catches up with the scroll, per second

function qualityFor(width: number) {
  if (width <= 720) return 0;
  if (width <= 1100) return 1;
  return 2;
}

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    if (process.env.NODE_ENV !== "production") console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/** Stations along the page, as document scroll positions. */
function readStops(orientation: "landscape" | "portrait"): { y: number; view: View }[] {
  const vh = window.innerHeight;
  const max = Math.max(0, document.documentElement.scrollHeight - vh);
  const stops: { y: number; view: View }[] = [];
  document.querySelectorAll<HTMLElement>("[data-env]").forEach((element) => {
    const station = element.dataset.env as Station;
    const top = element.getBoundingClientRect().top + window.scrollY;
    // a station is fully reached when its section's top sits a third of the way down the screen
    const y = Math.min(max, Math.max(0, top - vh * 0.33));
    stops.push({ y, view: viewFor(station, orientation) });
  });
  return stops.sort((a, b) => a.y - b.y);
}

function viewAt(stops: { y: number; view: View }[], y: number): View | null {
  if (!stops.length) return null;
  if (y <= stops[0].y) return stops[0].view;
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];
    if (y <= b.y) {
      const t = b.y > a.y ? (y - a.y) / (b.y - a.y) : 1;
      return mixViews(a.view, b.view, t * t * (3 - 2 * t));
    }
  }
  return stops[stops.length - 1].view;
}

function distance(a: View, b: View) {
  return (
    Math.abs(a.pos[0] - b.pos[0]) +
    Math.abs(a.pos[1] - b.pos[1]) +
    Math.abs(a.pos[2] - b.pos[2]) +
    Math.abs(a.yaw - b.yaw) * 10 +
    Math.abs(a.shift[0] - b.shift[0]) +
    Math.abs(a.shift[1] - b.shift[1]) +
    Math.abs(a.fov - b.fov) * 0.05 +
    Math.abs(a.portal - b.portal) +
    Math.abs(a.veil - b.veil)
  );
}

export function Environment({ station = "page", journey = false }: { station?: Station; journey?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // mounted straight into <body>: the page-transition wrapper animates a
  // transform, which would otherwise pin a fixed layer to the page, not the viewport
  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => setHost(document.body), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = root.current;
    if (!host || !canvas || !wrapper) return;

    const gl = canvas.getContext("webgl2", {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.bindAttribLocation(program, 0, "position");
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    // one triangle that covers the screen
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(program, name);
    const uniforms = {
      res: u("uRes"),
      camPos: u("uCamPos"),
      yaw: u("uYaw"),
      shift: u("uShift"),
      tanHalf: u("uTanHalf"),
      portal: u("uPortal"),
      sun: u("uSun"),
      veil: u("uVeil"),
      quality: u("uQuality"),
    };

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    let orientation = orientationFor(window.innerWidth, window.innerHeight);
    let quality = qualityFor(window.innerWidth);
    let stops = journey ? readStops(orientation) : [];
    let current: View | null = null;
    let frame = 0;
    let last = 0;
    let dirty = true;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    const target = (): View => {
      const view = (journey ? viewAt(stops, window.scrollY) : null) ?? viewFor(station, orientation);
      // dev-only: lets a composition be tuned live from the console
      const override = process.env.NODE_ENV !== "production" ? (window as { __env?: Partial<View> }).__env : undefined;
      return override ? { ...view, ...override } : view;
    };

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      orientation = orientationFor(width, height);
      quality = qualityFor(width);
      const scale = Math.min(1, Math.sqrt(BUDGET[quality] / (width * height)));
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (journey) stops = readStops(orientation);
      current = null;
      dirty = true;
    };

    const draw = (view: View) => {
      const px = pointer.x * 0.35;
      const py = pointer.y * 0.18;
      gl.uniform2f(uniforms.res, canvas.width, canvas.height);
      gl.uniform3f(uniforms.camPos, view.pos[0] + px, view.pos[1] + py, view.pos[2]);
      gl.uniform1f(uniforms.yaw, view.yaw + pointer.x * 0.012);
      gl.uniform2f(uniforms.shift, view.shift[0], view.shift[1]);
      gl.uniform1f(uniforms.tanHalf, Math.tan((view.fov * Math.PI) / 360));
      gl.uniform1f(uniforms.portal, view.portal);
      gl.uniform1f(uniforms.sun, view.sun);
      gl.uniform1f(uniforms.veil, view.veil);
      gl.uniform1i(uniforms.quality, quality);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!wrapper.classList.contains("is-lit")) wrapper.classList.add("is-lit");
    };

    const tick = (now: number) => {
      frame = 0;
      // phones ease at half rate: the movement is slow enough not to show it,
      // and it halves the GPU time spent while the page is scrolling
      if (quality === 0 && current && last && now - last < 30) {
        request();
        return;
      }
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 1 / 60;
      last = now;

      const goal = target();
      const still = reducedMotion.matches;
      const k = still || !current ? 1 : 1 - Math.exp(-EASE * dt);
      current = current ? mixViews(current, goal, k) : goal;
      pointer.x += (pointer.tx - pointer.x) * (still ? 1 : 1 - Math.exp(-2.4 * dt));
      pointer.y += (pointer.ty - pointer.y) * (still ? 1 : 1 - Math.exp(-2.4 * dt));

      draw(current);
      dirty = false;

      const moving =
        distance(current, goal) > 0.0015 ||
        Math.abs(pointer.tx - pointer.x) + Math.abs(pointer.ty - pointer.y) > 0.002;
      if (moving) request();
      else last = 0;
    };

    function request() {
      if (!frame && !document.hidden) frame = requestAnimationFrame(tick);
    }

    const onScroll = () => {
      if (journey) request();
    };
    const onPointer = (event: PointerEvent) => {
      if (!finePointer.matches || reducedMotion.matches) return;
      pointer.tx = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = -((event.clientY / window.innerHeight) * 2 - 1);
      request();
    };
    let resizeFrame = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        resize();
        request();
      });
    };
    const onVisible = () => {
      if (!document.hidden && dirty) request();
    };
    // layout shifts (fonts, images, reveals) move the stations
    const observer = journey
      ? new ResizeObserver(() => {
          stops = readStops(orientation);
          request();
        })
      : null;
    observer?.observe(document.body);

    const onLost = (event: Event) => {
      event.preventDefault();
      wrapper.classList.remove("is-lit");
    };

    resize();
    request();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisible);
    canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(resizeFrame);
      observer?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisible);
      canvas.removeEventListener("webglcontextlost", onLost);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [host, journey, station]);

  if (!host) return null;
  return createPortal(
    <div ref={root} className={`env env--${station}`} aria-hidden="true">
      <canvas ref={canvasRef} className="env__canvas" />
      <span className="env__grain" />
    </div>,
    host,
  );
}
