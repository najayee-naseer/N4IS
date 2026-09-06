import Link from "next/link";
import { projects } from "@/data/projects";

const visualClass: Record<string, string> = {
  bookmysalon: "salon",
  "ai-interview-viva-engine": "ai",
  fuellink: "fuel",
};

export function FeaturedProjects() {
  const activeProjects = projects.filter((project) => project.featured && project.active);

  return (
    <section className="featured-projects" aria-labelledby="featured-projects-title">
      <header className="featured-heading">
        <div>
          <p className="eyebrow">FEATURED PROJECTS</p>
          <h2 id="featured-projects-title">CURRENTLY<br />BUILDING</h2>
          <p className="featured-statement">Turning ideas into real technology.</p>
        </div>
        <p>A selection of projects currently in active development at N4IS.</p>
      </header>

      <div className="featured-grid">
        {activeProjects.map((project) => (
          <article className="featured-card" key={project.slug}>
            <div className={`project-visual ${visualClass[project.slug]}`} aria-label={`${project.name} abstract technology visual`} role="img">
              <span className="visual-grid" />
              <span className="visual-object" />
              <span className="visual-orbit orbit-one" />
              <span className="visual-orbit orbit-two" />
              <span className="visual-signal" />
              <div className="visual-label">N4IS / {project.number}</div>
            </div>
            <div className="featured-card-top"><span>{project.number}</span><span className="featured-status"><i /> {project.status}</span></div>
            <p className="eyebrow">{project.category}</p>
            <h3>{project.name}</h3>
            <p className="featured-description">{project.shortDescription}</p>
            <div className="featured-card-bottom">
              <div className="tag-row">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div>
              <Link href={`/projects/${project.slug}`} className="project-link">VIEW PROJECT <span>↗</span></Link>
            </div>
          </article>
        ))}
      </div>

      <div className="featured-cta">
        <p className="eyebrow">HAVE AN IDEA?</p>
        <h2>LET&apos;S BUILD SOMETHING MEANINGFUL.</h2>
        <Link href="/contact">GET IN TOUCH <span>↗</span></Link>
      </div>
    </section>
  );
}
