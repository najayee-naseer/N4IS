import { Fragment } from "react";
import { Reveal } from "@/components/ui/reveal";
import { SectionHead } from "@/components/ui/section-head";
import { ArrowLink } from "@/components/ui/arrow-link";
import { LabPlate } from "@/components/lab/lab-plate";
import type { Experiment } from "@/types/content";

const VOCAB = ["EXPERIMENT", "PROTOTYPE", "RESEARCH", "TEST", "LEARN", "REPEAT"] as const;

export function LabTeaser({ experiments, title, lead }: { experiments: Experiment[]; title: string; lead: string }) {
  return (
    <section className="section section--tight lab-teaser" data-env="lab" aria-labelledby="lab-teaser-title">
      <div className="shell">
        <SectionHead index="06" label="N4IS Lab" title={<span id="lab-teaser-title">{title}</span>}>
          {lead ? <p className="lead">{lead}</p> : null}
          <ArrowLink href="/lab">Enter the lab</ArrowLink>
        </SectionHead>

        <div className="lab-teaser__vocab" aria-hidden="true">
          {VOCAB.map((word, index) => (
            <Fragment key={word}>
              <span>{word}</span>
              {index < VOCAB.length - 1 ? <i>→</i> : null}
            </Fragment>
          ))}
        </div>

        <div className="lab-list">
          {experiments.map((experiment, index) => (
            <Reveal key={experiment.slug} delay={index * 90}>
              <article className="lab-card">
                <LabPlate experiment={experiment} index={index} showStatus={false} />
                <div className="lab-card__body">
                  <p className="label label--accent">
                    {experiment.number} — {experiment.status}
                  </p>
                  <h3 className="lab-card__title">{experiment.title}</h3>
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
        </div>
      </div>
    </section>
  );
}
