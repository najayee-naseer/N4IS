import { Reveal } from "@/components/ui/reveal";
import { BrandMark } from "@/components/ui/brand-mark";

const LAYERS = [
  { word: "Technology", note: "The engineering underneath everything" },
  { word: "People", note: "Who the work is actually for" },
  { word: "Real world", note: "Where an idea has to survive" },
] as const;

/**
 * A single beat in the homepage journey, not a card: three words at
 * increasing depth and weight, converging into the brand mark. N4IS
 * doesn't build technology for its own sake — this is that idea, staged.
 */
export function Philosophy() {
  return (
    <section className="philosophy" aria-labelledby="philosophy-title">
      <div className="shell philosophy__inner">
        <p className="label label-rule">
          <span className="label--accent">03</span> Philosophy
        </p>
        <h2 className="sr-only" id="philosophy-title">
          What N4IS actually builds for
        </h2>

        <div className="philosophy__stack">
          {LAYERS.map((layer, index) => (
            <Reveal
              key={layer.word}
              className={`philosophy__word philosophy__word--${index + 1}`}
              delay={index * 150}
              variant="fade"
            >
              <span>{layer.word}</span>
              <i>{layer.note}</i>
            </Reveal>
          ))}
        </div>

        <Reveal className="philosophy__result" delay={LAYERS.length * 150 + 100} variant="fade">
          <span className="philosophy__mark" aria-hidden="true">
            <BrandMark variant="monogram" alt="" sizes="56px" />
          </span>
          <p>
            N4IS doesn&apos;t build technology for its own sake. It connects technology, people and the
            real world into things that actually work.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
