import { Fragment } from "react";
import type { Metadata } from "next";
import { StudioBackdrop } from "@/components/3d/studio-backdrop";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { CtaBand } from "@/components/sections/cta-band";
import { principles, process } from "@/data/site";

export const metadata: Metadata = {
  title: "About",
  description: "About N4IS — what the studio is, why it exists, what it builds, and how an idea becomes a project.",
  alternates: { canonical: "/about" },
};

const STATEMENTS = [
  [
    "What N4IS is",
    "An independent technology studio — a place to explore ideas and turn the strongest ones into real things. It is one practice, not an agency and not a résumé.",
  ],
  [
    "Why it exists",
    "Because curiosity gets more interesting when it becomes practical. N4IS exists to keep asking what could be built next, and then to actually build it.",
  ],
  [
    "What it builds",
    "Software, AI systems, web applications, mobile experiences, IoT concepts, and experimental technology — usually more than one of those at once.",
  ],
  [
    "How ideas become projects",
    "An idea starts in the Lab as a study or prototype. If it survives the questions, it moves into Work with a number, a status and a real scope. Nothing skips that step.",
  ],
  [
    "Technology philosophy",
    "Start with the question. Learn the constraints. Design the experience. Engineer the system. Keep refining. Technology should earn its place, not announce itself.",
  ],
  [
    "Where it is going",
    "Forward, one considered experiment and product at a time — with new interactions, connected systems and intelligent tools as the areas worth pushing on.",
  ],
] as const;

export default function AboutPage() {
  return (
    <main id="main-content" className="page">
      <StudioBackdrop fixed variant="ambient" markers={["N4IS / MANIFESTO", "IDEAS → REAL WORLD"]} />

      <div className="shell" style={{ position: "relative", zIndex: 1 }}>
        <PageHero
          label="N4IS / Manifesto"
          title="About"
          lead="An independent technology studio for ideas that deserve to become real."
          support="This page is the studio explaining itself: what it is, why it exists, and the order it works in."
        />

        <Reveal className="about-lede" variant="fade">
          <p className="about-statement">
            N4IS exists to find out whether an idea holds up.{" "}
            <span>Everything on this site is the result of following one far enough to know.</span>
          </p>
          <p className="muted">
            The studio is one practice: the brief, the interface, the system and the decision about when
            something is honestly finished all happen in the same place.
          </p>
        </Reveal>

        <Reveal className="chain section--tight" variant="fade">
          {process.map((word, index) => (
            <Fragment key={word}>
              <b>{word}</b>
              {index < process.length - 1 ? <i aria-hidden="true">→</i> : null}
            </Fragment>
          ))}
        </Reveal>

        <section className="statements section section--tight" aria-label="About N4IS">
          {STATEMENTS.map(([title, body], index) => (
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
            How N4IS builds
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
