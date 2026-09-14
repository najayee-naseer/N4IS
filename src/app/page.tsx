import { Hero } from "@/components/sections/hero";
import { Definition } from "@/components/sections/definition";
import { CurrentlyBuilding } from "@/components/sections/currently-building";
import { LabTeaser } from "@/components/sections/lab-teaser";
import { FounderTeaser } from "@/components/sections/founder-teaser";
import { CtaBand } from "@/components/sections/cta-band";

export default function HomePage() {
  return (
    <main id="main-content">
      <Hero />
      <Definition />
      <CurrentlyBuilding />
      <LabTeaser />
      <FounderTeaser />
      <CtaBand />
    </main>
  );
}
