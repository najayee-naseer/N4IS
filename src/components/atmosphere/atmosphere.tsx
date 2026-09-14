"use client";

import { useEffect, useRef } from "react";

/**
 * One shared scroll loop drives every atmosphere on the page.
 *
 * Each registered element gets a `--t` between 0 and 1 describing where it sits
 * in the viewport, which the stylesheet uses to drift the light fields and the
 * large translucent geometry at different rates. Registering here rather than
 * per-component means one passive listener and one rAF for the whole page, and
 * nothing runs at all when motion is reduced.
 */
const registry = new Set<HTMLElement>();
let frame = 0;
let listening = false;

function measure() {
  frame = 0;
  const viewport = window.innerHeight || 1;
  for (const element of registry) {
    const rect = element.getBoundingClientRect();
    const span = rect.height + viewport;
    if (span <= 0) continue;
    const progress = (viewport - rect.top) / span;
    element.style.setProperty("--t", String(Math.min(1, Math.max(0, progress)).toFixed(4)));
  }
}

function schedule() {
  if (frame) return;
  frame = requestAnimationFrame(measure);
}

function listen() {
  if (listening) return;
  listening = true;
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  schedule();
}

function stop() {
  if (!listening || registry.size > 0) return;
  listening = false;
  cancelAnimationFrame(frame);
  frame = 0;
  window.removeEventListener("scroll", schedule);
  window.removeEventListener("resize", schedule);
}

export type AtmosphereTone = "studio" | "calm" | "warmlight" | "quiet" | "signal";

export function Atmosphere({
  tone = "studio",
  fixed = false,
  grid = true,
  beam = true,
  forms = true,
  rules = false,
  seam = false,
  className = "",
}: {
  tone?: AtmosphereTone;
  fixed?: boolean;
  grid?: boolean;
  beam?: boolean;
  forms?: boolean;
  rules?: boolean;
  seam?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    registry.add(element);
    listen();
    return () => {
      registry.delete(element);
      stop();
    };
  }, []);

  const tones = tone === "studio" ? "" : ` atmo--${tone}`;

  return (
    <div ref={ref} className={`atmo${fixed ? " atmo--fixed" : ""}${tones} ${className}`.trim()} aria-hidden="true">
      <div className="atmo__base" />
      {seam ? <span className="atmo__seam" /> : null}
      <span className="atmo__light atmo__light--key" />
      <span className="atmo__light atmo__light--rim" />
      <span className="atmo__light atmo__light--fill" />
      {beam ? <span className="atmo__beam" /> : null}
      {forms ? (
        <>
          <span className="atmo__form atmo__form--ring" />
          <span className="atmo__form atmo__form--pane" />
          <span className="atmo__form atmo__form--slab" />
        </>
      ) : null}
      {grid ? <span className="atmo__grid" /> : null}
      {rules ? (
        <span className="atmo__rules">
          <i />
          <i />
          <i />
        </span>
      ) : null}
    </div>
  );
}
