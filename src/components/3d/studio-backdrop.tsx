"use client";

import dynamic from "next/dynamic";
import { Atmosphere, type AtmosphereTone } from "@/components/atmosphere/atmosphere";
import { useSceneCapabilities } from "./use-scene-capabilities";
import { useInView } from "./use-in-view";
import type { SceneVariant } from "./studio-scene";

/**
 * A page-level environment: the atmospheric light system, plus — where the page
 * asks for it — one ambient WebGL layer sitting well behind the reading line.
 * Everything except the canvas is CSS, so the environment still reads with
 * WebGL disabled or motion reduced.
 *
 * The canvas itself mounts lazily, the moment its wrapper is about to scroll
 * into view, and then stays mounted. That lets a page carry more than one of
 * these — a hero and a closing "return to the portal" moment — without ever
 * running two live WebGL contexts for a scene nobody has scrolled to yet.
 */
const StudioScene = dynamic(() => import("./studio-scene"), { ssr: false });

export function StudioBackdrop({
  variant = "ambient",
  tone = "studio",
  markers,
  fixed = false,
  scene = true,
  eager = false,
}: {
  variant?: SceneVariant;
  tone?: AtmosphereTone;
  markers?: [string, string];
  fixed?: boolean;
  scene?: boolean;
  /** Mount the canvas immediately rather than waiting for scroll proximity — use for above-the-fold scenes like the hero. */
  eager?: boolean;
}) {
  const { tier, reducedMotion, ready } = useSceneCapabilities();
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div className={`backdrop${fixed ? " backdrop--fixed" : ""}`} ref={ref} aria-hidden="true">
      <Atmosphere tone={tone} fixed={false} rules />
      {scene && ready && tier && (eager || inView) ? (
        <div className="backdrop__canvas">
          <StudioScene tier={tier} reducedMotion={reducedMotion} variant={variant} />
        </div>
      ) : null}
      {markers ? (
        <>
          <span className="annotation annotation--vertical backdrop__marker backdrop__marker--a">{markers[0]}</span>
          <span className="annotation annotation--vertical backdrop__marker backdrop__marker--b">{markers[1]}</span>
        </>
      ) : null}
    </div>
  );
}
