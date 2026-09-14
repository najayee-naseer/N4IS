import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import { ArrowLink } from "@/components/ui/arrow-link";

export function FounderTeaser() {
  return (
    <section className="section founder-section" aria-labelledby="founder-teaser-title">
      <div className="shell">
        <div className="founder-hero">
          <Reveal variant="wipe">
            <figure className="founder-portrait">
              <span className="founder-portrait__glow" aria-hidden="true" />
              <Image
                src="/images/founder.png"
                alt="Portrait of the founder and CEO of N4IS"
                width={1254}
                height={1254}
                sizes="(max-width: 940px) 100vw, 40vw"
              />
              <figcaption>
                <b>Founder &amp; CEO</b>
                <span className="label">N4IS</span>
              </figcaption>
            </figure>
          </Reveal>

          <Reveal className="founder-body" delay={120}>
            <p className="label label-rule">
              <span className="label--accent">05</span> The person behind N4IS
            </p>
            <h2 className="h2" id="founder-teaser-title">
              N4IS is personally
              <br />
              built.
            </h2>
            <p className="lead">
              Every project on this site starts with one person deciding an idea is worth following through —
              then doing the design, the engineering and the iteration to find out.
            </p>
            <ArrowLink href="/founder">Meet the founder</ArrowLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
