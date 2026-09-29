import type { Experiment } from "@/types/content";
import { Reveal } from "@/components/ui/reveal";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { LabPlate } from "./lab-plate";

/** The body of a Lab entry page — shared by the public route and the admin preview. */
export function LabDetail({ experiment, index }: { experiment: Experiment; index: number }) {
  return (
    <div className="detail section section--tight">
      <header className="detail__hero">
        <Reveal as="p" className="label label-rule" variant="fade">
          Experiment {experiment.number} — {experiment.category}
        </Reveal>
        <Reveal delay={60}>
          <h1 className="detail__title">{experiment.title}</h1>
        </Reveal>
        <Reveal className="detail__meta" delay={120}>
          <span className="status status--quiet">
            <i />
            {experiment.status}
          </span>
          {experiment.date ? <span className="label">{experiment.date}</span> : null}
        </Reveal>
        <Reveal delay={160}>
          <p className="lead" style={{ maxWidth: "62ch" }}>
            {experiment.body ?? experiment.description}
          </p>
        </Reveal>
      </header>

      <Reveal variant="wipe" className="lab-specimen-hero">
        <LabPlate experiment={experiment} index={index} sizes="(max-width: 900px) 100vw, 80vw" />
      </Reveal>

      <Reveal>
        <dl className="facts">
          <div>
            <dt>Category</dt>
            <dd>{experiment.category}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{experiment.status}</dd>
          </div>
          <div>
            <dt>Date</dt>
            <dd>{experiment.date || "—"}</dd>
          </div>
          <div>
            <dt>Technology</dt>
            <dd>{experiment.technologies.join(" / ") || "—"}</dd>
          </div>
        </dl>
      </Reveal>

      {experiment.gallery?.length ? (
        <ProjectGallery shots={experiment.gallery} name={experiment.title} label="From the experiment" />
      ) : null}

      {experiment.content.length > 0 ? (
        <section className="narrative" aria-label={`${experiment.title} notes`}>
          {experiment.content.map((item, position) => (
            <Reveal className="narrative__item" key={`${item.label}-${position}`} delay={position * 60}>
              <p className="label label--accent">{item.label}</p>
              <div>
                <h2>{item.title}</h2>
                <p>{item.body}</p>
              </div>
            </Reveal>
          ))}
        </section>
      ) : null}
    </div>
  );
}
