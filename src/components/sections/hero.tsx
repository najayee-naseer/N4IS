import { ButtonLink } from "@/components/ui/arrow-link";
import type { HomepageContent } from "@/lib/cms/defaults";

/**
 * The hero is one continuous environment, not a headline beside an object.
 * The corridor of arches — derived from the logo's "n" — runs full-bleed
 * behind everything: atmosphere, light and depth first, typography laid
 * directly over the space rather than confined to a column beside it.
 */
export function Hero({ content }: { content: HomepageContent }) {
  // the last line always ends on the blue full stop, whether or not the editor typed one
  const lines = content.heroHeadline.split("\n").map((line) => line.trim()).filter(Boolean);
  const last = lines.length - 1;

  return (
    <section className="hero" data-env="hero" aria-labelledby="hero-title">
      <div className="shell hero__inner">
        <div className="hero__content">
          {content.heroEyebrow ? <p className="label label-rule">{content.heroEyebrow}</p> : null}

          <h1 className="hero__title" id="hero-title">
            {lines.map((line, index) => (
              <span className="hero__line" key={index}>
                <span style={{ ["--d" as string]: `${60 + index * 90}ms` } as React.CSSProperties}>
                  {index === last ? (
                    <>
                      {line.replace(/\.$/, "")}
                      <i className="dot-accent">.</i>
                    </>
                  ) : (
                    line
                  )}
                </span>
              </span>
            ))}
          </h1>

          <p className="lead hero__lead">{content.heroLead}</p>

          <div className="hero__actions">
            <ButtonLink href={content.heroPrimaryHref}>{content.heroPrimaryLabel}</ButtonLink>
            <ButtonLink href={content.heroSecondaryHref} tone="line">
              {content.heroSecondaryLabel}
            </ButtonLink>
          </div>

          {content.heroFacts.length > 0 ? (
            <div className="hero__stats">
              {content.heroFacts.map((fact) => (
                <div key={`${fact.value}-${fact.label}`}>
                  <b>{fact.value}</b>
                  <span className="label">{fact.label}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="hero__scroll" aria-hidden="true">
        <i />
        <span className="label">Scroll</span>
      </div>
    </section>
  );
}
