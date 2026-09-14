import { Reveal } from "@/components/ui/reveal";
import { SectionHead } from "@/components/ui/section-head";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Specimen } from "@/components/lab/specimen";
import { experiments } from "@/data/experiments";

export function LabTeaser() {
  return (
    <section className="section section--tight" aria-labelledby="lab-teaser-title">
      <div className="shell">
        <SectionHead index="04" label="N4IS Lab" title={<span id="lab-teaser-title">Experiments in progress</span>}>
          <p className="lead">
            Work is a product list. The Lab is the room before it — prototypes, studies and open questions
            that may never become a project, and sometimes do.
          </p>
          <ArrowLink href="/lab">Enter the lab</ArrowLink>
        </SectionHead>

        <div className="lab-list">
          {experiments.map((experiment, index) => (
            <Reveal key={experiment.slug} delay={index * 90}>
              <article className="lab-card">
                <Specimen index={index} number={experiment.number} />
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
