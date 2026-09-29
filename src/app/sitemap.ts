import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { getExperiments, getProjects } from "@/lib/cms/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const routes = ["", "/projects", "/lab", "/founder", "/about", "/contact"];
  const [projects, experiments] = await Promise.all([getProjects(), getExperiments()]);

  return [
    ...routes.map((route) => ({
      url: `${site.url}${route}`,
      lastModified: now,
      priority: route === "" ? 1 : 0.8,
    })),
    ...projects.map((project) => ({
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
