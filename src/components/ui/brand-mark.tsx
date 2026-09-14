import Image from "next/image";

type Variant = "wordmark" | "lockup" | "monogram" | "boot";

/**
 * Renders the official N4IS logo supplied at public/brand/.
 * The artwork is never recoloured, redrawn or stretched — it is placed on
 * its own light ground so it stays true to the brand on the dark interface.
 */
const SOURCES: Record<Variant, { src: string; width: number; height: number }> = {
  wordmark: { src: "/brand/n4is-wordmark.png", width: 560, height: 220 },
  lockup: { src: "/brand/n4is-lockup.png", width: 840, height: 410 },
  boot: { src: "/brand/n4is-lockup.png", width: 840, height: 410 },
  monogram: { src: "/brand/n4is-monogram.png", width: 512, height: 512 },
};

export function BrandMark({
  variant = "wordmark",
  priority = false,
  sizes = "200px",
  alt = "N4IS",
}: {
  variant?: Variant;
  priority?: boolean;
  sizes?: string;
  alt?: string;
}) {
  const source = SOURCES[variant];
  return (
    <span className={`mark mark--${variant}`}>
      <Image
        src={source.src}
        alt={alt}
        width={source.width}
        height={source.height}
        sizes={sizes}
        priority={priority}
        quality={92}
      />
    </span>
  );
}
