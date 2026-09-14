"use client";

import dynamic from "next/dynamic";
import { Atmosphere, type AtmosphereTone } from "@/components/atmosphere/atmosphere";
import { useSceneCapabilities } from "./use-scene-capabilities";
import type { SceneVariant } from "./studio-scene";

/**
 * A page-level environment: the atmospheric light system, plus — where the page
 * asks for it — one ambient WebGL layer sitting well behind the reading line.
 * Everything except the canvas is CSS, so the environment still reads with
 * WebGL disabled or motion reduced.
 */
const StudioScene = dynamic(() => import("./studio-scene"), { ssr: false });

export function StudioBackdrop({
  variant = "ambient",
  tone = "studio",
  markers,
  fixed = false,
  scene = true,
}: {
  variant?: SceneVariant;
  tone?: AtmosphereTone;
  markers?: [string, string];
  fixed?: boolean;
  scene?: boolean;
}) {
  const { tier, reducedMotion, ready } = useSceneCapabilities();

  return (
    <div className={`backdrop${fixed ? " backdrop--fixed" : ""}`} aria-hidden="true">
      <Atmosphere tone={tone} fixed={false} rules />
      {scene && ready && tier ? (
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
