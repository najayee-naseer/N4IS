import { Reveal } from "@/components/ui/reveal";
import { SectionHead } from "@/components/ui/section-head";
import { ArrowLink } from "@/components/ui/arrow-link";
import { ProjectPanel } from "@/components/projects/project-panel";
import { featuredProjects } from "@/data/projects";

/**
 * The lead slot goes to whichever active project actually has real imagery —
 * data decides, not a hardcoded slug — so the section always opens on the
 * strongest visual available.
 */
export function CurrentlyBuilding() {
  const lead = featuredProjects.find((project) => project.heroImage) ?? featuredProjects[0];
  const supporting = featuredProjects.filter((project) => project !== lead);

  return (
    <section className="section building" aria-labelledby="currently-building-title">
      <div className="shell">
        <SectionHead
          index="03"
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

        {lead ? (
          <Reveal className="building__lead">
            <ProjectPanel project={lead} lead />
          </Reveal>
        ) : null}

        <div className="building__support">
          {supporting.map((project, index) => (
            <Reveal key={project.slug} delay={index * 100}>
              <ProjectPanel project={project} index={index} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
