import type { Metadata } from "next";
import { StudioBackdrop } from "@/components/3d/studio-backdrop";
import { Reveal } from "@/components/ui/reveal";
import { ContactForm } from "@/components/contact/contact-form";
import { process } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a conversation with N4IS — bring a question, an early concept, or a problem worth exploring.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main id="main-content" className="page">
      <StudioBackdrop fixed variant="ambient" markers={["N4IS / CONTACT", "LET'S BUILD"]} />

      <div className="shell" style={{ position: "relative", zIndex: 1 }}>
        <header className="page-hero">
          <Reveal as="p" className="label label-rule" variant="fade">
            N4IS / Contact
          </Reveal>
          <Reveal delay={60}>
            <h1 className="page-hero__title">
              Have an idea?
              <br />
              Let&apos;s build something<i className="dot-accent">.</i>
            </h1>
          </Reveal>
          <Reveal className="page-hero__copy" delay={140}>
            <p className="lead">Bring a question, an early concept, or a problem worth exploring.</p>
            <p className="muted">
              The studio is small on purpose, so every message is read by the person who would actually build
              the thing.
            </p>
          </Reveal>
        </header>

        <section className="contact-layout section section--tight" aria-label="Contact N4IS">
          <Reveal className="contact-form-panel">
            <span className="contact-form-panel__glow" aria-hidden="true" />
            <ContactForm />
          </Reveal>

          <Reveal className="contact-aside" delay={120}>
            <div className="contact-card">
              <p className="label label--accent">What happens next</p>
              <h2 className="h3">A real reply, not a funnel.</h2>
              <p className="muted">
                Messages are read directly. If the idea is a fit, the next step is usually a conversation about
                the problem before anything is scoped.
              </p>
            </div>

            <div className="contact-card">
              <p className="label label--accent">Good things to send</p>
              <ul className="focus-list" style={{ marginTop: 0 }}>
                <li>An idea you want built properly</li>
                <li>A product problem that needs engineering, not just design</li>
                <li>A collaboration on software, AI or connected hardware</li>
                <li>A question about anything in Work or the Lab</li>
              </ul>
            </div>

            <div className="contact-card">
              <p className="label label--accent">The working order</p>
              <p className="muted" style={{ fontFamily: "var(--mono)", fontSize: "0.75rem", letterSpacing: "0.12em" }}>
                {process.join(" → ")}
              </p>
            </div>
          </Reveal>
        </section>
      </div>
    </main>
  );
}
