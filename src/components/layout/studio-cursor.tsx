"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A restrained pointer: a dot that tracks exactly, a ring that trails, and a
 * caption only where a project can be opened. Disabled entirely on touch
 * devices and when motion is reduced (handled in CSS as well).
 */
export function StudioCursor() {
  const dot = useRef<HTMLSpanElement>(null);
  const ring = useRef<HTMLSpanElement>(null);
  const caption = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<"idle" | "link" | "view">("idle");
  const [awake, setAwake] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const trail = { ...target };
    let raf = 0;

    const onMove = (event: PointerEvent) => {
      setAwake(true);
      target.x = event.clientX;
      target.y = event.clientY;
      const element = (event.target as HTMLElement | null)?.closest?.("[data-cursor]") as HTMLElement | null;
      setState((element?.dataset.cursor as "link" | "view" | undefined) ?? "idle");
    };

    const render = () => {
      trail.x += (target.x - trail.x) * 0.16;
      trail.y += (target.y - trail.y) * 0.16;
      if (dot.current) dot.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
      if (ring.current) ring.current.style.transform = `translate3d(${trail.x}px, ${trail.y}px, 0) translate(-50%, -50%)`;
      if (caption.current) caption.current.style.transform = `translate3d(${trail.x}px, ${trail.y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(render);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div className="cursor" data-state={state} data-awake={awake ? "true" : "false"} aria-hidden="true">
      <span className="cursor__ring" ref={ring} />
      <span className="cursor__dot" ref={dot} />
      <span className="cursor__caption" ref={caption}>
        View project
      </span>
    </div>
  );
}
