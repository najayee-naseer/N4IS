"use client";

import { useEffect, useState } from "react";
import { isWebGLAvailable } from "./detect-webgl";
import { tierFor, type Tier } from "./theme";

/**
 * What this device should actually be asked to render. Shared by every WebGL
 * surface so the decision is made once and consistently: no canvas without
 * WebGL, a device-appropriate tier, and a live reading of the motion setting.
 */
export function useSceneCapabilities() {
  const [tier, setTier] = useState<Tier | null>(null);
  const [webgl, setWebgl] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setWebgl(isWebGLAvailable());
    setTier(tierFor(window.innerWidth));

    let frame = 0;
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setTier(tierFor(window.innerWidth)));
    };
    window.addEventListener("resize", onResize);

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motion.matches);
    const onMotion = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    motion.addEventListener("change", onMotion);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      motion.removeEventListener("change", onMotion);
    };
  }, []);

  return { tier, webgl, reducedMotion, ready: Boolean(tier && webgl) };
}
