import type { Metadata } from "next";
import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { StudioBackdrop } from "@/components/3d/studio-backdrop";
import { Reveal } from "@/components/ui/reveal";
import { ArrowLink, ButtonLink } from "@/components/ui/arrow-link";
import { SectionHead } from "@/components/ui/section-head";
import { activeProjects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Founder",
  description: "The person behind N4IS — an independent technology studio that is personally designed, engineered and built.",
  alternates: { canonical: "/founder" },
};

const PILLARS = [
  {
    title: "Vision",
    body: "Keep learning in public through the work: explore carefully, build with intent, and create technology that earns its place.",
  },
  {
    title: "Building",
    body: "Software, AI systems, web experiences and connected concepts — designed and engineered end to end rather than handed off.",
  },
  {
    title: "Experimentation",
    body: "Prototypes before promises. The Lab exists so ideas can be tested honestly before they are called projects.",
  },
] as const;

const NOTES = [
  [
    "About",
    "N4IS is an independent technology studio built around curiosity, practical engineering, and the belief that an idea is worth following through.",
  ],
  [
    "What I build",
    "Software, AI systems, web experiences, connected concepts, and experiments that move an idea closer to the real world.",
  ],
  [
    "Technology interests",
    "AI, web platforms, mobile experiences, IoT systems, automation, data, product design, and the space between digital and physical.",
  ],
] as const;

export default function FounderPage() {
  return (
    <main id="main-content" className="page">
      <StudioBackdrop fixed variant="ambient" markers={["N4IS / FOUNDER", "PERSONALLY BUILT"]} scene={false} />

      <div className="shell" style={{ position: "relative", zIndex: 1 }}>
        <section className="founder-hero section section--tight" aria-labelledby="founder-title">
          <Reveal variant="wipe">
            <figure className="founder-portrait">
              <Image
                src="/images/founder.png"
                alt="Portrait of the founder and CEO of N4IS"
                width={1254}
                height={1254}
                priority
                sizes="(max-width: 940px) 100vw, 42vw"
              />
              <figcaption>
                <b>Founder &amp; CEO</b>
                <span className="label">N4IS</span>
              </figcaption>
            </figure>
          </Reveal>

          <Reveal className="founder-body" delay={120}>
            <p className="label label-rule">N4IS / Independent technology studio</p>
            <h1 className="display" id="founder-title">
              The person
              <br />
              behind N4IS
            </h1>
            <span className="founder-title">
              Founder &amp; CEO <em>N4IS</em>
            </span>
            <p className="lead">
              Every product starts with an idea. N4IS started with one — and with the decision to design,
              engineer and ship it personally rather than wait for permission.
            </p>
            <p className="muted">
              The studio is run as a single practice: the same person writes the brief, draws the interface,
              builds the system, and decides when it is honest to call something finished.
            </p>
            <ButtonLink href="/contact">Work with me</ButtonLink>
          </Reveal>
        </section>

        <section className="section section--tight" aria-labelledby="founder-notes-title">
          <SectionHead index="02" label="The practice" title={<span id="founder-notes-title">How the studio works</span>} />
          <div className="pillars">
            {NOTES.map(([title, body], index) => (
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
            {PILLARS.map((pillar, index) => (
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
            {["Curious", "Learning", "Experimenting", "Building", "N4IS"].map((step, index, all) => (
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
            {activeProjects.map((project) => (
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
          <p className="muted" style={{ marginTop: "1.5rem" }}>
            Social destinations will be listed here once they are ready to share.
          </p>
        </section>
      </div>
    </main>
  );
}
