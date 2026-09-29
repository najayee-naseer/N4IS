import Image from "next/image";
import type { Experiment } from "@/types/content";
import { Specimen } from "./specimen";

/**
 * An experiment's plate: its uploaded cover when it has one, otherwise the
 * drawn specimen. Same frame either way, so the list keeps its rhythm.
 */
export function LabPlate({
  experiment,
  index,
  showStatus = true,
  sizes = "(max-width: 900px) 92vw, 240px",
}: {
  experiment: Experiment;
  index: number;
  showStatus?: boolean;
  sizes?: string;
}) {
  if (experiment.image) {
    return (
      <div className="specimen specimen--photo">
        <Image src={experiment.image.src} alt={experiment.image.alt} fill sizes={sizes} style={{ objectFit: "cover" }} />
        <span className="specimen__index">{experiment.number}</span>
        {showStatus ? <span className="specimen__status">{experiment.status}</span> : null}
      </div>
    );
  }
  return <Specimen index={index} number={experiment.number} status={showStatus ? experiment.status : undefined} />;
}
