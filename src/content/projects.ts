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
  | "gate";

export type ProjectHighlight = {
  src: string;
  kind: HighlightKind;
  object?: "top" | "center" | "bottom";
  portrait?: boolean;
};

export type ProjectEntry = {
  id: ProjectId;
  title: string;
  year: string;
  url: string;
  image: string;
  mockup?: string;
  tech: string[];
  highlights: ProjectHighlight[];
};

export const projects: ProjectEntry[] = [
  {
    id: "vojta",
    title: "Vojta Hubne",
    year: "2025",
    url: "https://www.vojtahubne.cz",
    image: "/projects/vojta.webp",
    tech: ["Next.js", "Motion", "SEO", "E-commerce"],
    highlights: [
      { src: "/projects/vojta.webp", kind: "hero", object: "top" },
      { src: "/projects/vojta.webp", kind: "catalog", object: "center" },
      { src: "/projects/vojta.webp", kind: "detail", object: "bottom" },
      {
        src: "/projects/vojta.webp",
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
    tech: ["Next.js", "Motion", "SEO"],
    highlights: [
      { src: "/projects/panorama.webp", kind: "hero", object: "top" },
      { src: "/projects/panorama.webp", kind: "scroll", object: "center" },
      {
        src: "/projects/panorama.webp",
        kind: "mobile",
        object: "top",
        portrait: true,
      },
    ],
  },
  {
    id: "laflare",
    title: "Laflare Club",
    year: "2025",
    url: "https://laflareclub.com",
    image: "/projects/laflare.webp",
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
    id: "sadia",
    title: "Sadia",
    year: "2025",
    url: "https://www.sadiaestate.cz",
    image: "/projects/sadia.webp",
    tech: ["Next.js", "SEO", "Real estate"],
    highlights: [
      { src: "/projects/sadia.webp", kind: "hero", object: "top" },
      { src: "/projects/sadia.webp", kind: "detail", object: "center" },
      {
        src: "/projects/sadia.webp",
        kind: "mobile",
        object: "top",
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
    tech: ["Next.js", "Motion", "Portfolio"],
    highlights: [
      { src: "/projects/dvd.webp", kind: "hero", object: "top" },
      { src: "/projects/dvd.webp", kind: "scroll", object: "center" },
      {
        src: "/projects/dvd.webp",
        kind: "mobile",
        object: "top",
        portrait: true,
      },
    ],
  },
  {
    id: "doktor",
    title: "Doktor Barber",
    year: "2025",
    url: "https://doktorbarber.cz",
    image: "/projects/doktor.webp",
    tech: ["Next.js", "Booking", "Local"],
    highlights: [
      { src: "/projects/doktor.webp", kind: "hero", object: "top" },
      { src: "/projects/doktor.webp", kind: "booking", object: "center" },
      {
        src: "/projects/doktor.webp",
        kind: "mobile",
        object: "top",
        portrait: true,
      },
    ],
  },
  {
    id: "golden",
    title: "Golden Touch",
    year: "2025",
    url: "https://martin-press.vercel.app",
    image: "/projects/golden.webp",
    tech: ["Next.js", "Motion"],
    highlights: [
      { src: "/projects/golden.webp", kind: "hero", object: "top" },
      { src: "/projects/golden.webp", kind: "scroll", object: "center" },
      {
        src: "/projects/golden.webp",
        kind: "mobile",
        object: "top",
        portrait: true,
      },
    ],
  },
  {
    id: "speed",
    title: "Speed Coffee",
    year: "2025",
    url: "https://www.speedcoffee.shop",
    image: "/projects/speed.webp",
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
    tech: ["Next.js", "SEO", "Conversion"],
    highlights: [
      { src: "/projects/prevezem.webp", kind: "hero", object: "top" },
      { src: "/projects/prevezem.webp", kind: "detail", object: "center" },
      {
        src: "/projects/prevezem.webp",
        kind: "mobile",
        object: "top",
        portrait: true,
      },
    ],
  },
];
