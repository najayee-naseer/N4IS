import type { Metadata } from "next";
import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { Environment } from "@/components/environment/environment";
import { Reveal } from "@/components/ui/reveal";
import { ArrowLink, ButtonLink } from "@/components/ui/arrow-link";
import { SectionHead } from "@/components/ui/section-head";
import { notFound } from "next/navigation";
import { Lines } from "@/components/ui/lines";
import { getFounder, getProjects } from "@/lib/cms/queries";

export const metadata: Metadata = {
  title: "Founder",
  description: "The person behind N4IS — an independent technology studio that is personally designed, engineered and built.",
  alternates: { canonical: "/founder" },
};

export default async function FounderPage() {
  const [founder, projects] = await Promise.all([getFounder(), getProjects()]);
  if (!founder.published) notFound();
  const { content } = founder;

  return (
    <main id="main-content" className="page">
      <Environment station="quiet" />

      <div className="shell" style={{ position: "relative", zIndex: 1 }}>
        <section className="founder-hero section section--tight" aria-labelledby="founder-title">
          <Reveal variant="wipe">
            <figure className="founder-portrait">
              {founder.photo ? (
                <Image
                  src={founder.photo.src}
                  alt={founder.photo.alt}
                  width={founder.photo.width}
                  height={founder.photo.height}
                  priority
                  sizes="(max-width: 940px) 100vw, 42vw"
                />
              ) : null}
              <figcaption>
                <b>{founder.name || founder.role}</b>
                <span className="label">{founder.name ? founder.role : "N4IS"}</span>
              </figcaption>
            </figure>
          </Reveal>

          <Reveal className="founder-body" delay={120}>
            {content.eyebrow ? <p className="label label-rule">{content.eyebrow}</p> : null}
            <h1 className="display" id="founder-title">
              <Lines text={content.headline} />
            </h1>
            <span className="founder-title">
              {founder.name ? `${founder.name} · ` : ""}
              {founder.role} <em>N4IS</em>
            </span>
            <p className="lead">{content.lead}</p>
            {content.body ? <p className="muted">{content.body}</p> : null}
            <ButtonLink href="/contact">{content.ctaLabel}</ButtonLink>
          </Reveal>
        </section>

        <section className="section section--tight" aria-labelledby="founder-notes-title">
          <SectionHead index="02" label="The practice" title={<span id="founder-notes-title">How the studio works</span>} />
          <div className="pillars">
            {content.notes.map(({ title, body }, index) => (
              <Reveal className="pillar" key={title} delay={index * 90}>
                <p className="label label--accent">0{index + 1}</p>
                <h3>{title}</h3>
                <p>{body}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section section--tight" aria-labelledby="founder-pillars-title">
          <SectionHead index="03" label="Direction" title={<span id="founder-pillars-title">What drives the work</span>} />
          <div className="pillars">
            {content.pillars.map((pillar, index) => (
              <Reveal className="pillar" key={pillar.title} delay={index * 90}>
                <p className="label label--accent">0{index + 1}</p>
                <h3>{pillar.title}</h3>
                <p>{pillar.body}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section section--tight" aria-labelledby="founder-journey-title">
          <SectionHead index="04" label="The N4IS journey" title={<span id="founder-journey-title">Curious to building</span>} />
          <Reveal className="chain">
            {content.journey.map((step, index, all) => (
              <Fragment key={step}>
                <b>{step}</b>
                {index < all.length - 1 ? <i aria-hidden="true">→</i> : null}
              </Fragment>
            ))}
          </Reveal>
        </section>

        <section className="section section--tight" aria-labelledby="founder-projects-title">
          <SectionHead index="05" label="Currently building" title={<span id="founder-projects-title">The active list</span>}>
            <p className="lead">Every active project is personally led — the brief, the interface and the engineering.</p>
          </SectionHead>
          <div className="statements">
            {projects.map((project) => (
              <Reveal className="statement" key={project.slug}>
                <span className="statement__index">{project.number}</span>
                <h2 className={project.preserveCase ? "no-caps" : undefined}>
                  <Link href={`/projects/${project.slug}`} data-cursor="link">
                    {project.name}
                  </Link>
                </h2>
                <div>
                  <p>{project.shortDescription}</p>
                  <ArrowLink href={`/projects/${project.slug}`} className="mt">
                    View project
                  </ArrowLink>
                </div>
              </Reveal>
            ))}
          </div>
          {founder.socialLinks.length > 0 ? (
            <div className="tags" style={{ marginTop: "1.5rem" }}>
              {founder.socialLinks.map((link) => (
                <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" data-cursor="link">
                  {link.label} ↗
                </a>
              ))}
            </div>
          ) : (
            <p className="muted" style={{ marginTop: "1.5rem" }}>
              Social destinations will be listed here once they are ready to share.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
