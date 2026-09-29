import "server-only";
import { cache } from "react";
import type { Experiment, ImageRef, Project } from "@/types/content";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { publicClient } from "@/lib/supabase/public";
import {
  DEFAULT_ABOUT,
  DEFAULT_FOUNDER,
  DEFAULT_FOUNDER_NAME,
  DEFAULT_FOUNDER_ROLE,
  DEFAULT_HOMEPAGE,
  DEFAULT_SETTINGS,
  type AboutContent,
  type FounderContent,
  type HomepageContent,
  type Link,
  type SiteSettings,
} from "./defaults";
import { legacyExperimentList, legacyProjectList } from "./legacy";
import { mapExperiment, mapProject, withDefaults } from "./mappers";
import { toImage } from "./media";
import { LAB_SELECT, PROJECT_SELECT, type LabWithMedia, type MediaRow, type ProjectWithMedia } from "./rows";

/**
 * Everything the public site reads. Published content only — enforced by
 * RLS, not by these queries. Each function degrades gracefully: a failed
 * query logs and returns empty/defaults rather than taking the page down.
 */

function report(scope: string, error: { message: string } | null) {
  if (error) console.error(`[cms] ${scope}: ${error.message}`);
}

export const getProjects = cache(async (): Promise<Project[]> => {
  if (!isSupabaseConfigured) return legacyProjectList();
  const { data, error } = await publicClient()
    .from("projects")
    .select(PROJECT_SELECT)
    .eq("published", true)
    .order("sort_order")
    .order("project_number");
  report("projects", error);
  return ((data ?? []) as ProjectWithMedia[]).map(mapProject);
});

export const getFeaturedProjects = cache(async (): Promise<Project[]> => {
  return (await getProjects()).filter((project) => project.featured);
});

export const getProject = cache(async (slug: string): Promise<Project | null> => {
  if (!isSupabaseConfigured) return legacyProjectList().find((project) => project.slug === slug) ?? null;
  const { data, error } = await publicClient()
    .from("projects")
    .select(PROJECT_SELECT)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  report(`project ${slug}`, error);
  return data ? mapProject(data as ProjectWithMedia) : null;
});

export function projectNeighbours(projects: Project[], slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1 || projects.length < 2) return { previous: null, next: null };
  return {
    previous: projects[(index - 1 + projects.length) % projects.length],
    next: projects[(index + 1) % projects.length],
  };
}

export const getExperiments = cache(async (): Promise<Experiment[]> => {
  if (!isSupabaseConfigured) return legacyExperimentList();
  const { data, error } = await publicClient()
    .from("lab_entries")
    .select(LAB_SELECT)
    .eq("published", true)
    .order("sort_order")
    .order("entry_number");
  report("lab", error);
  return ((data ?? []) as LabWithMedia[]).map(mapExperiment);
});

export const getExperiment = cache(async (slug: string): Promise<Experiment | null> => {
  if (!isSupabaseConfigured) return legacyExperimentList().find((entry) => entry.slug === slug) ?? null;
  const { data, error } = await publicClient()
    .from("lab_entries")
    .select(LAB_SELECT)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  report(`lab ${slug}`, error);
  return data ? mapExperiment(data as LabWithMedia) : null;
});

export const getHomepage = cache(async (): Promise<HomepageContent> => {
  if (!isSupabaseConfigured) return DEFAULT_HOMEPAGE;
  const { data, error } = await publicClient().from("homepage_content").select("content").eq("id", 1).maybeSingle();
  report("homepage", error);
  return withDefaults(DEFAULT_HOMEPAGE, data?.content);
});

export const getSettings = cache(async (): Promise<SiteSettings> => {
  if (!isSupabaseConfigured) return DEFAULT_SETTINGS;
  const { data, error } = await publicClient().from("site_settings").select("*").eq("id", 1).maybeSingle();
  report("settings", error);
  if (!data) return DEFAULT_SETTINGS;
  return {
    siteName: data.site_name || DEFAULT_SETTINGS.siteName,
    tagline: data.tagline || DEFAULT_SETTINGS.tagline,
    description: data.description || DEFAULT_SETTINGS.description,
    contactEmail: data.contact_email ?? "",
    contactPhone: data.contact_phone ?? "",
    location: data.location ?? "",
    socialLinks: Array.isArray(data.social_links) ? (data.social_links as Link[]) : [],
    content: withDefaults(DEFAULT_SETTINGS.content, data.content),
  };
});

export type AboutView = { content: AboutContent; image: ImageRef | null; published: boolean };

export const getAbout = cache(async (): Promise<AboutView> => {
  const fallback = { content: DEFAULT_ABOUT, image: null, published: true };
  if (!isSupabaseConfigured) return fallback;
  const { data, error } = await publicClient()
    .from("about_content")
    .select("content, published, image:media_assets!about_content_image_media_id_fkey(*)")
    .eq("id", 1)
    .maybeSingle();
  report("about", error);
  // no visible row: either never saved (use defaults) or unpublished (RLS hides it)
  if (!data) return error ? fallback : { ...fallback, published: !(await isHidden("about_content")) };
  return {
    content: withDefaults(DEFAULT_ABOUT, data.content),
    image: toImage(data.image as unknown as MediaRow | null, "N4IS"),
    published: data.published,
  };
});

export type FounderView = {
  name: string;
  role: string;
  content: FounderContent;
  photo: ImageRef | null;
  socialLinks: Link[];
  published: boolean;
};

const FOUNDER_FALLBACK_PHOTO: ImageRef = {
  src: "/images/founder.png",
  alt: "Portrait of the founder and CEO of N4IS",
  width: 1254,
  height: 1254,
};

export const getFounder = cache(async (): Promise<FounderView> => {
  const fallback: FounderView = {
    name: DEFAULT_FOUNDER_NAME,
    role: DEFAULT_FOUNDER_ROLE,
    content: DEFAULT_FOUNDER,
    photo: FOUNDER_FALLBACK_PHOTO,
    socialLinks: [],
    published: true,
  };
  if (!isSupabaseConfigured) return fallback;
  const { data, error } = await publicClient()
    .from("founder_content")
    .select("name, role, content, social_links, published, photo:media_assets!founder_content_photo_media_id_fkey(*)")
    .eq("id", 1)
    .maybeSingle();
  report("founder", error);
  if (!data) return error ? fallback : { ...fallback, published: !(await isHidden("founder_content")) };
  return {
    name: data.name,
    role: data.role || DEFAULT_FOUNDER_ROLE,
    content: withDefaults(DEFAULT_FOUNDER, data.content),
    photo: toImage(data.photo as unknown as MediaRow | null, `Portrait of ${data.name || "the founder of N4IS"}`),
    socialLinks: Array.isArray(data.social_links) ? (data.social_links as Link[]) : [],
    published: data.published,
  };
});

/**
 * A singleton the public cannot see is either unpublished or not created yet.
 * The `singleton_is_hidden` function answers which without exposing the row.
 */
async function isHidden(table: "about_content" | "founder_content") {
  const { data } = await publicClient().rpc("singleton_is_hidden", { target: table });
  return data === true;
}
