export type ProjectStatus = "IDEA" | "PROTOTYPE" | "IN DEVELOPMENT" | "TESTING" | "LIVE" | "ARCHIVED";
export type ExperimentStatus = "EXPERIMENTAL" | "RESEARCH" | "PROTOTYPE" | "IN DEVELOPMENT" | "ARCHIVED" | "PROMOTED TO PROJECT";
export type Narrative = { label: string; title: string; body: string };
export interface Project { slug: string; number: string; name: string; shortDescription: string; description: string; category: string; year: string; status: ProjectStatus; technologies: string[]; image: string | null; heroImage: string | null; gallery?: string[]; featured: boolean; active: boolean; liveUrl?: string; githubUrl?: string; content: Narrative[]; }
export interface Experiment { slug: string; number: string; title: string; description: string; category: string; status: ExperimentStatus; technologies: string[]; date: string; image: string | null; featured: boolean; content: Narrative[]; }
