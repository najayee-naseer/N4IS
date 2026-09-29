import { SUPABASE_URL } from "@/lib/supabase/env";
import type { ImageRef, ProjectShot } from "@/types/content";
import type { MediaLinkRow, MediaRow } from "./rows";
import { MEDIA_BUCKET } from "./vocab";

/**
 * The public URL for a stored file. The storage path is the canonical
 * reference; URLs are always derived from it, never stored.
 */
export function mediaUrl(path: string, bucket = MEDIA_BUCKET) {
  const encoded = path.split("/").map(encodeURIComponent).join("/");
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${encoded}`;
}

export function toImage(media: MediaRow | null | undefined, fallbackAlt: string): ImageRef | null {
  if (!media) return null;
  return {
    src: mediaUrl(media.storage_path, media.bucket),
    alt: media.alt_text || fallbackAlt,
    width: media.width ?? 1600,
    height: media.height ?? 1000,
  };
}

export function toShots(links: MediaLinkRow[] | null | undefined, placement: MediaLinkRow["placement"], fallbackAlt: string): ProjectShot[] {
  return (links ?? [])
    .filter((link) => link.placement === placement && link.media)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((link) => ({ ...(toImage(link.media, fallbackAlt) as ImageRef), caption: link.caption }));
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
