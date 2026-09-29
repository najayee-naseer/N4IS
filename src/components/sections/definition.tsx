import { Fragment } from "react";
import { Reveal } from "@/components/ui/reveal";
import { Lines } from "@/components/ui/lines";
import type { HomepageContent, Pair } from "@/lib/cms/defaults";

export function Definition({
  content,
  process,
  principles,
}: {
  content: HomepageContent;
  process: string[];
  principles: Pair[];
}) {
  return (
    <section className="section definition-section" data-env="definition" aria-labelledby="definition-title" id="what-is-n4is">

      <div className="shell definition-section__inner">
        <div className="definition">
          <Reveal className="definition__copy">
            <p className="label label-rule">
              <span className="label--accent">02</span> Definition
            </p>
            <h2 className="definition__title" id="definition-title">
              <Lines text={content.definitionTitle} />
            </h2>
            <p className="definition__statement">
              <b>{content.definitionStatementStrong}</b> <span>{content.definitionStatement}</span>
            </p>
            {content.definitionLead ? <p className="lead">{content.definitionLead}</p> : null}

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
