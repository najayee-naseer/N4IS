import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Environment } from "@/components/environment/environment";
import { LabDetail } from "@/components/lab/lab-detail";
import { getExperiment, getExperiments } from "@/lib/cms/queries";

// Rendered on demand like projects: a newly published entry needs no rebuild.

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const experiment = await getExperiment((await params).slug);
  if (!experiment) return { title: "Experiment not found" };
  return {
    title: experiment.title,
    description: experiment.description,
    alternates: { canonical: `/lab/${experiment.slug}` },
  };
}

export default async function LabDetailPage({ params }: Params) {
  const { slug } = await params;
  const [experiment, all] = await Promise.all([getExperiment(slug), getExperiments()]);
  if (!experiment) notFound();

  const index = Math.max(0, all.findIndex((item) => item.slug === slug));

  return (
    <main id="main-content" className="page">
      <Environment station="quiet" />

      <div className="shell" style={{ position: "relative", zIndex: 1 }}>
        <Link href="/lab" className="back-link" data-cursor="link">
          <span aria-hidden="true">←</span> N4IS Lab
        </Link>
        <LabDetail experiment={experiment} index={index} />
      </div>
    </main>
  );
}
