import type { Experiment, Project } from "@/types/content";
import { legacyProjects } from "@/data/legacy/projects";
import { legacyExperiments } from "@/data/legacy/experiments";

/**
 * Renders the pre-CMS content when no Supabase project is configured, so a
 * fresh clone still runs. As soon as NEXT_PUBLIC_SUPABASE_URL and the anon key
 * are set, nothing here is used — Supabase is the only source.
 */

export function legacyProjectList(): Project[] {
  return legacyProjects
    .filter((project) => project.active)
    .map((project) => ({
      id: project.slug,
      slug: project.slug,
      number: project.number,
      name: project.name,
      shortDescription: project.shortDescription,
      description: project.description,
      category: project.category,
      year: project.year,
      status: project.status,
      technologies: project.technologies,
      image: project.image,
      heroImage: project.heroImage,
      heroImageWidth: project.heroImageWidth,
      heroImageHeight: project.heroImageHeight,
      logo: null,
      gallery: (project.gallery ?? []).map((shot) => ({ ...shot, width: 720, height: 1561 })),
      additional: [],
      stack: project.stack,
      preserveCase: project.preserveCase,
      featured: project.featured,
      focus: project.focus,
      content: project.content,
    }));
}

export function legacyExperimentList(): Experiment[] {
  return legacyExperiments.map((experiment) => ({
    id: experiment.slug,
    slug: experiment.slug,
    number: experiment.number,
    title: experiment.title,
    description: experiment.description,
    category: experiment.category,
    status: experiment.status,
    technologies: experiment.technologies,
    date: experiment.date,
    image: null,
    featured: experiment.featured,
    content: experiment.content,
  }));
}
