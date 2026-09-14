"use client";

import dynamic from "next/dynamic";
import { useSceneCapabilities } from "./use-scene-capabilities";

/**
 * The N4IS artifact, presented the way a product would be: in a lit frame with
 * its own annotations, never behind the headline. This is the site's one
 * primary WebGL scene — the ambient backdrops elsewhere are a smaller version
 * of it.
 */
const StudioScene = dynamic(() => import("./studio-scene"), { ssr: false });

export function StudioObject() {
  const { tier, reducedMotion, ready } = useSceneCapabilities();

  return (
    <div className="studio-object" aria-hidden="true">
      <span className="studio-object__light" />
      <span className="studio-object__halo" />
      <span className="studio-object__frame" />
      <span className="studio-object__plinth" />
      {ready && tier ? <StudioScene tier={tier} reducedMotion={reducedMotion} variant="hero" /> : null}
      <span className="studio-object__tick studio-object__tick--tl" />
      <span className="studio-object__tick studio-object__tick--br" />
      <span className="studio-object__caption">N4IS / Artifact 01</span>
      <span className="studio-object__readout">Ceramic · Chrome · Glass</span>
    </div>
  );
}
