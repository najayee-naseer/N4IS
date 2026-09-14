import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StudioBackdrop } from "@/components/3d/studio-backdrop";
import { Reveal } from "@/components/ui/reveal";
import { Specimen } from "@/components/lab/specimen";
import { experiments, getExperiment } from "@/data/experiments";

export function generateStaticParams() {
  return experiments.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const experiment = getExperiment((await params).slug);
  if (!experiment) return { title: "Experiment not found" };
  return {
    title: experiment.title,
    description: experiment.description,
    alternates: { canonical: `/lab/${experiment.slug}` },
  };
}

export default async function LabDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const experiment = getExperiment(slug);
  if (!experiment) notFound();

  const index = experiments.findIndex((item) => item.slug === slug);

  return (
    <main id="main-content" className="page">
      <StudioBackdrop fixed variant="ambient" markers={[`N4IS / ${experiment.number}`, experiment.status]} scene={false} />

      <div className="shell" style={{ position: "relative", zIndex: 1 }}>
        <Link href="/lab" className="back-link" data-cursor="link">
          <span aria-hidden="true">←</span> N4IS Lab
        </Link>

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
              <span className="label">{experiment.date}</span>
            </Reveal>
            <Reveal delay={160}>
              <p className="lead" style={{ maxWidth: "62ch" }}>
                {experiment.description}
              </p>
            </Reveal>
          </header>

          <Reveal variant="wipe" className="lab-specimen-hero">
            <Specimen index={index} number={experiment.number} status={experiment.status} />
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
                <dd>{experiment.date}</dd>
              </div>
              <div>
                <dt>Technology</dt>
                <dd>{experiment.technologies.join(" / ")}</dd>
              </div>
            </dl>
          </Reveal>

          <section className="narrative" aria-label={`${experiment.title} notes`}>
            {experiment.content.map((item, position) => (
              <Reveal className="narrative__item" key={item.label} delay={position * 60}>
                <p className="label label--accent">{item.label}</p>
                <div>
                  <h2>{item.title}</h2>
                  <p>{item.body}</p>
                </div>
              </Reveal>
            ))}
          </section>
        </div>
      </div>
    </main>
  );
}
