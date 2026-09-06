import { FeaturedProjects } from "@/components/sections/featured-projects";

export default function Home() {
  return (
    <main id="main-content" className="foundation-main">
      <section className="foundation-screen" aria-labelledby="foundation-title">
        <p className="eyebrow">N4IS / DIGITAL TECHNOLOGY STUDIO</p>
        <h1 id="foundation-title">BUILDING WHAT&apos;S NEXT.</h1>
        <p className="foundation-copy">The N4IS experience is taking shape.</p>
      </section>
      <FeaturedProjects />
    </main>
  );
}
