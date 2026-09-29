import { Fragment } from "react";
import type { Metadata } from "next";
import { Environment } from "@/components/environment/environment";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { CtaBand } from "@/components/sections/cta-band";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAbout, getSettings } from "@/lib/cms/queries";

export const metadata: Metadata = {
  title: "About",
  description: "About N4IS — what the studio is, why it exists, what it builds, and how an idea becomes a project.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const [about, settings] = await Promise.all([getAbout(), getSettings()]);
  if (!about.published) notFound();
  const { content } = about;
  const { process, principles } = settings.content;

  return (
    <main id="main-content" className="page">
      <Environment station="page" />

      <div className="shell" style={{ position: "relative", zIndex: 1 }}>
        <PageHero
          label={content.label}
          title={content.title}
          lead={content.lead}
          support={content.support}
        />

        <Reveal className="about-lede" variant="fade">
          <p className="about-statement">
            {content.statement} <span>{content.statementEmphasis}</span>
          </p>
          {content.intro ? <p className="muted">{content.intro}</p> : null}
        </Reveal>

        {about.image ? (
          <Reveal variant="wipe">
            <figure className="about-figure">
              <Image
                src={about.image.src}
                alt={about.image.alt}
                width={about.image.width}
                height={about.image.height}
                sizes="(max-width: 900px) 100vw, 80vw"
              />
            </figure>
          </Reveal>
        ) : null}

        <Reveal className="chain section--tight" variant="fade">
          {process.map((word, index) => (
            <Fragment key={word}>
              <b>{word}</b>
              {index < process.length - 1 ? <i aria-hidden="true">→</i> : null}
            </Fragment>
          ))}
        </Reveal>

        <section className="statements section section--tight" aria-label="About N4IS">
          {content.statements.map(({ title, body }, index) => (
            <Reveal className="statement" key={title} delay={index * 60}>
              <span className="statement__index">{String(index + 1).padStart(2, "0")}</span>
              <h2>{title}</h2>
              <p>{body}</p>
            </Reveal>
          ))}
        </section>

        <section className="section section--tight" aria-labelledby="about-principles">
          <Reveal as="p" className="label label-rule" variant="fade">
            The rules the work follows
          </Reveal>
          <h2 className="h2" id="about-principles" style={{ margin: "1.25rem 0 2rem" }}>
            {content.principlesTitle}
          </h2>
          <div className="principles" style={{ marginTop: 0 }}>
            {principles.map((principle, index) => (
              <Reveal className="principle" key={principle.title} delay={index * 80}>
                <p className="label label--accent">0{index + 1}</p>
                <h3>{principle.title}</h3>
                <p>{principle.body}</p>
              </Reveal>
            ))}
          </div>
        </section>
      </div>

      <CtaBand label="Still reading?" title="Then let's build something." />
    </main>
  );
}
