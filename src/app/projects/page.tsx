import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "@/data/projects";
import { ProjectVisual } from "@/components/projects/project-visual";

export const metadata: Metadata = { title: "Work", description: "A selection of projects currently being developed at N4IS." };

export default function ProjectsPage() {
  const activeProjects = projects.filter((project) => project.active);

  return <main id="main-content" className="page work-page">
    <section className="work-intro" aria-labelledby="work-title">
      <p className="eyebrow">PROJECTS</p><h1 id="work-title">WORK</h1>
      <div><p>Things we build, experiment with, and bring to life.</p><p>A selection of projects currently being developed at N4IS.</p></div>
    </section>
    <section className="work-grid" aria-label="Active N4IS projects">
      {activeProjects.map((project) => <article className="work-card" key={project.slug}>
        <div className="work-card-header"><span>PROJECT {project.number}</span><span className="work-status"><i /> {project.status}</span></div>
        <ProjectVisual project={project} />
        <p className="eyebrow">{project.category}</p><h2>{project.name}</h2><p className="work-description">{project.shortDescription}</p>
        <footer><div className="tag-row">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div><Link href={`/projects/${project.slug}`}>VIEW PROJECT <span>↗</span></Link><b className="work-card-number">{project.number}</b></footer>
      </article>)}
    </section>
    <section className="work-cta"><p className="eyebrow">HAVE AN IDEA?</p><h2>LET&apos;S BUILD SOMETHING MEANINGFUL.</h2><Link href="/contact">GET IN TOUCH <span>↗</span></Link></section>
  </main>;
}
