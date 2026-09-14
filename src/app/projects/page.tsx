import type { Metadata } from "next";
import { StudioBackdrop } from "@/components/3d/studio-backdrop";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { ProjectPanel } from "@/components/projects/project-panel";
import { CtaBand } from "@/components/sections/cta-band";
import { activeProjects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Work",
  description: "Projects currently being built at N4IS — things we build, experiment with, and bring to life.",
  alternates: { canonical: "/projects" },
};

export default function WorkPage() {
  return (
    <main id="main-content" className="page work-page">
      <StudioBackdrop fixed variant="ambient" markers={["N4IS / Work", `${activeProjects.length} Active`]} />

      <div className="shell" style={{ position: "relative", zIndex: 1 }}>
        <PageHero
          label="Projects"
          title="Work"
          lead="Things we build, experiment with, and bring to life."
          support="A curated archive of the projects currently in active development at N4IS. Each one is shown at its real stage — no finished claims before the work is finished."
        >
          <Reveal className="work-index" variant="fade" delay={200}>
            {activeProjects.map((project) => (
              <span key={project.slug}>
                <b>{project.number}</b>
                <i className={project.preserveCase ? "no-caps" : undefined}>{project.name}</i>
                <em>{project.status}</em>
              </span>
            ))}
          </Reveal>
        </PageHero>

        <div className="work-panels section section--tight">
          {activeProjects.map((project, index) => (
            <Reveal key={project.slug} delay={index * 70}>
              <ProjectPanel project={project} lead={Boolean(project.heroImage)} index={index} />
            </Reveal>
          ))}
        </div>
      </div>

      <CtaBand />
    </main>
  );
}
