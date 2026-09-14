import { Reveal } from "@/components/ui/reveal";
import { Atmosphere } from "@/components/atmosphere/atmosphere";
import { SectionHead } from "@/components/ui/section-head";
import { ArrowLink } from "@/components/ui/arrow-link";
import { ProjectPanel } from "@/components/projects/project-panel";
import { featuredProjects } from "@/data/projects";

/**
 * Every active project gets a full editorial moment, not a slot in a card
 * grid — the project with real build imagery leads, at the largest
 * treatment on the page, then the rest follow in sequence, each one
 * changing register slightly with what it actually is: a booking platform,
 * a conversation engine, a piece of hardware. Data decides the lead, not a
 * hardcoded slug, so the section always opens on the strongest visual N4IS
 * actually has.
 */
export function CurrentlyBuilding() {
  const lead = featuredProjects.find((project) => project.heroImage) ?? featuredProjects[0];
  const ordered = lead ? [lead, ...featuredProjects.filter((project) => project !== lead)] : featuredProjects;

  return (
    <section className="section building" aria-labelledby="currently-building-title">
      <Atmosphere tone="studio" beam={false} forms={false} />
      <div className="shell">
        <SectionHead
          index="05"
          label="Active projects"
          title={
            <span id="currently-building-title">
              Currently
              <br />
              Building
            </span>
          }
        >
          <p className="lead">
            Four projects in active development. Each one is shown as it actually stands — in progress,
            in prototype, still being shaped.
          </p>
          <ArrowLink href="/projects">All work</ArrowLink>
        </SectionHead>

        <div className="building__panels">
          {ordered.map((project, index) => (
            <Reveal key={project.slug} delay={index === 0 ? 0 : 60} data-tone={project.slug}>
              <ProjectPanel project={project} lead index={index} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
