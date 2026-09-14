import { Fragment } from "react";
import { Atmosphere } from "@/components/atmosphere/atmosphere";
import { Reveal } from "@/components/ui/reveal";
import { principles, process } from "@/data/site";

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
              Ideas are only
              <br />
              the beginning.
            </h2>
            <p className="definition__statement">
              <b>N4IS is an independent technology studio</b>{" "}
              <span>building digital products, intelligent systems and experiments for a smarter tomorrow.</span>
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
