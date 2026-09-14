import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/arrow-link";

export function CtaBand({
  label = "Have an idea?",
  title = "Let's build something.",
  copy = "Bring a question, an early concept, or a problem worth exploring.",
}: {
  label?: string;
  title?: string;
  copy?: string;
}) {
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
