"use client";

import Image from "next/image";
import {
  ProjectTechStack,
  type ProjectTechKey,
} from "@/components/ProjectTechStack";
import { SpotlightCard } from "@/components/reactbits/SpotlightCard";

type ProjectEntry = {
  name: string;
  tag: string;
  role: string;
  year: string;
  summary: string;
  image: { src: string; alt: string };
  stack: readonly ProjectTechKey[];
};

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const projects: ProjectEntry[] = [
  {
    name: "Panorama Žabiny",
    tag: "Web design and development",
    role: "Design systems · Next.js",
    year: "2026",
    summary:
      "Developerský projekt v Žabinách, navržený pro klidné městské bydlení.",
    image: {
      src: "/panoramaph.webp",
      alt: "Panoramic photograph for the Commerce storefront project showcase",
    },
    stack: ["nextjs", "react", "typescript", "tailwind"],
  },
  {
    name: "Golden Touch",
    tag: "Culture",
    role: "Creative direction · Motion",
    year: "2025",
    summary: "Pánské holičství v Ostravě.",
    image: {
      src: "/barbermartini.webp",
      alt: "Mobile phone displaying a streaming app interface against a red backdrop",
    },
    stack: ["nextjs", "tailwind", "framer"],
  },
  {
    name: "DVD Culture",
    tag: "Product",
    role: "Product UI · A11y",
    year: "2025",
    summary:
      "Dense dashboards re-skinned: hierarchy, density modes, WCAG-aligned contrast.",
    image: {
      src: "/dvdculture.webp",
      alt: "Team collaborating at a desk with laptops open to product interfaces",
    },
    stack: ["nextjs", "react", "threedotjs", "gsap", "tailwind"],
  },
];

export function ProjectsSection() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="relative overflow-hidden border-b border-accent/12"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.25]"
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
                className="mt-3 block max-w-xl font-mono text-[clamp(0.7rem,1.8vw,0.85rem)] font-medium normal-case tracking-[0.35em] text-neutral-600"
                aria-hidden
              >
                01 — {String(projects.length).padStart(2, "0")}
              </span>
            </h2>
            <p className="mt-8 max-w-md border-l border-accent/40 pl-6 text-sm leading-relaxed text-neutral-400 sm:text-base">
              Interfaces in the wild—swap for your own captures when we ship
              together.
            </p>
          </div>
          <div className="hidden lg:col-span-4 lg:flex lg:justify-end lg:pb-2">
            <p className="max-h-[11rem] text-[0.6rem] font-medium uppercase leading-loose tracking-[0.42em] text-neutral-600 [writing-mode:vertical-rl]">
              Strategy · UI · build · ship
            </p>
          </div>
        </header>

        <div className="flex flex-col">
          {projects.map((project, index) => {
            const n = String(index + 1).padStart(2, "0");
            const reversed = index % 2 === 1;

            return (
              <div key={project.name} className="relative">
                {index > 0 ? (
                  <div
                    className="mx-auto mb-2 h-px max-w-3xl bg-gradient-to-r from-transparent via-accent/30 to-transparent sm:mb-0"
                    aria-hidden
                  />
                ) : null}
                <SpotlightCard glowTint="accent" className="group">
                  <article
                    className={`relative flex flex-col gap-12 py-20 sm:gap-14 sm:py-24 lg:min-h-[min(88vh,920px)] lg:flex-row lg:items-stretch lg:gap-8 lg:py-28 ${
                      reversed ? "lg:flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`relative flex-1 overflow-hidden bg-neutral-950 lg:w-[56%] ${
                        reversed
                          ? "rounded-sm rounded-br-[3rem] rounded-tl-[2.75rem] lg:rounded-sm lg:rounded-bl-[3.5rem] lg:rounded-tr-[2.75rem]"
                          : "rounded-sm rounded-bl-[3rem] rounded-tr-[2.75rem] lg:rounded-sm lg:rounded-br-[3.5rem] lg:rounded-tl-[2.75rem]"
                      }`}
                    >
                      <div
                        className="pointer-events-none absolute inset-0 z-[2] opacity-[0.18] mix-blend-overlay"
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
                        className="object-cover transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.012]"
                        sizes="(max-width: 1024px) 100vw, 56vw"
                        priority={index === 0}
                      />
                      <div
                        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/75 via-black/10 to-transparent"
                        aria-hidden
                      />
                      <div className="pointer-events-none absolute left-5 top-5 z-[3] sm:left-7 sm:top-7">
                        <span className="inline-block border border-white/20 bg-black/40 px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.28em] text-white/90 backdrop-blur-md">
                          {project.tag}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col justify-between gap-10 lg:w-[44%] lg:py-4">
                      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/[0.07] pb-6">
                        <span className="font-mono text-[0.7rem] tabular-nums tracking-[0.2em] text-accent/90">
                          {n}
                        </span>
                        <div className="text-right">
                          <p className="text-[0.62rem] uppercase tracking-[0.28em] text-neutral-500">
                            {project.role}
                          </p>
                          <time
                            dateTime={project.year}
                            className="mt-1 block font-mono text-xs text-neutral-600"
                          >
                            {project.year}
                          </time>
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col justify-center">
                        <h3 className="font-[family-name:var(--font-display)] text-[clamp(1.85rem,4.8vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-white transition-transform duration-700 ease-out group-hover:translate-x-1 lg:max-w-[20ch]">
                          {project.name}
                        </h3>
                        <div className="mt-8 max-w-lg border-l border-accent/35 pl-7">
                          <p className="text-sm leading-[1.75] text-neutral-400 sm:text-base">
                            {project.summary}
                          </p>
                          <ProjectTechStack stack={project.stack} />
                        </div>
                      </div>

                      <div
                        className="h-px w-10 origin-left bg-accent/45 transition-all duration-700 ease-out group-hover:w-28 group-hover:bg-accent"
                        aria-hidden
                      />
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
