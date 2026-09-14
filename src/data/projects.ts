import type { Project } from "@/types/content";

const section = (label: string, title: string, body: string) => ({ label, title, body });

/**
 * Only projects with `active: true` are surfaced anywhere on the site.
 * STETHOPS is retained below as an archived historical record and is
 * filtered out of every listing, card, link and route.
 */
export const projects: Project[] = [
  {
    slug: "bookmysalon",
    number: "01",
    name: "BookMySalon",
    shortDescription: "A modern salon booking ecosystem built for Sri Lankan businesses.",
    description:
      "BookMySalon explores a clearer path between discovering a service, finding real availability, and booking with confidence.",
    category: "WEB / PLATFORM",
    year: "IN PROGRESS",
    status: "IN DEVELOPMENT",
    technologies: ["Web", "Platform", "UI/UX"],
    image: null,
    heroImage: null,
    featured: true,
    active: true,
    focus: [
      "Service discovery that shows what is actually available",
      "Scheduling built around the booking moment, not around a database",
      "A calm, legible interface for customers and salon owners alike",
      "A Sri Lankan context treated as a first-class design constraint",
    ],
    content: [
      section("OVERVIEW", "A more considered booking experience.", "The concept focuses on reducing friction between browsing services and confirming an appointment."),
      section("THE PROBLEM", "Booking should be clear, not a chore.", "Service discovery, availability, and decision-making deserve one coherent experience rather than three disconnected ones."),
      section("THE CONCEPT", "Bring the journey into focus.", "A platform direction built around clear information, intuitive scheduling, and a calm user flow from first look to confirmed appointment."),
      section("TECHNOLOGY", "A web platform, designed interface-first.", "The work sits across web platform engineering and interface design; implementation details continue to be shaped by what the flow actually needs."),
      section("DEVELOPMENT", "Actively being shaped.", "The product is in development. Scope and implementation continue to evolve through iteration."),
      section("FUTURE DIRECTION", "A platform with room to grow.", "Future exploration will be guided by what creates a more useful experience for customers and service providers."),
    ],
  },
  {
    slug: "ai-interview-viva-engine",
    number: "02",
    name: "AI Interview & Viva Engine",
    shortDescription: "An AI-powered interview and evaluation platform.",
    description:
      "An experimental software direction investigating how AI can help structure interactive assessment conversations without removing human judgement.",
    category: "AI / SOFTWARE",
    year: "IN PROGRESS",
    status: "IN DEVELOPMENT",
    technologies: ["AI", "Education", "Software"],
    image: null,
    heroImage: null,
    featured: true,
    active: true,
    focus: [
      "Conversation flow that can follow context without becoming rigid",
      "Contextual prompting that keeps the assessment intentional",
      "Reviewable outputs a person can read, question and correct",
      "Responsible use kept in scope from the start, not bolted on later",
    ],
    content: [
      section("OVERVIEW", "A conversation designed to adapt.", "This prototype explores how an interview or viva flow could become more structured, responsive, and useful."),
      section("THE PROBLEM", "Assessment is rarely one-size-fits-all.", "Conversations benefit from a system that can follow context while keeping the process intentional and reviewable."),
      section("THE CONCEPT", "Explore adaptive questioning.", "The engine is being prototyped as a guided layer for generating and managing assessment interactions."),
      section("TECHNOLOGY", "An AI layer around a defined process.", "The current direction considers conversation flow, contextual prompts, and outputs that stay open to human review."),
      section("DEVELOPMENT", "Research through making.", "Prototype work is focused on understanding the right interaction model before defining a production path."),
      section("FUTURE DIRECTION", "Continue testing the useful edges.", "The next questions are about clarity, responsible use, and how human judgement remains central."),
    ],
  },
  {
    slug: "fuellink",
    number: "03",
    name: "Fuellink",
    shortDescription: "An IoT-based emergency fuel assistance system.",
    description:
      "Fuellink is a technology exploration at the intersection of physical signals, connected systems, and information people can act on.",
    category: "IoT / EMBEDDED",
    year: "IN PROGRESS",
    status: "PROTOTYPE",
    technologies: ["IoT", "Embedded", "Hardware"],
    image: null,
    heroImage: null,
    featured: true,
    active: true,
    focus: [
      "A physical device designed around an emergency moment",
      "Connectivity and location as part of the product, not an add-on",
      "Turning device-level signals into visibility someone can use",
      "Hardware, firmware and interface treated as one problem",
    ],
    content: [
      section("OVERVIEW", "Where physical systems meet useful context.", "Fuellink investigates a connected approach to interpreting information from the real world."),
      section("THE PROBLEM", "Data is only valuable when it becomes understandable.", "Connected devices have the potential to make complex physical situations easier to observe and respond to."),
      section("THE CONCEPT", "Link signal, system, and decision.", "The concept is exploring an IoT architecture that can turn device-level inputs into meaningful visibility."),
      section("TECHNOLOGY", "Hardware and connectivity as one system.", "Hardware, connectivity, and data handling are being investigated together as a single connected product problem."),
      section("DEVELOPMENT", "Prototype stage.", "No completion is being claimed. The work is currently focused on validating technical directions."),
      section("FUTURE DIRECTION", "Learn from the physical world.", "The path ahead is about testing useful ways to connect sensing, context, and action."),
    ],
  },
  {
    slug: "appleexpert",
    number: "04",
    name: "AppleExpert",
    preserveCase: true,
    shortDescription:
      "An Apple-focused e-commerce ecosystem bringing devices, genuine parts, accessories and support into one experience.",
    description:
      "AppleExpert is an Apple-focused e-commerce ecosystem bringing devices, genuine replacement parts, accessories and support into one digital experience — built as a web storefront and packaged as an Android app.",
    category: "E-COMMERCE / MOBILE / TECHNOLOGY",
    year: "IN PROGRESS",
    status: "IN DEVELOPMENT",
    technologies: ["E-Commerce", "Mobile", "Technology"],
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Supabase (Postgres, Auth, RLS)",
      "Capacitor (Android)",
      "Framer Motion",
    ],
    image: "/projects/appleexpert/showcase.webp",
    heroImage: "/projects/appleexpert/showcase.webp",
    gallery: [
      {
        src: "/projects/appleexpert/home.webp",
        alt: "AppleExpert home screen showing the store hero, search and category shortcuts",
        caption: "Home — the storefront entry, search and category shortcuts",
      },
      {
        src: "/projects/appleexpert/categories.webp",
        alt: "AppleExpert categories screen listing iPhone, iPad, Mac, Apple Watch and AirPods",
        caption: "Categories — devices, parts and accessories in one index",
      },
      {
        src: "/projects/appleexpert/iphone.webp",
        alt: "AppleExpert iPhone category with model filters and product cards",
        caption: "iPhone — the lineup with filters, specs and pricing",
      },
      {
        src: "/projects/appleexpert/mac.webp",
        alt: "AppleExpert Mac category showing laptops and desktops",
        caption: "Mac — laptops and desktops across the range",
      },
      {
        src: "/projects/appleexpert/parts.webp",
        alt: "AppleExpert replacement battery listings selected by iPhone model",
        caption: "Replacement parts — batteries and displays, chosen by device model",
      },
      {
        src: "/projects/appleexpert/accessories.webp",
        alt: "AppleExpert accessories category with MagSafe, cases, cables and power filters",
        caption: "Accessories — cases, charging and everyday extras",
      },
    ],
    featured: true,
    active: true,
    focus: [
      "One catalogue covering whole devices and the parts that repair them",
      "Replacement parts browsed by the device they actually fit",
      "Separate retail and wholesale experiences over a single product catalogue",
      "An admin panel where the catalogue is data — no code change to add a product",
      "The same storefront delivered on the web and as an Android app",
    ],
    content: [
      section(
        "OVERVIEW",
        "Everything Apple, in one place.",
        "AppleExpert brings Apple devices, genuine replacement parts, accessories and the support around them into a single storefront. It is being built as a web application and packaged for Android from the same codebase, with the catalogue, pricing and customer accounts held in one backend.",
      ),
      section(
        "THE IDEA",
        "The device and the part belong together.",
        "Buying an Apple device and repairing one are usually two separate journeys in two separate places. AppleExpert treats them as the same catalogue: the customer who came for an iPhone and the customer who came to replace its battery arrive at the same shelf, with parts browsed by the device they actually fit.",
      ),
      section(
        "CURRENT BUILD",
        "A storefront and the panel behind it.",
        "The storefront covers the home experience, category browsing across iPhone, iPad, Mac, Apple Watch, AirPods and accessories, product pages with variants and specifications, search, cart and wishlist, plus replacement batteries and displays selected by model. Behind it sits an admin panel for products, categories, orders, customers and pricing.",
      ),
      section(
        "HOW IT IS BUILT",
        "The catalogue is data, not code.",
        "A new product is added in the admin panel and reaches customers from the database — no code change and no app release. Prices are written through an audited function that keeps their history, and a product is held back from the storefront until every part of it has saved and a retail price exists.",
      ),
      section(
        "ACCOUNTS AND ACCESS",
        "One database, different views.",
        "Customers sign in with a phone number and a one-time code; administrators sign in separately. Retail and wholesale customers share one catalogue, and which prices a person can see is decided in the database rather than in the interface — the app itself has no write path to a customer's tier.",
      ),
      section(
        "DEVELOPMENT",
        "Actively being built.",
        "AppleExpert is in development. The storefront, the parts catalogue, the wholesale flow and the admin tooling continue to change, and nothing here is being presented as finished.",
      ),
      section(
        "NEXT",
        "Deepen the catalogue and the wholesale path.",
        "The current direction is continued work on the wholesale access flow, the admin catalogue tooling, and the Android build — guided by what the storefront actually needs rather than by a fixed feature list.",
      ),
      section(
        "INDEPENDENCE",
        "An N4IS project, not an Apple one.",
        "AppleExpert is an independent N4IS project. It is not owned by, operated by, endorsed by or affiliated with Apple Inc.",
      ),
    ],
  },
  {
    slug: "stethops",
    number: "A-01",
    name: "STETHOPS",
    shortDescription: "An archived healthcare software concept.",
    description: "STETHOPS is an archived software exploration within healthcare. It is not an active N4IS project.",
    category: "HEALTHCARE / SOFTWARE",
    year: "ARCHIVED",
    status: "ARCHIVED",
    technologies: ["Healthcare", "Software", "UX"],
    image: null,
    heroImage: null,
    featured: false,
    active: false,
    focus: [],
    content: [
      section("ARCHIVE", "Not an active project.", "This concept is retained only as a historical record and is not part of the active N4IS project list."),
    ],
  },
];

/** Everything the site renders comes from this list. */
export const activeProjects = projects.filter((project) => project.active);

export const featuredProjects = activeProjects.filter((project) => project.featured);

export const getProject = (slug: string) => activeProjects.find((project) => project.slug === slug);

export const getProjectNeighbours = (slug: string) => {
  const index = activeProjects.findIndex((project) => project.slug === slug);
  if (index === -1) return { previous: null, next: null };
  return {
    previous: activeProjects[index - 1] ?? activeProjects[activeProjects.length - 1] ?? null,
    next: activeProjects[index + 1] ?? activeProjects[0] ?? null,
  };
};
