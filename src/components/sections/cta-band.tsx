import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/arrow-link";
import { StudioBackdrop } from "@/components/3d/studio-backdrop";

/**
 * Two forms of the same close. `portal` is the homepage's ending: the
 * corridor from the hero returns, seen from further inside and lit stronger,
 * so the journey has a beginning and an end. Every other page keeps the
 * lighter card — a second WebGL scene on every route would cost more than
 * it earns.
 */
export function CtaBand({
  label = "Have an idea?",
  title = "Let's build something.",
  copy = "Bring a question, an early concept, or a problem worth exploring.",
  portal = false,
}: {
  label?: string;
  title?: string;
  copy?: string;
  portal?: boolean;
}) {
  if (portal) {
    return (
      <section className="cta-portal" aria-labelledby="cta-portal-title">
        <StudioBackdrop tone="signal" variant="return" />
        <div className="shell cta-portal__inner">
          <Reveal className="cta-portal__copy">
            <p className="label label-rule">{label}</p>
            <h2 className="cta-portal__title" id="cta-portal-title">
              {title}
            </h2>
            <p className="lead cta-portal__lead">{copy}</p>
            <ButtonLink href="/contact">Let&apos;s build</ButtonLink>
          </Reveal>
        </div>
        <span className="annotation cta-portal__anno">N4IS / Return</span>
      </section>
    );
  }

  return (
    <section className="section section--tight">
      <div className="shell">
        <Reveal className="cta-band">
          <span className="cta-band__glow" aria-hidden="true" />
          <span className="cta-band__ring" aria-hidden="true" />
          <p className="label label--accent">{label}</p>
          <h2 className="cta-band__title">{title}</h2>
          <p className="lead">{copy}</p>
          <ButtonLink href="/contact">Start a conversation</ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
