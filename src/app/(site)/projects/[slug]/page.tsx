import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Environment } from "@/components/environment/environment";
import { ProjectDetail } from "@/components/projects/project-detail";
import { CtaBand } from "@/components/sections/cta-band";
import { getProject, getProjects, projectNeighbours } from "@/lib/cms/queries";

// Deliberately no generateStaticParams: a project published in the admin is
// rendered on first request and cached until the next save invalidates it.

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const project = await getProject((await params).slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.name,
    description: project.shortDescription,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: `${project.name} — N4IS`,
      description: project.shortDescription,
      images: project.heroImage ? [{ url: project.heroImage }] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: Params) {
  const { slug } = await params;
  const [project, projects] = await Promise.all([getProject(slug), getProjects()]);
  if (!project) notFound();

  const { previous, next } = projectNeighbours(projects, project.slug);

  return (
    <main id="main-content" className="page">
      <Environment station="quiet" />

      <div className="shell" style={{ position: "relative", zIndex: 1 }}>
        <Link href="/projects" className="back-link" data-cursor="link">
          <span aria-hidden="true">←</span> All work
        </Link>
        <ProjectDetail project={project} previous={previous} next={next} />
      </div>

      <CtaBand title="Want to build something like this?" />
    </main>
  );
}
