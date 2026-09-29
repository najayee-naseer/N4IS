import { Reveal } from "@/components/ui/reveal";
import { SectionHead } from "@/components/ui/section-head";
import { ArrowLink } from "@/components/ui/arrow-link";
import { ProjectPanel } from "@/components/projects/project-panel";
import { Lines } from "@/components/ui/lines";
import type { Project } from "@/types/content";

/**
 * Every active project gets a full editorial moment, not a slot in a card
 * grid — the project with real build imagery leads, at the largest
 * treatment on the page, then the rest follow in sequence, each one
 * changing register slightly with what it actually is: a booking platform,
 * a conversation engine, a piece of hardware. Data decides the lead, not a
 * hardcoded slug, so the section always opens on the strongest visual N4IS
 * actually has.
 */
export function CurrentlyBuilding({ projects, title, lead: intro }: { projects: Project[]; title: string; lead: string }) {
  const lead = projects.find((project) => project.heroImage) ?? projects[0];
  const ordered = lead ? [lead, ...projects.filter((project) => project !== lead)] : projects;

  return (
    <section className="section building" data-env="projects" aria-labelledby="currently-building-title">
      <div className="shell">
        <SectionHead
          index="05"
          label="Active projects"
          title={
            <span id="currently-building-title">
              <Lines text={title} />
            </span>
          }
        >
          {intro ? <p className="lead">{intro}</p> : null}
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
