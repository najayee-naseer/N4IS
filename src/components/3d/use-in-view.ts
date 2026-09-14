"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Mounts a canvas only once its wrapper is about to enter the viewport, and
 * keeps it mounted from then on. Lets the page carry more than one WebGL
 * scene — a hero and a closing "return to the portal" moment — without
 * paying for the second one until the visitor actually scrolls toward it.
 */
export function useInView<T extends HTMLElement>(rootMargin = "60% 0px") {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || inView) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setInView(true);
      },
      { rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [inView, rootMargin]);

  return { ref, inView };
}
