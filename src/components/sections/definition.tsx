import { Fragment } from "react";
import { Atmosphere } from "@/components/atmosphere/atmosphere";
import { Reveal } from "@/components/ui/reveal";
import { principles, process } from "@/data/site";

const LAYERS = [
  { label: "Interface", note: "What a person actually touches" },
  { label: "System", note: "The engineering underneath it" },
  { label: "Idea", note: "The question that started it" },
] as const;

export function Definition() {
  return (
    <section className="section definition-section" aria-labelledby="definition-title" id="what-is-n4is">
      <Atmosphere tone="calm" beam={false} seam />

      <div className="shell definition-section__inner">
        <div className="definition">
          <Reveal className="definition__copy">
            <p className="label label-rule">
              <span className="label--accent">02</span> Definition
            </p>
            <h2 className="definition__title" id="definition-title">
              What is
              <br />
              N4IS?
            </h2>
            <p className="definition__statement">
              <b>N4IS is an independent technology studio</b>{" "}
              <span>
                exploring ideas, engineering products and experimenting with systems that can exist in the
                real world.
              </span>
            </p>
            <p className="lead">Not an agency. Not a portfolio. A studio with its own project list.</p>

            <div className="definition__order">
              <p className="label">The working order</p>
              <div className="chain">
                {process.map((word, index) => (
                  <Fragment key={word}>
                    <b>{word}</b>
                    {index < process.length - 1 ? <i aria-hidden="true">→</i> : null}
                  </Fragment>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Every project is the same three layers stacked — this is that idea, built. */}
          <Reveal className="strata" variant="fade" delay={140}>
            <div className="strata__scene" role="img" aria-label="Three stacked layers: interface, system and the idea beneath it">
              <span className="strata__glow" />
              {LAYERS.map((layer, index) => (
                <span className={`strata__plate strata__plate--${index + 1}`} key={layer.label} data-index={`0${index + 1}`}>
                  <b>{layer.label}</b>
                  <i>{layer.note}</i>
                </span>
              ))}
              <span className="strata__axis" />
            </div>
            <p className="annotation strata__anno">Every project · three layers</p>
          </Reveal>
        </div>

        <div className="principles">
          {principles.map((principle, index) => (
            <Reveal className="principle" key={principle.title} delay={index * 90}>
              <p className="label label--accent">0{index + 1}</p>
              <h3>{principle.title}</h3>
              <p>{principle.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
