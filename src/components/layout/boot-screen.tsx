"use client";

import { useEffect, useState } from "react";
import { BrandMark } from "@/components/ui/brand-mark";

const KEY = "n4is:booted";

/**
 * A short brand moment on first load only. It never blocks a returning visitor,
 * never runs for reduced-motion users, and clears itself if anything stalls.
 */
export function BootScreen() {
  const [active, setActive] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
    } catch {
      seen = false;
    }

    if (reduced || seen) return;

    setActive(true);
    document.body.style.overflow = "hidden";

    const started = performance.now();
    const duration = 1150;
    let raf = 0;

    const tick = (now: number) => {
      const value = Math.min(1, (now - started) / duration);
      setProgress(value);
      if (value < 1) {
        raf = requestAnimationFrame(tick);
        return;
      }
      setDone(true);
      document.body.style.overflow = "";
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {
        /* storage unavailable — the boot screen simply shows again */
      }
      window.setTimeout(() => setActive(false), 600);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
  }, []);

  if (!active) return null;

  return (
    <div className="boot" data-done={done ? "true" : "false"} role="status" aria-live="polite">
      <div className="boot__inner">
        <BrandMark variant="boot" priority sizes="320px" alt="N4IS — ideas for a smarter tomorrow" />
        <div className="boot__bar">
          <i style={{ ["--p" as string]: progress } as React.CSSProperties} />
        </div>
        <div className="boot__meta">
          <span className="label">Building what&apos;s next.</span>
          <span className="label label--accent">{String(Math.round(progress * 100)).padStart(3, "0")}</span>
        </div>
      </div>
    </div>
  );
}
