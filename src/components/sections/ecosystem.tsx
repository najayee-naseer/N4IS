import { Reveal } from "@/components/ui/reveal";
import { BrandMark } from "@/components/ui/brand-mark";
import { Atmosphere } from "@/components/atmosphere/atmosphere";
import { ProjectVisual } from "@/components/projects/project-visual";
import { featuredProjects } from "@/data/projects";

const DISCIPLINES = ["AI", "SOFTWARE", "WEB", "MOBILE", "IOT", "EMBEDDED"] as const;
const NODE_X = [12.5, 37.5, 62.5, 87.5];

/**
 * N4IS is not a list of unrelated projects — it is one studio's practice,
 * branching into different disciplines. The paths here are drawn from the
 * same arch language as the hero corridor: architecture connecting a centre
 * to its work, not a generic node-and-line diagram. Each project reads as
 * the same interface fragment used everywhere else on the site — real
 * screenshot where one exists, the procedural stage otherwise.
 */
export function Ecosystem() {
  return (
    <section className="section ecosystem-section" aria-labelledby="ecosystem-title">
      <Atmosphere tone="calm" beam={false} />
      <div className="shell">
        <p className="label label-rule">
          <span className="label--accent">04</span> The N4IS ecosystem
        </p>
        <h2 className="ecosystem__title" id="ecosystem-title">
          One studio.
          <br />
          Several disciplines.
        </h2>
        <p className="lead ecosystem__lead">
          N4IS doesn&apos;t build products in isolation. Every project draws on the same practice —
          software, AI, hardware and design — branching outward from one studio.
        </p>

        <Reveal className="ecosystem" variant="fade" delay={100}>
          <div className="ecosystem__stage">
            <svg
              className="ecosystem__paths"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
              focusable="false"
            >
              {NODE_X.map((x) => (
                <path key={x} d={`M50,6 C50,40 ${x},40 ${x},97`} />
              ))}
            </svg>

            <div className="ecosystem__core">
              <BrandMark variant="monogram" alt="N4IS" sizes="72px" />
              <b>N4IS</b>
              <i>Independent studio</i>
            </div>

            <div className="ecosystem__nodes">
              {featuredProjects.map((project) => (
                <div className="ecosystem__node" key={project.slug}>
                  <div className="ecosystem__node-visual">
                    <ProjectVisual project={project} />
                  </div>
                  <b className={project.preserveCase ? "no-caps" : undefined}>{project.name}</b>
                  <span className="label">{project.category.split(" / ")[0]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="tags ecosystem__tags">
            {DISCIPLINES.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
