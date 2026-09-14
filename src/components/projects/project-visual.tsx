import Image from "next/image";
import type { Project } from "@/types/content";

/**
 * Product visuals are built procedurally from the design system rather than
 * faked as screenshots. Where a project has real imagery in `image`/`heroImage`
 * that artwork is used instead, with no code change required.
 */
function Stage({ project }: { project: Project }) {
  if (project.slug === "ai-interview-viva-engine") {
    return (
      <div className="visual__stage">
        <span className="vcore">
          <i />
        </span>
        <span className="vpanel vpanel--q">
          <b>Question</b>
          <i>Context / adaptive</i>
          <span className="vbar vbar--accent" style={{ width: "80%" }} />
          <span className="vbar" style={{ width: "55%" }} />
        </span>
        <span className="vpanel vpanel--score">
          <b>Evaluation</b>
          <i>Under review</i>
          <span className="vbar" style={{ width: "62%" }} />
          <em>Human in the loop</em>
        </span>
      </div>
    );
  }

  if (project.slug === "fuellink") {
    return (
      <div className="visual__stage">
        <span className="vsignal" />
        <span className="vsignal vsignal--2" />
        <span className="vsignal vsignal--3" />
        <span className="vdevice">
          <b />
          <i>Fuellink</i>
          <em>GPS · Cellular</em>
        </span>
        <span className="vpanel vpanel--link">
          <b>Signal</b>
          <i>Device linked</i>
          <span className="vbar vbar--accent" style={{ width: "88%" }} />
          <em>Location · status</em>
        </span>
      </div>
    );
  }

  return <div className="visual__stage" />;
}

export function ProjectVisual({
  project,
  hero = false,
  className = "",
}: {
  project: Project;
  hero?: boolean;
  className?: string;
}) {
  const source = hero ? (project.heroImage ?? project.image) : project.image;
  const classes = `visual visual--${project.slug}${hero ? " visual--hero" : ""} ${className}`.trim();

  // A project with real build imagery shows it, framed as a product showcase.
  if (source) {
    return (
      <div className={`${classes} visual--shot`}>
        <span className="visual__glow" />
        {/* the frame carries the inset; next/image with `fill` pins to it */}
        <span className="visual__shot-frame">
          <Image
            className="visual__shot"
            src={source}
            alt={`${project.name} — a screen from the current build`}
            fill
            priority={hero}
            sizes={hero ? "(max-width: 900px) 100vw, 60vw" : "(max-width: 900px) 100vw, (max-width: 1200px) 50vw, 45vw"}
            style={{ objectFit: hero ? "contain" : "cover" }}
          />
        </span>
        {hero ? null : <span className="visual__veil" />}
        <span className="visual__floor" />
        <span className="visual__tag">
          N4IS / {project.number} — {project.category}
        </span>
      </div>
    );
  }

  return (
    <div className={classes} role="img" aria-label={`${project.name} — conceptual product visual`}>
      <span className="visual__glow" />
      <span className="visual__grid" />
      <Stage project={project} />
      <span className="visual__scan" />
      <span className="visual__tag">
        N4IS / {project.number} — {project.category}
      </span>
    </div>
  );
}
