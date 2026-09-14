import Image from "next/image";
import { Atmosphere } from "@/components/atmosphere/atmosphere";
import { Reveal } from "@/components/ui/reveal";
import { ArrowLink } from "@/components/ui/arrow-link";

/**
 * After the technology and the motion, one quiet, human beat. The
 * environment is still here — the same light, the same studio — but
 * everything about the pacing and the visual noise is turned down.
 */
export function FounderTeaser() {
  return (
    <section className="section founder-section" aria-labelledby="founder-teaser-title">
      <Atmosphere tone="quiet" beam={false} forms={false} grid={false} />
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
              <span className="label--accent">07</span> The person behind N4IS
            </p>
            <h2 className="h2" id="founder-teaser-title">
              The person
              <br />
              behind N4IS.
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
