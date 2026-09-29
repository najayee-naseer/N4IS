import { z } from "zod";
import { LAB_STATUSES, MEDIA_MAX_BYTES, MEDIA_MIME_TYPES, PROJECT_STATUSES, SLUG_PATTERN } from "./vocab";

/**
 * Validation for everything the admin writes. The same schemas run in the
 * editor for instant feedback and again in the server action, which is the
 * one that counts — the database then enforces its own constraints and RLS.
 */

const text = (max: number) => z.string().trim().max(max, `Keep this under ${max} characters`);
const required = (label: string, max: number) =>
  z.string().trim().min(1, `${label} is required`).max(max, `${label} must be under ${max} characters`);
const optionalUrl = z.union([z.literal(""), z.url("Enter a full URL, including https://")]);
const list = (itemMax: number, count: number) =>
  z.array(z.string().trim().min(1).max(itemMax)).max(count, `No more than ${count} items`);

export const slugSchema = z
  .string()
  .trim()
  .min(2, "Slug is required")
  .max(80, "Slug must be under 80 characters")
  .regex(SLUG_PATTERN, "Use lowercase letters, numbers and single hyphens, e.g. my-project");

export const narrativeSchema = z.object({
  label: required("Section label", 40),
  title: required("Section title", 160),
  body: required("Section text", 4000),
});

export const pairSchema = z.object({
  title: required("Title", 120),
  body: required("Text", 1200),
});

export const linkSchema = z.object({
  label: required("Link label", 40),
  url: z.url("Enter a full URL, including https://"),
});

export const mediaLinkSchema = z.object({
  mediaId: z.uuid(),
  caption: text(200),
});

export const projectInputSchema = z.object({
  title: required("Project name", 120),
  slug: slugSchema,
  projectNumber: text(12),
  category: required("Category", 80),
  status: z.enum(PROJECT_STATUSES, "Choose a status"),
  stageLabel: text(40),
  shortDescription: required("Short description", 300),
  description: text(4000),
  technologies: list(40, 20),
  stack: list(60, 30),
  focus: list(300, 20),
  sections: z.array(narrativeSchema).max(20),
  preserveCase: z.boolean(),
  featured: z.boolean(),
  published: z.boolean(),
  sortOrder: z.number().int("Sort order must be a whole number").min(0).max(9999),
  liveUrl: optionalUrl,
  githubUrl: optionalUrl,
  heroMediaId: z.uuid().nullable(),
  logoMediaId: z.uuid().nullable(),
  gallery: z.array(mediaLinkSchema).max(40),
  additional: z.array(mediaLinkSchema).max(40),
});
export type ProjectInput = z.infer<typeof projectInputSchema>;

export const labInputSchema = z.object({
  title: required("Title", 120),
  slug: slugSchema,
  entryNumber: text(12),
  category: required("Category", 80),
  status: z.enum(LAB_STATUSES, "Choose a status"),
  dateLabel: text(40),
  summary: required("Summary", 300),
  description: text(4000),
  technologies: list(40, 20),
  sections: z.array(narrativeSchema).max(20),
  coverMediaId: z.uuid().nullable(),
  gallery: z.array(mediaLinkSchema).max(40),
  featured: z.boolean(),
  published: z.boolean(),
  sortOrder: z.number().int().min(0).max(9999),
});
export type LabInput = z.infer<typeof labInputSchema>;

export const homepageSchema = z.object({
  heroEyebrow: text(80),
  heroHeadline: required("Headline", 80),
  heroLead: required("Hero description", 600),
  heroPrimaryLabel: required("Primary button label", 40),
  heroPrimaryHref: required("Primary button link", 200),
  heroSecondaryLabel: required("Secondary button label", 40),
  heroSecondaryHref: required("Secondary button link", 200),
  heroFacts: z.array(z.object({ value: required("Fact", 40), label: required("Fact label", 40) })).max(4),
  definitionTitle: required("Definition title", 120),
  definitionStatementStrong: text(200),
  definitionStatement: text(400),
  definitionLead: text(300),
  philosophyStatement: text(400),
  ecosystemTitle: required("Ecosystem title", 120),
  ecosystemLead: text(400),
  buildingTitle: required("Projects title", 80),
  buildingLead: text(400),
  labTitle: required("Lab title", 80),
  labLead: text(400),
  founderTitle: required("Founder title", 80),
  founderLead: text(400),
  ctaLabel: text(60),
  ctaTitle: required("Closing title", 120),
  ctaCopy: text(300),
  sections: z.object({
    definition: z.boolean(),
    philosophy: z.boolean(),
    ecosystem: z.boolean(),
    building: z.boolean(),
    lab: z.boolean(),
    founder: z.boolean(),
    cta: z.boolean(),
  }),
});

export const aboutSchema = z.object({
  content: z.object({
    label: text(80),
    title: required("Title", 80),
    lead: required("Introduction", 400),
    support: text(600),
    statement: text(300),
    statementEmphasis: text(300),
    intro: text(800),
    statements: z.array(pairSchema).max(12),
    principlesTitle: required("Principles title", 80),
  }),
  imageMediaId: z.uuid().nullable(),
  published: z.boolean(),
});

export const founderSchema = z.object({
  name: text(80),
  role: required("Role", 80),
  content: z.object({
    eyebrow: text(80),
    headline: required("Headline", 120),
    lead: required("Bio", 800),
    body: text(1200),
    ctaLabel: required("Button label", 40),
    notes: z.array(pairSchema).max(6),
    pillars: z.array(pairSchema).max(6),
    journey: list(40, 8),
    teaserTitle: required("Homepage title", 120),
    teaserLead: text(600),
  }),
  photoMediaId: z.uuid().nullable(),
  socialLinks: z.array(linkSchema).max(8),
  published: z.boolean(),
});

export const contactSettingsSchema = z.object({
  contactEmail: z.union([z.literal(""), z.email("Enter a valid email address")]),
  contactPhone: text(40),
  location: text(120),
  socialLinks: z.array(linkSchema).max(8),
});

export const siteSettingsSchema = z.object({
  siteName: required("Site name", 60),
  tagline: text(120),
  description: required("Description", 400),
  content: z.object({
    process: list(30, 10),
    principles: z.array(pairSchema).max(8),
  }),
});

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.email("Please enter a valid email address").max(254),
  subject: z.string().trim().min(3, "Please add a short subject").max(200),
  message: z.string().trim().min(20, "Please add a little more detail (20 characters or more)").max(5000),
});

export const mediaRegisterSchema = z.object({
  storagePath: z
    .string()
    .min(3)
    .max(400)
    .regex(/^[a-z0-9][a-z0-9/._-]*$/, "Unexpected storage path"),
  folder: z.string().min(1).max(200),
  filename: z.string().min(1).max(200),
  mimeType: z.enum(MEDIA_MIME_TYPES, "Only JPEG, PNG, WebP, AVIF or GIF images are accepted"),
  fileSize: z.number().int().positive().max(MEDIA_MAX_BYTES, "Images must be 10 MB or smaller"),
  width: z.number().int().positive().nullable(),
  height: z.number().int().positive().nullable(),
  altText: text(300),
});

/** Turn a zod error into { "field.path": "message" } for forms. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
