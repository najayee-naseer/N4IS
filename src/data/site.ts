export const site = {
  name: "N4IS",
  domain: "n4is.business",
  url: "https://n4is.business",
  tagline: "Ideas for a smarter tomorrow",
  statement: "Building what's next.",
  descriptor: "Digital technology studio",
  description:
    "N4IS is an independent technology studio where ideas are explored, engineered and turned into real digital products, systems and experiments.",
} as const;

export const navigation = [
  { label: "N4IS", href: "/", index: "01" },
  { label: "WORK", href: "/projects", index: "02" },
  { label: "LAB", href: "/lab", index: "03" },
  { label: "FOUNDER", href: "/founder", index: "04" },
  { label: "ABOUT", href: "/about", index: "05" },
  { label: "CONTACT", href: "/contact", index: "06" },
] as const;

/** The words the studio works by — used as a repeating rhythm across pages. */
export const process = ["IDEAS", "BUILD", "EXPERIMENT", "ENGINEER", "CREATE", "ITERATE", "REAL WORLD"] as const;

export const principles = [
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
] as const;
