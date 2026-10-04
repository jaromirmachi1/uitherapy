export type ProjectId =
  | "panorama"
  | "vojta"
  | "laflare"
  | "sadia"
  | "dvd"
  | "doktor"
  | "golden"
  | "speed"
  | "prevezem";

export type HighlightKind =
  | "hero"
  | "scroll"
  | "catalog"
  | "detail"
  | "mobile"
  | "checkout"
  | "booking"
  | "gate"
  | "partner";

/** Service filters used on the projects grid (labels live in the dictionary). */
export type ServiceKey = "ecommerce" | "brand" | "motion" | "seo";

export const serviceKeys: ServiceKey[] = [
  "brand",
  "motion",
  "seo",
  "ecommerce",
];

export type ProjectHighlight = {
  src: string;
  kind: HighlightKind;
  object?: "top" | "center" | "bottom";
  portrait?: boolean;
  /** Prefer contain over cover (tall/full-page captures). */
  contain?: boolean;
};

export type ProjectEntry = {
  id: ProjectId;
  title: string;
  year: string;
  url: string;
  image: string;
  mockup?: string;
  /** Landscape capture for grid tiles when `image` isn't one. */
  tileImage?: string;
  /** Featured case-study frame: inset padded mock, or full-bleed cover. */
  frame?: "inset" | "cover";
  tech: string[];
  /** Services delivered — drive the tag pills and the filter row. */
  services: ServiceKey[];
  highlights: ProjectHighlight[];
};

/**
 * Homepage selection. Order = display order; the grid pairs them into
 * alternating wide / narrow rows, so keep projects with a mobile capture
 * in positions that land on a narrow tile.
 */
export const featuredProjectIds: ProjectId[] = [
  "vojta",
  "panorama",
  "doktor",
  "sadia",
  "laflare",
  "dvd",
];

function deskPair(
  desk: string,
  desk2: string,
  mobile: string,
): ProjectHighlight[] {
  return [
    { src: desk, kind: "hero", object: "top" },
    { src: desk2, kind: "scroll", object: "top" },
    { src: mobile, kind: "mobile", object: "top", portrait: true },
  ];
}

export const projects: ProjectEntry[] = [
  {
    id: "vojta",
    title: "Vojta Hubne",
    year: "2025",
    url: "https://www.vojtahubne.cz",
    image: "/projects/vojta.webp",
    tileImage: "/projects/vojta-home-desk.webp",
    frame: "inset",
    tech: ["Next.js", "Motion", "SEO", "E-commerce"],
    services: ["ecommerce", "seo"],
    highlights: [
      {
        src: "/projects/vojta-home-desk.webp",
        kind: "hero",
        object: "top",
      },
      {
        src: "/projects/vojta-shop-desk.webp",
        kind: "catalog",
        object: "top",
      },
      {
        src: "/projects/vojta-spoluprace-desk.webp",
        kind: "partner",
        object: "top",
      },
      {
        src: "/projects/vojta-product-desk.webp",
        kind: "detail",
        object: "top",
      },
      {
        src: "/projects/vojta-mobile-home.webp",
        kind: "mobile",
        object: "top",
        portrait: true,
      },
      {
        src: "/projects/vojta-mobile-catalog.webp",
        kind: "catalog",
        object: "top",
        portrait: true,
      },
      {
        src: "/projects/vojta-mobile-product.webp",
        kind: "detail",
        object: "top",
        portrait: true,
      },
    ],
  },
  {
    id: "sadia",
    title: "Sadia",
    year: "2025",
    url: "https://www.sadiaestate.cz",
    image: "/projects/sadia.webp",
    frame: "inset",
    tech: ["Next.js", "SEO", "Real estate"],
    services: ["brand", "seo"],
    highlights: [
      { src: "/projects/sadia.webp", kind: "hero", object: "top" },
      { src: "/projects/sadia.webp", kind: "scroll", object: "center" },
      {
        src: "/projects/sadia.webp",
        kind: "mobile",
        object: "top",
        portrait: true,
      },
    ],
  },
  {
    id: "panorama",
    title: "Panorama Žabiny",
    year: "2026",
    url: "https://panorama-sooty.vercel.app",
    image: "/projects/panorama.webp",
    frame: "inset",
    tech: ["Next.js", "Motion", "SEO"],
    services: ["motion", "seo"],
    highlights: deskPair(
      "/projects/panorama-desk.webp",
      "/projects/panorama-desk-2.webp",
      "/projects/panorama-mobile.webp",
    ),
  },
  {
    id: "laflare",
    title: "Laflare Club",
    year: "2025",
    url: "https://laflareclub.com",
    image: "/projects/laflare.webp",
    frame: "inset",
    tech: ["Next.js", "Motion", "Culture"],
    services: ["brand", "motion"],
    highlights: [
      { src: "/projects/laflare.webp", kind: "gate", object: "center" },
      { src: "/projects/laflare.webp", kind: "hero", object: "top" },
      {
        src: "/projects/laflare.webp",
        kind: "mobile",
        object: "center",
        portrait: true,
      },
    ],
  },
  {
    id: "dvd",
    title: "DVD Culture",
    year: "2025",
    url: "https://www.dvdculture.com",
    image: "/projects/dvd.webp",
    frame: "inset",
    tech: ["Next.js", "Motion", "Portfolio"],
    services: ["brand", "motion"],
    highlights: deskPair(
      "/projects/dvd-desk.webp",
      "/projects/dvd-desk-2.webp",
      "/projects/dvd-mobile.webp",
    ),
  },
  {
    id: "doktor",
    title: "Doktor Barber",
    year: "2025",
    url: "https://doktorbarber.cz",
    image: "/projects/doktor.webp",
    frame: "inset",
    tech: ["Next.js", "Booking", "Local"],
    services: ["brand"],
    highlights: deskPair(
      "/projects/doktor-desk.webp",
      "/projects/doktor-desk-2.webp",
      "/projects/doktor-mobile.webp",
    ),
  },
  {
    id: "golden",
    title: "Golden Touch",
    year: "2025",
    url: "https://martin-press.vercel.app",
    image: "/projects/golden-site.webp",
    frame: "inset",
    tech: ["Next.js", "Motion"],
    services: ["brand", "motion"],
    highlights: deskPair(
      "/projects/golden-desk.webp",
      "/projects/golden-desk-2.webp",
      "/projects/golden-mobile.webp",
    ),
  },
  {
    id: "speed",
    title: "Speed Coffee",
    year: "2025",
    url: "https://www.speedcoffee.shop",
    image: "/projects/speed.webp",
    frame: "inset",
    tech: ["Next.js", "Brand"],
    services: ["brand", "seo"],
    highlights: [
      { src: "/projects/speed.webp", kind: "hero", object: "top" },
      { src: "/projects/speed.webp", kind: "detail", object: "center" },
      {
        src: "/projects/speed.webp",
        kind: "mobile",
        object: "top",
        portrait: true,
      },
    ],
  },
  {
    id: "prevezem",
    title: "Prevezem",
    year: "2025",
    url: "https://www.prevezem.cz",
    image: "/projects/prevezem.webp",
    frame: "inset",
    tech: ["Next.js", "SEO", "Conversion"],
    services: ["seo"],
    highlights: deskPair(
      "/projects/prevezem-desk.webp",
      "/projects/prevezem-desk-2.webp",
      "/projects/prevezem-mobile.webp",
    ),
  },
];

/** Landscape capture for wide tiles. */
export function wideImage(project: ProjectEntry): string {
  return project.tileImage ?? project.image;
}

/** Portrait (mobile) capture for narrow tiles, if the project has one. */
export function portraitImage(project: ProjectEntry): string | null {
  return project.highlights.find((h) => h.portrait && h.src !== project.image)
    ?.src ?? null;
}

/** Featured projects first, then the rest — the order used on /projects. */
export const orderedProjects: ProjectEntry[] = [
  ...featuredProjectIds
    .map((id) => projects.find((project) => project.id === id))
    .filter((project): project is ProjectEntry => Boolean(project)),
  ...projects.filter((project) => !featuredProjectIds.includes(project.id)),
];

export const featuredProjects: ProjectEntry[] = orderedProjects.slice(
  0,
  featuredProjectIds.length,
);
