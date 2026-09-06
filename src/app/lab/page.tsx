import type { Metadata } from "next";
import Link from "next/link";
import { experiments } from "@/data/experiments";
import { PageIntro } from "@/components/ui/page-intro";
import { VisualPlaceholder } from "@/components/ui/visual-placeholder";
export const metadata: Metadata = { title: "Lab", description: "Experiments and technology studies from N4IS." };
export default function LabPage() { return <main id="main-content" className="page lab-page"><PageIntro eyebrow="N4IS / EXPERIMENTAL DIVISION" title="N4IS LAB" copy="Experiments that may become something bigger." /><section className="lab-index">{experiments.map((experiment) => <Link key={experiment.slug} href={`/lab/${experiment.slug}`} className="lab-entry"><VisualPlaceholder variant="lab" label={experiment.title} number={experiment.number} /><div><p className="eyebrow">{experiment.number} / {experiment.status}</p><h2>{experiment.title}</h2><p>{experiment.description}</p><div className="tag-row">{experiment.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div></div></Link>)}</section></main>; }
