import type { MetadataRoute } from "next";
import { activeProjects } from "@/data/projects";
import { experiments } from "@/data/experiments";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = ["", "/projects", "/lab", "/founder", "/about", "/contact"];

  return [
    ...routes.map((route) => ({
      url: `${site.url}${route}`,
      lastModified: now,
      priority: route === "" ? 1 : 0.8,
    })),
    ...activeProjects.map((project) => ({
      url: `${site.url}/projects/${project.slug}`,
      lastModified: now,
      priority: 0.7,
    })),
    ...experiments.map((experiment) => ({
      url: `${site.url}/lab/${experiment.slug}`,
      lastModified: now,
      priority: 0.6,
    })),
  ];
}
