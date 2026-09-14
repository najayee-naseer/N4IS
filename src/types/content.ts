export type ProjectStatus =
  | "IDEA"
  | "PROTOTYPE"
  | "IN DEVELOPMENT"
  | "TESTING"
  | "LIVE"
  | "ARCHIVED";

export type ExperimentStatus =
  | "EXPERIMENTAL"
  | "RESEARCH"
  | "PROTOTYPE"
  | "IN DEVELOPMENT"
  | "ARCHIVED"
  | "PROMOTED TO PROJECT";

export type Narrative = { label: string; title: string; body: string };

/** A real screenshot from a project's build. Reusable by any project. */
export type ProjectShot = { src: string; alt: string; caption: string };

export interface Project {
  slug: string;
  number: string;
  name: string;
  /** One line used on cards and in listings. */
  shortDescription: string;
  /** A fuller paragraph used on the project hero. */
  description: string;
  category: string;
  year: string;
  status: ProjectStatus;
  technologies: string[];
  /** Optional real imagery. When null the procedural product visual is used. */
  image: string | null;
  heroImage: string | null;
  /** Real build screenshots, shown as a gallery on the detail page. */
  gallery?: ProjectShot[];
  /** The technologies the project is actually built with. Never guessed. */
  stack?: string[];
  /** Set when the name carries its own casing and must not be upper-cased. */
  preserveCase?: boolean;
  featured: boolean;
  /** Only active projects are surfaced anywhere on the site. */
  active: boolean;
  liveUrl?: string;
  githubUrl?: string;
  /** Things the project is being built to do. Facts only — no metrics, no claims. */
  focus: string[];
  content: Narrative[];
}

export interface Experiment {
  slug: string;
  number: string;
  title: string;
  description: string;
  category: string;
  status: ExperimentStatus;
  technologies: string[];
  date: string;
  image: string | null;
  featured: boolean;
  content: Narrative[];
}
