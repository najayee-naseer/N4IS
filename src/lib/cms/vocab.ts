/**
 * The controlled vocabularies of the CMS. These mirror the Postgres enums in
 * supabase/migrations — change both together.
 *
 * No path-alias imports here: the seed script imports this file directly.
 */

export const PROJECT_STATUSES = ["planning", "prototype", "in_development", "built", "active", "archived"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  planning: "PLANNING",
  prototype: "PROTOTYPE",
  in_development: "IN DEVELOPMENT",
  built: "BUILT",
  active: "ACTIVE",
  archived: "ARCHIVED",
};

export const LAB_STATUSES = ["experimental", "research", "prototype", "in_development", "archived", "promoted"] as const;
export type LabStatus = (typeof LAB_STATUSES)[number];

export const LAB_STATUS_LABEL: Record<LabStatus, string> = {
  experimental: "EXPERIMENTAL",
  research: "RESEARCH",
  prototype: "PROTOTYPE",
  in_development: "IN DEVELOPMENT",
  archived: "ARCHIVED",
  promoted: "PROMOTED TO PROJECT",
};

/** Suggestions offered in the editor; the field itself stays free text. */
export const CATEGORY_SUGGESTIONS = [
  "AI / SOFTWARE",
  "SOFTWARE",
  "WEB / BOOKING SYSTEM",
  "WEB",
  "MOBILE",
  "IoT / EMBEDDED",
  "E-COMMERCE / PRODUCT SYSTEM",
  "AI / INTERACTION",
  "3D WEB / UI",
  "IoT / DATA",
] as const;

export const MEDIA_BUCKET = "n4is-media";
export const MEDIA_MAX_BYTES = 10 * 1024 * 1024;
export const MEDIA_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"] as const;

export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
