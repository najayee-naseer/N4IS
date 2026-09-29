/** Structural constants — the domain and navigation are code, not content. Editable copy lives in Supabase. */
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
