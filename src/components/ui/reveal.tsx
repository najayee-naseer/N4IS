"use client";

import {
  createElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

/**
 * Scroll reveal.
 *
 * One shared, rAF-throttled listener drives every instance rather than an
 * observer per element: it costs a single scroll handler for the whole page and,
 * unlike IntersectionObserver, it cannot miss an element during a fast flick
 * scroll or be defeated by a clip-path on the watched node. Anything that has
 * reached the trigger line — including content already scrolled past — reveals.
 */
const watchers = new Set<() => void>();
let frame = 0;
let timer = 0;
let listening = false;

function flush() {
  cancelAnimationFrame(frame);
  clearTimeout(timer);
  frame = 0;
  timer = 0;
  for (const check of Array.from(watchers)) check();
}

/**
 * A frame is the smooth path, but rAF is throttled to a standstill in a
 * background or occluded tab. A plain latch would stay stuck in that case and
 * silently strand every remaining section as invisible, so a timeout races the
 * frame and whichever arrives first clears both.
 */
function schedule() {
  if (frame || timer) return;
  frame = requestAnimationFrame(flush);
  timer = window.setTimeout(flush, 180);
}

function watch(check: () => void) {
  watchers.add(check);
  if (!listening) {
    listening = true;
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("orientationchange", schedule, { passive: true });
  }
  return () => {
    watchers.delete(check);
  };
}

export function Reveal({
  children,
  as,
  className = "",
  variant = "up",
  delay = 0,
  ...rest
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  variant?: "up" | "fade" | "wipe";
  delay?: number;
} & Record<string, unknown>) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const check = () => {
      if (node.getBoundingClientRect().top >= window.innerHeight * 0.9) return;
      setVisible(true);
      watchers.delete(check);
    };

    const unwatch = watch(check);
    check();

    return unwatch;
  }, []);

  const modifier = variant === "up" ? "" : ` reveal--${variant}`;

  return createElement(
    (as ?? "div") as ElementType,
    {
      ref,
      className: `reveal${modifier} ${className}`.trim(),
      "data-visible": visible ? "true" : "false",
      style: delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined,
      ...rest,
    },
    children,
  );
}
