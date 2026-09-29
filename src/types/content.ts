/**
 * The shapes the public site renders. They are deliberately independent of
 * the database: rows from Supabase are mapped into these in
 * `src/lib/cms/queries.ts`, so components never know where content came from.
 */

export type Narrative = { label: string; title: string; body: string };

/** An image ready to render: a resolved URL plus its real dimensions. */
export type ImageRef = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

/** A screenshot or photo in a project's gallery. */
export type ProjectShot = ImageRef & { caption: string };

export interface Project {
  id: string;
  slug: string;
  number: string;
  name: string;
  /** One line used on cards and in listings. */
  shortDescription: string;
  /** A fuller paragraph used on the project hero. */
  description: string;
  category: string;
  /** Short stage line shown beside the status, e.g. "IN PROGRESS". */
  year: string;
  /** Display label, e.g. "IN DEVELOPMENT". */
  status: string;
  technologies: string[];
  /** Card / panel image. When null the procedural product visual is used. */
  image: string | null;
  heroImage: string | null;
  /** The real pixel dimensions of `heroImage`, so it never gets stretched off its true aspect ratio. */
  heroImageWidth?: number;
  heroImageHeight?: number;
  logo?: ImageRef | null;
  /** Real build screenshots, shown as a gallery on the detail page. */
  gallery?: ProjectShot[];
  /** Further media shown after the story. */
  additional?: ProjectShot[];
  /** The technologies the project is actually built with. Never guessed. */
  stack?: string[];
  /** Set when the name carries its own casing and must not be upper-cased. */
  preserveCase?: boolean;
  featured: boolean;
  liveUrl?: string;
  githubUrl?: string;
  /** Things the project is being built to do. Facts only — no metrics, no claims. */
  focus: string[];
  content: Narrative[];
}

export interface Experiment {
  id: string;
  slug: string;
  number: string;
  title: string;
  description: string;
  /** Longer introduction for the detail page; falls back to `description`. */
  body?: string;
  category: string;
  status: string;
  technologies: string[];
  date: string;
  image: ImageRef | null;
  gallery?: ProjectShot[];
  featured: boolean;
  content: Narrative[];
}
