import { Hero } from "@/components/sections/hero";
import { Definition } from "@/components/sections/definition";
import { Philosophy } from "@/components/sections/philosophy";
import { Ecosystem } from "@/components/sections/ecosystem";
import { CurrentlyBuilding } from "@/components/sections/currently-building";
import { LabTeaser } from "@/components/sections/lab-teaser";
import { FounderTeaser } from "@/components/sections/founder-teaser";
import { CtaBand } from "@/components/sections/cta-band";

export default function HomePage() {
  return (
    <main id="main-content">
      <Hero />
      <Definition />
      <Philosophy />
      <Ecosystem />
      <CurrentlyBuilding />
      <LabTeaser />
      <FounderTeaser />
      <CtaBand
        label="Have an idea?"
        title="The next idea could start here."
        copy="Bring a question, an early concept, or a problem worth exploring."
        portal
      />
    </main>
  );
}
