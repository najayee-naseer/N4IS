import type { Experiment, Project } from "@/types/content";
import type { LabWithMedia, ProjectWithMedia } from "./rows";
import { toImage, toShots } from "./media";
import { LAB_STATUS_LABEL, PROJECT_STATUS_LABEL } from "./vocab";

/** Database rows → the shapes the public components render. */

export function mapProject(row: ProjectWithMedia): Project {
  const hero = toImage(row.hero, `${row.title} — a screen from the current build`);
  return {
    id: row.id,
    slug: row.slug,
    number: row.project_number,
    name: row.title,
    shortDescription: row.short_description,
    description: row.description || row.short_description,
    category: row.category,
    year: row.stage_label,
    status: PROJECT_STATUS_LABEL[row.status] ?? row.status.toUpperCase(),
    technologies: row.technologies ?? [],
    image: hero?.src ?? null,
    heroImage: hero?.src ?? null,
    heroImageWidth: hero?.width,
    heroImageHeight: hero?.height,
    logo: toImage(row.logo, `${row.title} logo`),
    gallery: toShots(row.project_media, "gallery", `${row.title} — screen from the current build`),
    additional: toShots(row.project_media, "additional", `${row.title}`),
    stack: row.stack ?? [],
    preserveCase: row.preserve_case,
    featured: row.featured,
    liveUrl: row.live_url ?? undefined,
    githubUrl: row.github_url ?? undefined,
    focus: row.focus ?? [],
    content: Array.isArray(row.sections) ? row.sections : [],
  };
}

export function mapExperiment(row: LabWithMedia): Experiment {
  return {
    id: row.id,
    slug: row.slug,
    number: row.entry_number,
    title: row.title,
    description: row.summary,
    body: row.description || undefined,
    category: row.category,
    status: LAB_STATUS_LABEL[row.status] ?? row.status.toUpperCase(),
    technologies: row.technologies ?? [],
    date: row.date_label,
    image: toImage(row.cover, `${row.title} — cover`),
    gallery: toShots(row.lab_media, "gallery", row.title),
    featured: row.featured,
    content: Array.isArray(row.sections) ? row.sections : [],
  };
}

/** Merge a stored JSON document over its defaults, one level deep, so missing fields fall back. */
export function withDefaults<T extends Record<string, unknown>>(defaults: T, stored: unknown): T {
  if (!stored || typeof stored !== "object" || Array.isArray(stored)) return defaults;
  const out: Record<string, unknown> = { ...defaults };
  for (const [key, value] of Object.entries(stored as Record<string, unknown>)) {
    if (!(key in defaults) || value === null || value === undefined) continue;
    const base = defaults[key];
    if (base && typeof base === "object" && !Array.isArray(base) && typeof value === "object" && !Array.isArray(value)) {
      out[key] = { ...(base as object), ...(value as object) };
    } else if (typeof value === typeof base || (Array.isArray(base) && Array.isArray(value))) {
      out[key] = value;
    }
  }
  return out as T;
}
