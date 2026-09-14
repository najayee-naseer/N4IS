import Link from "next/link";
import type { Project } from "@/types/content";
import { ProjectVisual } from "./project-visual";

/**
 * The whole card is one link: the title carries a stretched overlay so there is
 * a single tab stop and a single accessible name. The "view project" affordance
 * is presentational because the card itself is already the control.
 */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="card project-card" data-cursor="view">
      <div className="project-card__head">
        <span className="label label--bright">Project {project.number}</span>
        <span className="status">
          <i />
          {project.status}
        </span>
      </div>

      <ProjectVisual project={project} />

      <div className="project-card__body">
        <p className="label label--accent">{project.category}</p>
        <h3 className={`project-card__title${project.preserveCase ? " no-caps" : ""}`}>
          <Link href={`/projects/${project.slug}`} className="project-card__link">
            {project.name}
          </Link>
        </h3>
        <p className="project-card__desc">{project.shortDescription}</p>

        <div className="project-card__foot">
          <div className="tags">
            {project.technologies.map((technology) => (
              <span key={technology}>{technology}</span>
            ))}
          </div>
          <span className="arrow-link" aria-hidden="true">
            View project <span>↗</span>
          </span>
        </div>
      </div>

      <span className="project-card__ghost" aria-hidden="true">
        {project.number}
      </span>
    </article>
  );
}
