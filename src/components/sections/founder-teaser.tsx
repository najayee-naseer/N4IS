import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Lines } from "@/components/ui/lines";
import type { FounderView } from "@/lib/cms/queries";

/**
 * After the technology and the motion, one quiet, human beat. The
 * environment is still here — the same light, the same studio — but
 * everything about the pacing and the visual noise is turned down.
 */
export function FounderTeaser({ founder, title, lead }: { founder: FounderView; title: string; lead: string }) {
  return (
    <section className="section founder-section" data-env="founder" aria-labelledby="founder-teaser-title">
      <div className="shell">
        <div className="founder-hero">
          <Reveal variant="wipe">
            <figure className="founder-portrait">
              <span className="founder-portrait__glow" aria-hidden="true" />
              {founder.photo ? (
                <Image
                  src={founder.photo.src}
                  alt={founder.photo.alt}
                  width={founder.photo.width}
                  height={founder.photo.height}
                  sizes="(max-width: 940px) 100vw, 40vw"
                />
              ) : null}
              <figcaption>
                <b>{founder.name || founder.role}</b>
                <span className="label">{founder.name ? founder.role : "N4IS"}</span>
              </figcaption>
            </figure>
          </Reveal>

          <Reveal className="founder-body" delay={120}>
            <p className="label label-rule">
              <span className="label--accent">07</span> The person behind N4IS
            </p>
            <h2 className="h2" id="founder-teaser-title">
              <Lines text={title} />
            </h2>
            {lead ? <p className="lead">{lead}</p> : null}
            <ArrowLink href="/founder">Meet the founder</ArrowLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
