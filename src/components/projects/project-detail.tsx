import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/types/content";
import { ProjectVisual } from "@/components/projects/project-visual";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { Reveal } from "@/components/ui/reveal";
import { ArrowLink } from "@/components/ui/arrow-link";

/**
 * The body of a project page. Shared by the public route and the admin's
 * draft preview, so a preview is exactly what will be published.
 */
export function ProjectDetail({
  project,
  previous,
  next,
}: {
  project: Project;
  previous: Project | null;
  next: Project | null;
}) {
  const links = [
    project.liveUrl ? { href: project.liveUrl, label: "Visit the live project" } : null,
    project.githubUrl ? { href: project.githubUrl, label: "View the source" } : null,
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <div className="detail section section--tight">
      <header className="detail__hero">
        <Reveal as="p" className="label label-rule" variant="fade">
          Project {project.number} — {project.category}
        </Reveal>
        <Reveal delay={60}>
          {project.logo ? (
            <Image
              className="detail__logo"
              src={project.logo.src}
              alt={project.logo.alt}
              width={project.logo.width}
              height={project.logo.height}
              sizes="120px"
            />
          ) : null}
          <h1 className={`detail__title${project.preserveCase ? " no-caps" : ""}`}>{project.name}</h1>
        </Reveal>
        <Reveal className="detail__meta" delay={120}>
          <span className="status">
            <i />
            {project.status}
          </span>
          {project.year ? <span className="label">{project.year}</span> : null}
        </Reveal>
        <Reveal delay={160}>
          <p className="lead" style={{ maxWidth: "62ch" }}>
            {project.description}
          </p>
        </Reveal>
      </header>

      <Reveal variant="wipe">
        <ProjectVisual project={project} hero />
      </Reveal>

      {project.gallery?.length ? (
        <p className="label scroll-cue">
          Scroll to explore <span aria-hidden="true">↓</span>
        </p>
      ) : null}

      <Reveal>
        <dl className="facts">
          <div>
            <dt>Category</dt>
            <dd>{project.category}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{project.status}</dd>
          </div>
          <div>
            <dt>Stage</dt>
            <dd>{project.year || project.status}</dd>
          </div>
          <div>
            <dt>Technology</dt>
            <dd>{(project.stack?.length ? project.stack : project.technologies).join(" / ") || "—"}</dd>
          </div>
        </dl>
      </Reveal>

      {project.gallery?.length ? <ProjectGallery shots={project.gallery} name={project.name} /> : null}

      {project.content.length > 0 ? (
        <section className="narrative" aria-label={`${project.name} overview`}>
          {project.content.map((item, index) => (
            <Reveal className="narrative__item" key={`${item.label}-${index}`} delay={index * 60}>
              <p className="label label--accent">{item.label}</p>
              <div>
                <h2>{item.title}</h2>
                <p>{item.body}</p>
              </div>
            </Reveal>
          ))}
        </section>
      ) : null}

      {project.stack?.length ? (
        <Reveal>
          <section className="narrative__item" aria-labelledby="project-stack">
            <p className="label label--accent">Technology</p>
            <div>
              <h2 id="project-stack">Built with</h2>
              <p>The stack the project is actually running on today.</p>
              <div className="tags" style={{ marginTop: "1.25rem" }}>
                {project.stack.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          </section>
        </Reveal>
      ) : null}

      {project.focus.length > 0 ? (
        <Reveal>
          <section className="narrative__item" aria-labelledby="project-focus">
            <p className="label label--accent">Key features in scope</p>
            <div>
              <h2 id="project-focus">What it is being built to do</h2>
              <ul className="focus-list">
                {project.focus.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>
        </Reveal>
      ) : null}

      {project.additional?.length ? (
        <ProjectGallery shots={project.additional} name={project.name} label="More from the project" />
      ) : null}

      <Reveal>
        <div className="cta-band">
          <p className="label label--accent">Project status</p>
          <h2 className="cta-band__title">{project.status}</h2>
          {links.length > 0 ? (
            <div className="hero__actions">
              {links.map((link) => (
                <ArrowLink key={link.href} href={link.href}>
                  {link.label}
                </ArrowLink>
              ))}
            </div>
          ) : (
            <p className="lead">
              This project is evolving. Public links will be added when there is an appropriate destination to
              share.
            </p>
          )}
        </div>
      </Reveal>

      <nav className="pager" aria-label="Project navigation">
        {previous ? (
          <Link href={`/projects/${previous.slug}`} className="back-link" data-cursor="link">
            <span aria-hidden="true">←</span> {previous.name}
          </Link>
        ) : (
          <span />
        )}
        {next ? <ArrowLink href={`/projects/${next.slug}`}>{next.name}</ArrowLink> : <span />}
      </nav>
    </div>
  );
}
