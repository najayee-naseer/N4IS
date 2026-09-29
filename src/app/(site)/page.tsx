import { Environment } from "@/components/environment/environment";
import { Hero } from "@/components/sections/hero";
import { Definition } from "@/components/sections/definition";
import { Philosophy } from "@/components/sections/philosophy";
import { Ecosystem } from "@/components/sections/ecosystem";
import { CurrentlyBuilding } from "@/components/sections/currently-building";
import { LabTeaser } from "@/components/sections/lab-teaser";
import { FounderTeaser } from "@/components/sections/founder-teaser";
import { CtaBand } from "@/components/sections/cta-band";
import { getExperiments, getFeaturedProjects, getFounder, getHomepage, getSettings } from "@/lib/cms/queries";

export default async function HomePage() {
  const [home, featured, experiments, founder, settings] = await Promise.all([
    getHomepage(),
    getFeaturedProjects(),
    getExperiments(),
    getFounder(),
    getSettings(),
  ]);
  const show = home.sections;

  return (
    <main id="main-content">
      <Environment journey station="hero" />
      <Hero content={home} />
      {show.definition ? (
        <Definition content={home} process={settings.content.process} principles={settings.content.principles} />
      ) : null}
      {show.philosophy ? <Philosophy statement={home.philosophyStatement} /> : null}
      {show.ecosystem && featured.length > 0 ? (
        <Ecosystem projects={featured} title={home.ecosystemTitle} lead={home.ecosystemLead} />
      ) : null}
      {show.building && featured.length > 0 ? (
        <CurrentlyBuilding projects={featured} title={home.buildingTitle} lead={home.buildingLead} />
      ) : null}
      {show.lab && experiments.length > 0 ? (
        <LabTeaser experiments={experiments} title={home.labTitle} lead={home.labLead} />
      ) : null}
      {show.founder && founder.published ? (
        <FounderTeaser founder={founder} title={home.founderTitle} lead={home.founderLead} />
      ) : null}
      {show.cta ? <CtaBand label={home.ctaLabel} title={home.ctaTitle} copy={home.ctaCopy} portal /> : null}
    </main>
  );
}
