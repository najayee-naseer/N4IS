import type { Project } from "@/types/content";

const section = (label: string, title: string, body: string) => ({ label, title, body });

/**
 * Only projects with `active: true` are surfaced anywhere on the site.
 * STETHOPS is retained below as an archived historical record and is
 * filtered out of every listing, card, link and route.
 */
export const projects: Project[] = [
  {
    slug: "appleexpert",
    number: "01",
    name: "AppleExpert",
    preserveCase: true,
    shortDescription:
      "An Apple-focused e-commerce ecosystem bringing devices, genuine parts, accessories and support into one experience.",
    description:
      "AppleExpert is an Apple-focused e-commerce ecosystem bringing devices, genuine replacement parts, accessories and support into one digital experience — built as a web storefront and packaged as an Android app.",
    category: "E-COMMERCE / PRODUCT SYSTEM",
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
    heroImageWidth: 1760,
    heroImageHeight: 1100,
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
    slug: "ai-interview-viva-engine",
    number: "02",
    name: "AI Interview & Viva Engine",
    shortDescription: "An AI-powered interview and viva preparation platform.",
    description:
      "An intelligent interview and viva preparation platform designed to help users practice, receive AI feedback, track performance, and improve their readiness for real opportunities.",
    category: "AI / SOFTWARE",
    year: "IN PROGRESS",
    status: "IN DEVELOPMENT",
    technologies: ["AI", "Education", "Software"],
    image: "/assets/projects/ai-interview/interview-learner.jpg",
    heroImage: "/assets/projects/ai-interview/interview-learner.jpg",
    heroImageWidth: 1536,
    heroImageHeight: 1024,
    featured: true,
    active: true,
    focus: [
      "Guided onboarding into a personalised interview and viva track",
      "Practice interviews across technical, HR, viva and aptitude domains",
      "AI feedback scored on content, clarity, confidence and relevance",
      "Progress tracking across sessions, mock tests and topic performance",
    ],
    content: [
      section("OVERVIEW", "A career companion for interview practice.", "The platform takes a user from onboarding through practice interviews, AI feedback and progress tracking, across technical, HR, viva and aptitude domains."),
      section("THE PROBLEM", "Preparation is rarely one-size-fits-all.", "Interview and viva readiness benefits from real questions, a structured practice flow, and feedback a person can actually act on — not a static question bank."),
      section("THE CONCEPT", "Practice, feedback, and visible progress.", "A home dashboard leads into practice interviews and mock tests; each answer is followed by AI feedback broken into content, clarity, confidence and relevance, and progress is tracked over time by session and topic."),
      section("TECHNOLOGY", "An AI layer around a defined process.", "The current build considers conversation flow through a practice session, structured AI evaluation of spoken or typed answers, and a progress model that stays reviewable rather than opaque."),
      section("DEVELOPMENT", "In active development.", "The interview flow, feedback scoring and progress tracking continue to be built out. Nothing here is being presented as finished."),
      section("FUTURE DIRECTION", "Deepen the domains and the feedback.", "The next steps are broadening domain coverage and sharpening how feedback is generated and presented, while keeping a person able to read, question and correct it."),
    ],
  },
  {
    slug: "indoor-futsal-booking",
    number: "03",
    name: "Indoor Futsal Booking System",
    shortDescription: "A web-based indoor sports booking experience, built and running as BE FIT INDOOR.",
    description:
      "A web-based indoor sports booking experience designed to make facility discovery and time-slot reservation simple and convenient — built and running as BE FIT INDOOR.",
    category: "WEB / BOOKING SYSTEM",
    year: "BUILT",
    status: "BUILT",
    technologies: ["Web", "Booking", "UI/UX"],
    image: "/assets/projects/indoor-futsal/be-fit-indoor.jpg",
    heroImage: "/assets/projects/indoor-futsal/be-fit-indoor.jpg",
    heroImageWidth: 1536,
    heroImageHeight: 1040,
    featured: true,
    active: true,
    focus: [
      "Court and time-slot availability shown clearly, not buried in a form",
      "A booking flow that goes from browsing to a reserved slot in a few steps",
      "A gallery and facility details that build trust before booking",
      "Sign-in kept simple for returning players",
    ],
    content: [
      section(
        "OVERVIEW",
        "Booking a court, made simple.",
        "The Indoor Futsal Booking System is a web platform for reserving time at an indoor sports facility. It is built and running as BE FIT INDOOR — a real facility management product, not a concept.",
      ),
      section(
        "THE PROBLEM",
        "Facility booking is usually a phone call.",
        "Finding a trusted indoor facility and reserving a slot should not depend on a phone call or a guess about availability. The system puts the facility, its schedule and the booking action in one place.",
      ),
      section(
        "THE CONCEPT",
        "Discovery and booking in one flow.",
        "A visitor sees the facility, its gallery and its booking entry point immediately, and moves from browsing straight into reserving a time — without a separate discovery step bolted on beforehand.",
      ),
      section(
        "TECHNOLOGY",
        "A web platform, built for one facility's real schedule.",
        "The system is a web booking platform covering facility presentation, gallery, sign-in and time-slot reservation.",
      ),
      section(
        "DEVELOPMENT",
        "Built and in use.",
        "This project has moved past prototype: it is built and operating as BE FIT INDOOR's booking experience.",
      ),
      section(
        "FUTURE DIRECTION",
        "Extend what a booking system can do.",
        "Future work is guided by what makes discovery and booking clearer for players and easier to manage for the facility.",
      ),
    ],
  },
  {
    slug: "fuellink",
    number: "04",
    name: "Fuellink",
    shortDescription: "An IoT-based emergency fuel assistance device.",
    description:
      "A compact IoT device designed to help users request emergency fuel assistance using GPS and cellular connectivity.",
    category: "IoT / EMBEDDED",
    year: "IN PROGRESS",
    status: "PROTOTYPE",
    technologies: ["IoT", "Embedded", "Hardware"],
    image: "/assets/projects/fuellink/fuellink-internal.jpg",
    heroImage: "/assets/projects/fuellink/fuellink-internal.jpg",
    heroImageWidth: 1280,
    heroImageHeight: 1024,
    featured: true,
    active: true,
    focus: [
      "A physical device designed around an emergency moment",
      "GPS and 4G cellular connectivity built into the device itself",
      "A single HELP/FUEL button to send a request without a companion app",
      "RGB LED and buzzer feedback so device status is visible and audible",
      "A rechargeable battery designed for long standby",
    ],
    content: [
      section("OVERVIEW", "Where physical systems meet useful context.", "Fuellink is a compact IoT device built around an ESP32 controller, a GPS module and a 4G module (SIM7600), designed to send an emergency fuel request with the user's location."),
      section("THE PROBLEM", "Running out of fuel is a location problem first.", "An emergency fuel request is only useful if it carries an accurate location and reaches someone through a connection that doesn't depend on a phone's data plan."),
      section("THE CONCEPT", "One button, GPS, and a cellular link.", "The device pairs a GPS module for accurate latitude and longitude with a 4G module for sending that data to the cloud, triggered by a single HELP/FUEL button, with an RGB LED and buzzer for status and audio feedback."),
      section("TECHNOLOGY", "Hardware and connectivity as one system.", "Built around an ESP32 controller, GPS module, SIM7600E 4G module, RGB status LED, buzzer, HELP/FUEL button and a rechargeable 18650 Li-ion battery, all considered together as a single connected product."),
      section("DEVELOPMENT", "Prototype stage.", "No completion is being claimed. The current internal build validates the core hardware — controller, GPS, cellular connectivity, power — before further work on firmware and the reporting side."),
      section("FUTURE DIRECTION", "Learn from the physical world.", "The path ahead is about testing the device in real conditions and refining how a device-level signal becomes something someone can act on."),
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
