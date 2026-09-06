import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/data/projects";
export const metadata: Metadata = { title: "Founder", description: "The person behind N4IS, a personal technology studio." };
const points = [
  ["ABOUT THE FOUNDER", "N4IS is a personal technology studio built around curiosity, practical engineering, and the belief that an idea is worth following through."],
  ["WHAT I BUILD", "Software, AI systems, web experiences, connected concepts, and experiments that move an idea closer to the real world."],
  ["TECHNOLOGY INTERESTS", "AI, web platforms, mobile experiences, IoT systems, automation, data, product design, and the space between digital and physical."],
  ["VISION", "To keep learning in public through the work: explore carefully, build with intent, and create technology that earns its place."],
];
export default function FounderPage() { return <main id="main-content" className="page founder-page"><section className="founder-hero"><div><p className="eyebrow">N4IS / PERSONAL TECHNOLOGY STUDIO</p><h1>THE PERSON BEHIND N4IS</h1><p>Every product starts with an idea. N4IS started with one.</p><div className="founder-title">FOUNDER &amp; CEO <span>N4IS</span></div></div><figure><Image src="/images/founder.png" alt="Founder of N4IS" width={1254} height={1254} priority sizes="(max-width: 780px) 100vw, 44vw" /></figure></section><section className="founder-grid">{points.map(([label, body]) => <article key={label}><p className="eyebrow">{label}</p><p>{body}</p></article>)}</section><section className="journey"><p className="eyebrow">THE N4IS JOURNEY</p><h2>CURIOUS <span>→</span> LEARNING <span>→</span> EXPERIMENTING <span>→</span> BUILDING <span>→</span> N4IS</h2></section><section className="founder-projects"><p className="eyebrow">PROJECTS</p><div>{projects.map((project) => <Link href={`/projects/${project.slug}`} key={project.slug}>{project.name} <span>↗</span></Link>)}</div><p className="founder-social">Social links will be added when ready to share.</p></section></main>; }
