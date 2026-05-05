"use client";

import Image from "next/image";
import { SpotlightCard } from "@/components/reactbits/SpotlightCard";

type ProjectEntry = {
  title: string;
  category: string;
  year: string;
  timeline: string;
  story: string;
  quote: string;
  attribution: string;
  tags: readonly string[];
  url: string;
  image: { src: string; alt: string };
};

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const projects: ProjectEntry[] = [
  {
    title: "Panorama Žabiny",
    category: "Real estate · Design system · Next.js",
    year: "2026",
    timeline: "3–4 weeks",
    story:
      "A residential developer in Brno needed a site that could sell apartments before they existed as a physical experience. The challenge: make floor plans feel like a home, and make the project look prestigious enough to run as a Google Ad. Built a fully animated Next.js site with unit browsing, availability states, and a visual language that matched the architectural identity of the project.",
    quote:
      "We started getting more clients coming to view the apartments. The site made everything feel prestigious — and we could run it as a Google Ad straight away.",
    attribution: "Panorama Žabiny, residential developer, Brno",
    tags: ["Next.js", "TypeScript", "Tailwind", "React"],
    url: "https://www.panoramazabiny.cz",
    image: {
      src: "/panoramaph.webp",
      alt: "Panorama Žabiny website showcase on a screen",
    },
  },
  {
    title: "Golden Touch",
    category: "Culture · Motion · Creative direction",
    year: "2026",
    timeline: "1–2 weeks",
    story:
      "A barber shop in Ostrava with a sharp identity and zero digital presence to match it. The brief: make the site feel like the place before you walk in. Built a motion-forward experience using Next.js and Framer Motion — atmosphere over information, with a dark editorial visual language that put personality first.",
    quote:
      "People find us online now. It's like a business card — but with style. It's totally us.",
    attribution: "Golden Touch, barber shop, Ostrava",
    tags: ["Next.js", "Tailwind", "Motion"],
    url: "https://www.goldentouchova.cz",
    image: {
      src: "/barbermartini.webp",
      alt: "Golden Touch barber shop site on a phone",
    },
  },
  {
    title: "DVD Culture",
    category: "Product · Creative direction · Visual culture",
    year: "2026",
    timeline: "3–4 weeks",
    story:
      "A video production and creative direction studio whose work was sharper than their digital presence. Needed a home that matched the quality and density of their portfolio. Built a high-performance interface using Three.js and GSAP — hierarchy and motion language tuned so the work speaks, not the wrapper around it.",
    quote:
      "The site reflects our signature style — all our work in one place, under one roof. Clients can see the full picture.",
    attribution: "DVD Culture™, video production & creative direction",
    tags: ["Next.js", "Three.js", "GSAP", "React"],
    url: "https://www.dvdculture.com",
    image: {
      src: "/dvdculture.webp",
      alt: "DVD Culture studio portfolio site preview",
    },
  },
];

export function ProjectsSection() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="relative overflow-hidden border-b border-accent/10 bg-[#111018]"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_0%,rgba(130,80,255,0.16)_0%,rgba(17,16,24,0.08)_52%,rgba(17,16,24,0.5)_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.1]"
        aria-hidden
        style={{
          backgroundImage: NOISE,
          backgroundSize: "96px 96px",
          mixBlendMode: "overlay",
        }}
      />
      <div
        className="pointer-events-none absolute -left-[12%] top-[18%] font-[family-name:var(--font-display)] text-[clamp(7rem,24vw,20rem)] font-bold leading-none tracking-[-0.06em] text-white/[0.035]"
        aria-hidden
      >
        0
      </div>

      <div className="relative mx-auto max-w-[100rem] px-4 py-24 sm:px-6 lg:px-12 lg:py-36">
        <header className="grid gap-14 lg:mb-28 lg:grid-cols-12 lg:gap-8 lg:items-end">
          <div className="lg:col-span-8">
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.38em] text-accent/80">
              Selected
            </p>
            <h2
              id="projects-heading"
              data-gsap="reveal"
              className="mt-5 font-[family-name:var(--font-display)] text-[clamp(3.25rem,11vw,8rem)] font-bold leading-[0.92] tracking-[-0.045em] text-white"
            >
              <span className="block">Projects</span>
              <span
                className="mt-3 block max-w-xl font-mono text-[clamp(0.7rem,1.8vw,0.85rem)] font-medium normal-case tracking-[0.35em] text-neutral-500"
                aria-hidden
              >
                01 — {String(projects.length).padStart(2, "0")}
              </span>
            </h2>
            <p className="mt-8 max-w-md border-l border-accent/30 pl-6 text-sm leading-relaxed text-neutral-400 sm:text-base">
              Interfaces in the wild—swap for your own captures when we ship
              together.
            </p>
          </div>
          <div className="hidden lg:col-span-4 lg:flex lg:justify-end lg:pb-2">
            <p className="max-h-[11rem] text-[0.6rem] font-medium uppercase leading-loose tracking-[0.42em] text-neutral-500 [writing-mode:vertical-rl]">
              Strategy · UI · build · ship
            </p>
          </div>
        </header>

        <div className="flex flex-col">
          {projects.map((project, index) => {
            const n = String(index + 1).padStart(2, "0");
            const reversed = index % 2 === 1;

            return (
              <div key={project.title} className="relative">
                {index > 0 ? (
                  <div
                    className="mx-auto mb-2 h-px max-w-3xl bg-gradient-to-r from-transparent via-accent/18 to-transparent sm:mb-0"
                    aria-hidden
                  />
                ) : null}
                <SpotlightCard glowTint="accent" className="group">
                  <article
                    className={`relative flex flex-col overflow-hidden rounded-sm border border-white/[0.08] transition-colors duration-300 ease-out hover:border-accent/35 lg:min-h-[min(88vh,920px)] lg:flex-row lg:items-stretch ${
                      reversed ? "lg:flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`relative flex-1 overflow-hidden bg-black lg:w-[56%] ${
                        reversed
                          ? "rounded-sm rounded-br-[3rem] rounded-tl-[2.75rem] lg:rounded-none lg:rounded-br-[2.5rem] lg:rounded-tl-[2rem]"
                          : "rounded-sm rounded-bl-[3rem] rounded-tr-[2.75rem] lg:rounded-none lg:rounded-bl-[2.5rem] lg:rounded-tr-[2rem]"
                      }`}
                    >
                      <div
                        className="pointer-events-none absolute inset-0 z-[2] opacity-[0.12] mix-blend-overlay"
                        style={{
                          backgroundImage: NOISE,
                          backgroundSize: "88px 88px",
                        }}
                        aria-hidden
                      />
                      <Image
                        src={project.image.src}
                        alt={project.image.alt}
                        fill
                        className="object-cover will-change-auto"
                        sizes="(max-width: 1024px) 100vw, 56vw"
                        priority={index === 0}
                      />
                      <div
                        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/32 via-black/5 to-transparent"
                        aria-hidden
                      />
                      <div className="pointer-events-none absolute left-5 top-5 z-[3] max-w-[min(100%,20rem)] sm:left-7 sm:top-7">
                        <span className="inline-block border border-white/20 bg-black/35 px-3 py-1.5 font-mono text-[0.6rem] leading-snug tracking-[0.12em] text-white/90 backdrop-blur-md">
                          {project.category}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`flex flex-1 flex-col gap-8 border-t border-white/[0.06] px-5 py-12 sm:gap-9 sm:px-7 sm:py-16 lg:w-[44%] lg:border-t-0 lg:border-white/[0.06] lg:py-10 ${
                        reversed
                          ? "lg:border-r lg:pl-8 lg:pr-10"
                          : "lg:border-l lg:pl-10 lg:pr-8"
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="font-mono text-[0.7rem] tabular-nums tracking-[0.2em] text-accent/90">
                          {n}
                        </span>
                        <time
                          dateTime={project.year}
                          className="font-mono text-xs tabular-nums text-neutral-500"
                        >
                          {project.year}
                        </time>
                      </div>

                      <div className="flex flex-1 flex-col gap-6">
                        <h3 className="font-[family-name:var(--font-display)] text-[clamp(1.85rem,4.8vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.035em] text-white lg:max-w-[20ch]">
                          {project.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-neutral-500 sm:text-[0.9375rem]">
                          {project.category}
                        </p>
                        <p className="font-mono text-[0.65rem] tracking-[0.08em] text-neutral-500">
                          {project.timeline}
                        </p>
                        <p className="max-w-lg text-sm leading-[1.75] text-neutral-300 sm:text-base">
                          {project.story}
                        </p>
                        <figure className="max-w-lg border-l border-accent/45 pl-6">
                          <blockquote className="text-sm italic leading-relaxed text-neutral-200 sm:text-base">
                            <p>&ldquo;{project.quote}&rdquo;</p>
                          </blockquote>
                          <figcaption className="mt-4 font-mono text-[0.65rem] leading-relaxed tracking-[0.06em] text-neutral-500">
                            {project.attribution}
                          </figcaption>
                        </figure>
                      </div>

                      <div className="flex flex-col gap-6 border-t border-white/[0.06] pt-8 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-x-6 sm:gap-y-4">
                        <ul
                          className="flex flex-wrap gap-2"
                          aria-label="Technologies used"
                        >
                          {project.tags.map((tag) => (
                            <li key={tag}>
                              <span className="inline-block rounded-full border border-white/15 px-2.5 py-1 font-mono text-[0.65rem] tracking-wide text-neutral-400">
                                {tag}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-accent/55 bg-accent/10 px-4 py-2 font-mono text-[0.75rem] font-medium tracking-[0.14em] text-accent transition-colors hover:border-accent hover:bg-accent/20 hover:text-white"
                        >
                          visit
                          <span aria-hidden className="text-base leading-none">
                            →
                          </span>
                          <span className="sr-only">(opens in a new tab)</span>
                        </a>
                      </div>
                    </div>
                  </article>
                </SpotlightCard>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
