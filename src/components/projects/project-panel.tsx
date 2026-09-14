import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/types/content";
import { ProjectVisual } from "./project-visual";

/**
 * A project presented the way a product launch is: the visual leads, a short
 * statement follows, the metadata sits underneath as an editorial byline.
 * `lead` gives the panel the full width and the larger type.
 */
export function ProjectPanel({
  project,
  lead = false,
  index = 0,
}: {
  project: Project;
  lead?: boolean;
  index?: number;
}) {
  const heading = `project-panel-${project.slug}`;

  return (
    <article
      className={`panel${lead ? " panel--lead" : ""}${index % 2 === 1 ? " panel--flip" : ""}`}
      aria-labelledby={heading}
      data-cursor="view"
    >
      <div className="panel__stage">
        <span className="panel__stage-glow" />
        {lead && project.heroImage ? (
          <div className="panel__shot">
            <Image
              src={project.heroImage}
              alt={`${project.name} — screens from the current build`}
              width={project.heroImageWidth ?? 1280}
              height={project.heroImageHeight ?? 860}
              sizes="(max-width: 900px) 92vw, 56vw"
              className="panel__shot-img"
              priority={false}
            />
          </div>
        ) : (
          <ProjectVisual project={project} />
        )}
        <span className="panel__stage-floor" />
      </div>

      <div className="panel__body">
        <div className="panel__meta">
          <span className="label label--bright">Project {project.number}</span>
          <span className="status">
            <i />
            {project.status}
          </span>
        </div>

        <p className="label label--accent">{project.category}</p>

        <h3 className={`panel__title${project.preserveCase ? " no-caps" : ""}`} id={heading}>
          <Link href={`/projects/${project.slug}`} className="panel__link">
            {project.name}
          </Link>
        </h3>

        <p className="panel__desc">{lead ? project.description : project.shortDescription}</p>

        <div className="tags">
          {project.technologies.map((technology) => (
            <span key={technology}>{technology}</span>
          ))}
        </div>

        <span className="arrow-link panel__cta" aria-hidden="true">
          View project <span>↗</span>
        </span>
      </div>
    </article>
  );
}
