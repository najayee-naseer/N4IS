import { StudioBackdrop } from "@/components/3d/studio-backdrop";
import { ButtonLink } from "@/components/ui/arrow-link";
import { site } from "@/data/site";

const FACTS = [
  ["Independent", "Studio"],
  ["Software · AI · IoT", "Disciplines"],
  ["Four", "Active projects"],
] as const;

/**
 * The hero is one continuous environment, not a headline beside an object.
 * The corridor of arches — derived from the logo's "n" — runs full-bleed
 * behind everything: atmosphere, light and depth first, typography laid
 * directly over the space rather than confined to a column beside it.
 */
export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <StudioBackdrop tone="studio" variant="hero" eager />

      <div className="shell hero__inner">
        <div className="hero__content">
          <p className="label label-rule">{site.name} / Digital technology studio</p>

          <h1 className="hero__title" id="hero-title">
            <span className="hero__line">
              <span style={{ ["--d" as string]: "60ms" } as React.CSSProperties}>Building</span>
            </span>
            <span className="hero__line">
              <span style={{ ["--d" as string]: "150ms" } as React.CSSProperties}>What&apos;s</span>
            </span>
            <span className="hero__line">
              <span style={{ ["--d" as string]: "240ms" } as React.CSSProperties}>
                Next<i className="dot-accent">.</i>
              </span>
            </span>
          </h1>

          <p className="lead hero__lead">
            N4IS is an independent technology studio. Ideas are explored here, engineered properly,
            and pushed until they work in the real world — as products, systems and experiments.
          </p>

          <div className="hero__actions">
            <ButtonLink href="/projects">Explore the work</ButtonLink>
            <ButtonLink href="/lab" tone="line">
              Enter the lab
            </ButtonLink>
          </div>

          <div className="hero__stats">
            {FACTS.map(([value, label]) => (
              <div key={label}>
                <b>{value}</b>
                <span className="label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <span className="annotation annotation--vertical hero__anno hero__anno--system">N4IS / System 01</span>
      <span className="annotation annotation--dot hero__anno hero__anno--state">Core / Active</span>
      <span className="annotation hero__anno hero__anno--order">Build · Experiment · Ship</span>

      <div className="hero__scroll" aria-hidden="true">
        <i />
        <span className="label">Scroll</span>
      </div>
    </section>
  );
}
