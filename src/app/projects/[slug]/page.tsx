import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StudioBackdrop } from "@/components/3d/studio-backdrop";
import { ProjectVisual } from "@/components/projects/project-visual";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { Reveal } from "@/components/ui/reveal";
import { ArrowLink } from "@/components/ui/arrow-link";
import { CtaBand } from "@/components/sections/cta-band";
import { activeProjects, getProject, getProjectNeighbours } from "@/data/projects";

export function generateStaticParams() {
  return activeProjects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.name,
    description: project.shortDescription,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { title: `${project.name} — N4IS`, description: project.shortDescription },
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  const { previous, next } = getProjectNeighbours(project.slug);

  return (
    <main id="main-content" className="page">
      <StudioBackdrop fixed variant="ambient" markers={[`N4IS / ${project.number}`, project.status]} scene={false} />

      <div className="shell" style={{ position: "relative", zIndex: 1 }}>
        <Link href="/projects" className="back-link" data-cursor="link">
          <span aria-hidden="true">←</span> All work
        </Link>

        <div className="detail section section--tight">
          <header className="detail__hero">
            <Reveal as="p" className="label label-rule" variant="fade">
              Project {project.number} — {project.category}
            </Reveal>
            <Reveal delay={60}>
              <h1 className={`detail__title${project.preserveCase ? " no-caps" : ""}`}>{project.name}</h1>
            </Reveal>
            <Reveal className="detail__meta" delay={120}>
              <span className="status">
                <i />
                {project.status}
              </span>
              <span className="label">{project.year}</span>
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
                <dd>{project.year}</dd>
              </div>
              <div>
                <dt>Technology</dt>
                <dd>{(project.stack ?? project.technologies).join(" / ")}</dd>
              </div>
            </dl>
          </Reveal>

          {project.gallery?.length ? <ProjectGallery shots={project.gallery} name={project.name} /> : null}

          <section className="narrative" aria-label={`${project.name} overview`}>
            {project.content.map((item, index) => (
              <Reveal className="narrative__item" key={item.label} delay={index * 60}>
                <p className="label label--accent">{item.label}</p>
                <div>
                  <h2>{item.title}</h2>
                  <p>{item.body}</p>
                </div>
              </Reveal>
            ))}
          </section>

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

          <Reveal>
            <div className="cta-band">
              <p className="label label--accent">Project status</p>
              <h2 className="cta-band__title">{project.status}</h2>
              <p className="lead">
                This project is evolving. Public links will be added when there is an appropriate destination
                to share.
              </p>
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
      </div>

      <CtaBand title="Want to build something like this?" />
    </main>
  );
}
