import type { Metadata } from "next";
import { Environment } from "@/components/environment/environment";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { ProjectPanel } from "@/components/projects/project-panel";
import { CtaBand } from "@/components/sections/cta-band";
import { getProjects } from "@/lib/cms/queries";

export const metadata: Metadata = {
  title: "Work",
  description: "Projects currently being built at N4IS — things we build, experiment with, and bring to life.",
  alternates: { canonical: "/projects" },
};

export default async function WorkPage() {
  const projects = await getProjects();

  return (
    <main id="main-content" className="page work-page">
      <Environment station="page" />

      <div className="shell" style={{ position: "relative", zIndex: 1 }}>
        <PageHero
          label="Projects"
          title="Work"
          lead="Things we build, experiment with, and bring to life."
          support="A curated archive of the projects currently in active development at N4IS. Each one is shown at its real stage — no finished claims before the work is finished."
        >
          <Reveal className="work-index" variant="fade" delay={200}>
            {projects.map((project) => (
              <span key={project.slug}>
                <b>{project.number}</b>
                <i className={project.preserveCase ? "no-caps" : undefined}>{project.name}</i>
                <em>{project.status}</em>
              </span>
            ))}
          </Reveal>
        </PageHero>

        <div className="work-panels section section--tight">
          {projects.map((project, index) => (
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
