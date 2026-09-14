import type { Metadata } from "next";
import Link from "next/link";
import { StudioBackdrop } from "@/components/3d/studio-backdrop";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Specimen } from "@/components/lab/specimen";
import { experiments } from "@/data/experiments";

export const metadata: Metadata = {
  title: "Lab",
  description: "N4IS Lab — experiments, prototypes, ideas and research that sit before the project list.",
};

const MODES = ["Experiments", "Prototypes", "Ideas", "Research"];

export default function LabPage() {
  return (
    <main id="main-content" className="page">
      <StudioBackdrop fixed variant="ambient" markers={["N4IS / LAB", "EXPERIMENTAL DIVISION"]} />

      <div className="shell" style={{ position: "relative", zIndex: 1 }}>
        <PageHero
          label="N4IS / Experimental division"
          title="Lab"
          lead="Work is the product list. The Lab is the room before it."
          support="Experiments, prototypes and open questions. Nothing here is a finished product, and some of it never will be — that is the point of having the room."
        />

        <Reveal className="lab-meta" variant="fade">
          {MODES.map((mode) => (
            <span className="label label--bright" key={mode}>
              {mode}
            </span>
          ))}
        </Reveal>

        <div className="lab-list section section--tight">
          {experiments.map((experiment, index) => (
            <Reveal key={experiment.slug} delay={index * 90}>
              <article className="lab-card">
                <Specimen index={index} number={experiment.number} status={experiment.status} />
                <div className="lab-card__body">
                  <p className="label label--accent">
                    {experiment.category} — {experiment.status}
                  </p>
                  <h2 className="lab-card__title">
                    <Link href={`/lab/${experiment.slug}`} data-cursor="link">
                      {experiment.title}
                    </Link>
                  </h2>
                  <p className="muted">{experiment.description}</p>
                  <div className="tags">
                    {experiment.technologies.map((technology) => (
                      <span key={technology}>{technology}</span>
                    ))}
                  </div>
                </div>
                <ArrowLink href={`/lab/${experiment.slug}`}>Open</ArrowLink>
              </article>
            </Reveal>
          ))}

          <Reveal className="lab-note" delay={120}>
            <p className="label label--accent">Ongoing</p>
            <h2 className="h3">The list stays open.</h2>
            <p className="muted">
              Experiments are added when there is something real to show. A study that earns it moves across
              into Work.
            </p>
          </Reveal>
        </div>
      </div>
    </main>
  );
}
