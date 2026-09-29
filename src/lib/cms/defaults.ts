/**
 * The site's copy as it stood before the CMS. It is used in two places:
 *   - `npm run cms:seed` writes it into Supabase as the starting content;
 *   - the public site falls back to it, field by field, when a stored
 *     document is missing a value — so a partial edit can never blank a page.
 *
 * No path-alias imports here: the seed script imports this file directly.
 */

export type Pair = { title: string; body: string };
export type Fact = { value: string; label: string };
export type Link = { label: string; url: string };

export type HomepageSections = {
  definition: boolean;
  philosophy: boolean;
  ecosystem: boolean;
  building: boolean;
  lab: boolean;
  founder: boolean;
  cta: boolean;
};

export type HomepageContent = {
  heroEyebrow: string;
  /** One line per row of the headline. The last line carries the blue full stop. */
  heroHeadline: string;
  heroLead: string;
  heroPrimaryLabel: string;
  heroPrimaryHref: string;
  heroSecondaryLabel: string;
  heroSecondaryHref: string;
  heroFacts: Fact[];
  definitionTitle: string;
  definitionStatementStrong: string;
  definitionStatement: string;
  definitionLead: string;
  philosophyStatement: string;
  ecosystemTitle: string;
  ecosystemLead: string;
  buildingTitle: string;
  buildingLead: string;
  labTitle: string;
  labLead: string;
  founderTitle: string;
  founderLead: string;
  ctaLabel: string;
  ctaTitle: string;
  ctaCopy: string;
  sections: HomepageSections;
};

export type AboutContent = {
  label: string;
  title: string;
  lead: string;
  support: string;
  statement: string;
  statementEmphasis: string;
  intro: string;
  statements: Pair[];
  principlesTitle: string;
};

export type FounderContent = {
  eyebrow: string;
  headline: string;
  lead: string;
  body: string;
  ctaLabel: string;
  notes: Pair[];
  pillars: Pair[];
  journey: string[];
  teaserTitle: string;
  teaserLead: string;
};

export type SiteContent = {
  process: string[];
  principles: Pair[];
};

export type SiteSettings = {
  siteName: string;
  tagline: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  location: string;
  socialLinks: Link[];
  content: SiteContent;
};

export const DEFAULT_HOMEPAGE: HomepageContent = {
  heroEyebrow: "N4IS / Digital technology studio",
  heroHeadline: "Building\nWhat's\nNext",
  heroLead:
    "N4IS is an independent technology studio. Ideas are explored here, engineered properly, and pushed until they work in the real world — as products, systems and experiments.",
  heroPrimaryLabel: "Explore the work",
  heroPrimaryHref: "/projects",
  heroSecondaryLabel: "Enter the lab",
  heroSecondaryHref: "/lab",
  heroFacts: [
    { value: "Independent", label: "Studio" },
    { value: "Software · AI · IoT", label: "Disciplines" },
    { value: "Four", label: "Active projects" },
  ],
  definitionTitle: "Ideas are only\nthe beginning.",
  definitionStatementStrong: "N4IS is an independent technology studio",
  definitionStatement: "building digital products, intelligent systems and experiments for a smarter tomorrow.",
  definitionLead: "Not an agency. Not a portfolio. A studio with its own project list.",
  philosophyStatement:
    "N4IS doesn't build technology for its own sake. It connects technology, people and the real world into things that actually work.",
  ecosystemTitle: "One studio.\nSeveral disciplines.",
  ecosystemLead:
    "N4IS doesn't build products in isolation. Every project draws on the same practice — software, AI, hardware and design — branching outward from one studio.",
  buildingTitle: "Currently\nBuilding",
  buildingLead:
    "Four projects in active development. Each one is shown as it actually stands — in progress, in prototype, still being shaped.",
  labTitle: "Experiments in progress",
  labLead:
    "Work is a product list. The Lab is the room before it — prototypes, studies and open questions that may never become a project, and sometimes do.",
  founderTitle: "The person\nbehind N4IS.",
  founderLead:
    "Every project on this site starts with one person deciding an idea is worth following through — then doing the design, the engineering and the iteration to find out.",
  ctaLabel: "Have an idea?",
  ctaTitle: "The next idea could start here.",
  ctaCopy: "Bring a question, an early concept, or a problem worth exploring.",
  sections: {
    definition: true,
    philosophy: true,
    ecosystem: true,
    building: true,
    lab: true,
    founder: true,
    cta: true,
  },
};

export const DEFAULT_ABOUT: AboutContent = {
  label: "N4IS / Manifesto",
  title: "About",
  lead: "An independent technology studio for ideas that deserve to become real.",
  support: "This page is the studio explaining itself: what it is, why it exists, and the order it works in.",
  statement: "N4IS exists to find out whether an idea holds up.",
  statementEmphasis: "Everything on this site is the result of following one far enough to know.",
  intro:
    "The studio is one practice: the brief, the interface, the system and the decision about when something is honestly finished all happen in the same place.",
  statements: [
    {
      title: "What N4IS is",
      body: "An independent technology studio — a place to explore ideas and turn the strongest ones into real things. It is one practice, not an agency and not a résumé.",
    },
    {
      title: "Why it exists",
      body: "Because curiosity gets more interesting when it becomes practical. N4IS exists to keep asking what could be built next, and then to actually build it.",
    },
    {
      title: "What it builds",
      body: "Software, AI systems, web applications, mobile experiences, IoT concepts, and experimental technology — usually more than one of those at once.",
    },
    {
      title: "How ideas become projects",
      body: "An idea starts in the Lab as a study or prototype. If it survives the questions, it moves into Work with a number, a status and a real scope. Nothing skips that step.",
    },
    {
      title: "Technology philosophy",
      body: "Start with the question. Learn the constraints. Design the experience. Engineer the system. Keep refining. Technology should earn its place, not announce itself.",
    },
    {
      title: "Where it is going",
      body: "Forward, one considered experiment and product at a time — with new interactions, connected systems and intelligent tools as the areas worth pushing on.",
    },
  ],
  principlesTitle: "How N4IS builds",
};

export const DEFAULT_FOUNDER_NAME = "";
export const DEFAULT_FOUNDER_ROLE = "Founder & CEO";

export const DEFAULT_FOUNDER: FounderContent = {
  eyebrow: "N4IS / Independent technology studio",
  headline: "The person\nbehind N4IS",
  lead: "Every product starts with an idea. N4IS started with one — and with the decision to design, engineer and ship it personally rather than wait for permission.",
  body: "The studio is run as a single practice: the same person writes the brief, draws the interface, builds the system, and decides when it is honest to call something finished.",
  ctaLabel: "Work with me",
  notes: [
    {
      title: "About",
      body: "N4IS is an independent technology studio built around curiosity, practical engineering, and the belief that an idea is worth following through.",
    },
    {
      title: "What I build",
      body: "Software, AI systems, web experiences, connected concepts, and experiments that move an idea closer to the real world.",
    },
    {
      title: "Technology interests",
      body: "AI, web platforms, mobile experiences, IoT systems, automation, data, product design, and the space between digital and physical.",
    },
  ],
  pillars: [
    {
      title: "Vision",
      body: "Keep learning in public through the work: explore carefully, build with intent, and create technology that earns its place.",
    },
    {
      title: "Building",
      body: "Software, AI systems, web experiences and connected concepts — designed and engineered end to end rather than handed off.",
    },
    {
      title: "Experimentation",
      body: "Prototypes before promises. The Lab exists so ideas can be tested honestly before they are called projects.",
    },
  ],
  journey: ["Curious", "Learning", "Experimenting", "Building", "N4IS"],
  teaserTitle: "The person\nbehind N4IS.",
  teaserLead:
    "Every project on this site starts with one person deciding an idea is worth following through — then doing the design, the engineering and the iteration to find out.",
};

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "N4IS",
  tagline: "Ideas for a smarter tomorrow",
  description:
    "N4IS is an independent technology studio where ideas are explored, engineered and turned into real digital products, systems and experiments.",
  contactEmail: "",
  contactPhone: "",
  location: "",
  socialLinks: [],
  content: {
    process: ["IDEAS", "BUILD", "EXPERIMENT", "ENGINEER", "CREATE", "ITERATE", "REAL WORLD"],
    principles: [
      {
        title: "Start with the question",
        body: "Every project begins as something worth understanding, not as a feature list. The question shapes what gets built.",
      },
      {
        title: "Build to learn",
        body: "Prototypes are the fastest way to find out whether an idea holds up. The work is written to be tested, not defended.",
      },
      {
        title: "Engineer for the real world",
        body: "An idea only counts once it survives contact with real constraints — devices, people, networks, budgets, time.",
      },
      {
        title: "Iterate in public",
        body: "Projects are shown as they are: in development, in prototype, in research. Progress over polish claims.",
      },
    ],
  },
};
