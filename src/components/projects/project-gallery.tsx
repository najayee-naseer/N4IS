import Image from "next/image";
import type { ProjectShot } from "@/types/content";
import { Reveal } from "@/components/ui/reveal";

/**
 * Real screenshots from a project's build. The first shot leads at a larger
 * size; the rest follow as a scroll-snapping strip on narrow screens and a grid
 * on wide ones. Reusable by any project that carries a `gallery`.
 */
export function ProjectGallery({
  shots,
  name,
  label = "Current build",
}: {
  shots: ProjectShot[];
  name: string;
  label?: string;
}) {
  if (shots.length === 0) return null;

  const [lead, ...rest] = shots;

  return (
    <section className="gallery" aria-label={`${name} — screens from the current build`}>
      <Reveal as="p" className="label label--accent" variant="fade">
        {label}
      </Reveal>

      <div className="gallery__grid">
        <Reveal className="shot shot--lead" variant="wipe">
          <figure>
            <Image
              src={lead.src}
              alt={lead.alt}
              width={lead.width}
              height={lead.height}
              sizes="(max-width: 900px) 78vw, 34vw"
            />
            {lead.caption ? <figcaption className="label">{lead.caption}</figcaption> : null}
          </figure>
        </Reveal>

        <div className="gallery__strip">
          {rest.map((shot, index) => (
            <Reveal className="shot" key={`${shot.src}-${index}`} delay={index * 70}>
              <figure>
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  width={shot.width}
                  height={shot.height}
                  sizes="(max-width: 900px) 56vw, 22vw"
                  loading="lazy"
                />
                {shot.caption ? <figcaption className="label">{shot.caption}</figcaption> : null}
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
