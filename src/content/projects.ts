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
  /** Featured case-study frame: inset padded mock, or full-bleed cover. */
  frame?: "inset" | "cover";
  tech: string[];
  highlights: ProjectHighlight[];
};

/** Large case studies shown above the marquee. Order = display order. */
export const featuredProjectIds: ProjectId[] = ["vojta", "sadia"];

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
    frame: "inset",
    tech: ["Next.js", "Motion", "SEO", "E-commerce"],
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
    highlights: deskPair(
      "/projects/prevezem-desk.webp",
      "/projects/prevezem-desk-2.webp",
      "/projects/prevezem-mobile.webp",
    ),
  },
];
