import type { LabStatus, ProjectStatus } from "./vocab";

/** Rows as they come back from Postgres (snake_case, nullable where the schema allows). */

export type MediaRow = {
  id: string;
  bucket: string;
  storage_path: string;
  folder: string;
  filename: string;
  mime_type: string;
  file_size: number;
  width: number | null;
  height: number | null;
  alt_text: string;
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
};

export type NarrativeRow = { label: string; title: string; body: string };

export type MediaLinkRow = {
  id: string;
  media_id: string;
  placement: "gallery" | "additional";
  caption: string;
  sort_order: number;
  media: MediaRow | null;
};

export type ProjectRow = {
  id: string;
  slug: string;
  project_number: string;
  title: string;
  short_description: string;
  description: string;
  category: string;
  status: ProjectStatus;
  stage_label: string;
  technologies: string[];
  stack: string[];
  focus: string[];
  sections: NarrativeRow[];
  preserve_case: boolean;
  live_url: string | null;
  github_url: string | null;
  hero_media_id: string | null;
  logo_media_id: string | null;
  featured: boolean;
  published: boolean;
  published_at: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ProjectWithMedia = ProjectRow & {
  hero: MediaRow | null;
  logo: MediaRow | null;
  project_media: MediaLinkRow[];
};

export type LabRow = {
  id: string;
  slug: string;
  entry_number: string;
  title: string;
  summary: string;
  description: string;
  category: string;
  status: LabStatus;
  date_label: string;
  technologies: string[];
  sections: NarrativeRow[];
  cover_media_id: string | null;
  featured: boolean;
  published: boolean;
  published_at: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type LabWithMedia = LabRow & {
  cover: MediaRow | null;
  lab_media: MediaLinkRow[];
};

/** PostgREST embed strings, kept in one place so every query asks for the same shape. */
export const PROJECT_SELECT =
  "*, hero:media_assets!projects_hero_media_id_fkey(*), logo:media_assets!projects_logo_media_id_fkey(*), project_media(id, media_id, placement, caption, sort_order, media:media_assets(*))";

export const LAB_SELECT =
  "*, cover:media_assets!lab_entries_cover_media_id_fkey(*), lab_media(id, media_id, placement, caption, sort_order, media:media_assets(*))";
