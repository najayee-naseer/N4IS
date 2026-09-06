import Image from "next/image";
import type { Project } from "@/types/content";

export function ProjectVisual({ project, hero = false }: { project: Project; hero?: boolean }) {
  if ((hero ? project.heroImage : project.image) !== null) {
    const source = hero ? project.heroImage : project.image;
    return <div className={`project-showcase ${project.slug} ${hero ? "is-hero" : ""}`}><Image src={source!} alt={`${project.name} project visual`} fill sizes={hero ? "(max-width: 760px) 100vw, 50vw" : "(max-width: 760px) 100vw, 33vw"} /></div>;
  }

  return <div className={`project-showcase ${project.slug} ${hero ? "is-hero" : ""}`} role="img" aria-label={`${project.name} conceptual product visual`}>
    <span className="showcase-grid" />
    <span className="showcase-light" />
    {project.slug === "bookmysalon" && <><span className="showcase-panel panel-one"><b>BOOK</b><i>09:30</i><em /></span><span className="showcase-panel panel-two"><b>DISCOVER</b><i>STUDIO / 01</i></span><span className="showcase-device" /></>}
    {project.slug === "ai-interview-viva-engine" && <><span className="showcase-core" /><span className="showcase-neural neural-one" /><span className="showcase-neural neural-two" /><span className="showcase-question">Q / CONTEXT</span><span className="showcase-score">EVALUATION / ACTIVE</span></>}
    {project.slug === "fuellink" && <><span className="showcase-device fuel-device"><b>FUEL</b><i>HELP</i><em>GPS / 4G</em></span><span className="showcase-signal signal-one" /><span className="showcase-signal signal-two" /><span className="showcase-connection">CONNECTED / READY</span></>}
    <span className="showcase-mark">N4IS / PROJECT {project.number}</span>
  </div>;
}
