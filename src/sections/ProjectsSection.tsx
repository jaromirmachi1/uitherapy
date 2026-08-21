"use client";

import Image from "next/image";
import { SpotlightCard } from "@/components/reactbits/SpotlightCard";
import { useI18n } from "@/i18n/provider";

type ProjectEntry = {
  id: "panorama" | "golden" | "dvd";
  title: string;
  year: string;
  tags: readonly string[];
  url: string;
  linkLabel: string;
  image: string;
};

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const projects: ProjectEntry[] = [
  {
    id: "panorama",
    title: "Panorama Žabiny",
    year: "2026",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    url: "https://www.panoramazabiny.cz",
    linkLabel: "panoramazabiny.cz",
    image: "/panoramaph.webp",
  },
  {
    id: "golden",
    title: "Golden Touch",
    year: "2025",
    tags: ["Next.js", "Tailwind CSS", "Motion"],
    url: "https://www.goldentouchova.cz",
    linkLabel: "goldentouchova.cz",
    image: "/barbermartini.webp",
  },
  {
    id: "dvd",
    title: "DVD Culture",
    year: "2025",
    tags: ["Next.js", "React", "Three.js", "GSAP", "Tailwind CSS"],
    url: "https://www.dvdculture.com",
    linkLabel: "dvdculture.com",
    image: "/dvdculture.webp",
  },
];

export function ProjectsSection() {
  const { t } = useI18n();
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="site-block relative overflow-hidden"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_0%,rgba(255,255,255,0.9)_0%,rgba(244,240,232,0.72)_58%,rgba(238,231,220,0.9)_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-multiply"
        aria-hidden
        style={{
          backgroundImage: NOISE,
          backgroundSize: "96px 96px",
        }}
      />
      <div
        className="pointer-events-none absolute -left-[12%] top-[18%] font-[family-name:var(--font-display)] text-[clamp(7rem,24vw,20rem)] font-bold leading-none tracking-[-0.06em] text-black/[0.035]"
        aria-hidden
      >
        0
      </div>

      <div className="relative mx-auto max-w-[100rem] px-4 py-24 sm:px-6 lg:px-12 lg:py-36">
        <header className="grid gap-14 lg:mb-28 lg:grid-cols-12 lg:gap-8 lg:items-end">
          <div className="lg:col-span-8">
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.38em] text-accent">
              {t.projects.kicker}
            </p>
            <h2
              id="projects-heading"
              data-gsap="reveal"
              className="mt-5 font-[family-name:var(--font-display)] text-[clamp(3.25rem,11vw,8rem)] font-bold leading-[0.92] tracking-[-0.045em] text-foreground"
            >
              <span className="block">{t.projects.heading}</span>
              <span
                className="mt-3 block max-w-xl font-mono text-[clamp(0.7rem,1.8vw,0.85rem)] font-medium normal-case tracking-[0.35em] text-neutral-500"
                aria-hidden
              >
                01 — {String(projects.length).padStart(2, "0")}
              </span>
            </h2>
            <p className="mt-8 max-w-md border-l border-accent/35 pl-6 text-sm leading-relaxed text-neutral-600 sm:text-base">
              {t.projects.intro}
            </p>
          </div>
          <div className="hidden lg:col-span-4 lg:flex lg:justify-end lg:pb-2">
            <p className="max-h-[11rem] text-[0.6rem] font-medium uppercase leading-loose tracking-[0.42em] text-neutral-500 [writing-mode:vertical-rl]">
              {t.projects.spine}
            </p>
          </div>
        </header>

        <div className="flex flex-col">
          {projects.map((project, index) => {
            const n = String(index + 1).padStart(2, "0");
            const reversed = index % 2 === 1;
            const copy = t.projects.items[project.id];

            return (
              <div key={project.title} className="relative">
                {index > 0 ? (
                  <div
                    className="mx-auto mb-2 h-px max-w-3xl bg-gradient-to-r from-transparent via-black/12 to-transparent sm:mb-0"
                    aria-hidden
                  />
                ) : null}
                <SpotlightCard spotlightHex="1F5EFF" className="group">
                  <article
                    className={`relative flex flex-col overflow-hidden rounded-[1.75rem] border border-black/10 bg-white/62 shadow-[0_26px_88px_rgba(23,21,16,0.08)] backdrop-blur-xl transition-[border-color,box-shadow] duration-300 ease-out hover:border-accent/35 hover:shadow-[0_32px_110px_rgba(31,94,255,0.12)] lg:min-h-[min(82vh,840px)] lg:flex-row lg:items-stretch ${
                      reversed ? "lg:flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`relative min-h-[24rem] flex-1 overflow-hidden bg-[#ded6c9] lg:w-[56%] ${
                        reversed
                          ? "rounded-[1.75rem] rounded-br-[3rem] rounded-tl-[2.75rem] lg:rounded-none lg:rounded-br-[2.5rem] lg:rounded-tl-[2rem]"
                          : "rounded-[1.75rem] rounded-bl-[3rem] rounded-tr-[2.75rem] lg:rounded-none lg:rounded-bl-[2.5rem] lg:rounded-tr-[2rem]"
                      }`}
                    >
                      <div
                        className="pointer-events-none absolute inset-0 z-[2] opacity-[0.08] mix-blend-multiply"
                        style={{
                          backgroundImage: NOISE,
                          backgroundSize: "88px 88px",
                        }}
                        aria-hidden
                      />
                      <Image
                        src={project.image}
                        alt={copy.alt}
                        fill
                        className="object-cover will-change-auto"
                        sizes="(max-width: 1024px) 100vw, 56vw"
                        priority={index === 0}
                      />
                      <div
                        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/28 via-black/0 to-white/10"
                        aria-hidden
                      />
                      <div className="pointer-events-none absolute left-5 top-5 z-[3] max-w-[min(100%,20rem)] sm:left-7 sm:top-7">
                        <span className="inline-block rounded-full border border-white/50 bg-white/64 px-3 py-1.5 font-mono text-[0.6rem] leading-snug tracking-[0.12em] text-foreground backdrop-blur-md">
                          {copy.category}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`flex flex-1 flex-col gap-8 border-t border-black/10 px-5 py-12 sm:gap-9 sm:px-7 sm:py-16 lg:w-[44%] lg:border-t-0 lg:border-black/10 lg:py-10 ${
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
                        <h3 className="font-[family-name:var(--font-display)] text-[clamp(1.85rem,4.8vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.035em] text-foreground lg:max-w-[20ch]">
                          {project.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-neutral-500 sm:text-[0.9375rem]">
                          {copy.subcategory}
                        </p>
                        <p className="max-w-lg text-sm leading-[1.75] text-neutral-600 sm:text-base">
                          {copy.story}
                        </p>
                        <figure className="max-w-lg border-l border-accent/45 pl-6">
                          <blockquote className="text-sm italic leading-relaxed text-foreground sm:text-base">
                            <p>&ldquo;{copy.quote}&rdquo;</p>
                          </blockquote>
                          <figcaption className="mt-4 font-mono text-[0.65rem] leading-relaxed tracking-[0.06em] text-neutral-500">
                            {copy.attribution}
                          </figcaption>
                        </figure>
                      </div>

                      <div className="flex flex-col gap-6 border-t border-black/10 pt-8 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-x-6 sm:gap-y-4">
                        <ul
                          className="flex flex-wrap gap-2"
                          aria-label={t.projects.techLabel}
                        >
                          {project.tags.map((tag) => (
                            <li key={tag}>
                              <span className="inline-block rounded-full border border-black/10 bg-white/60 px-2.5 py-1 font-mono text-[0.65rem] tracking-wide text-neutral-600">
                                {tag}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-accent/45 bg-accent/10 px-4 py-2 font-mono text-[0.75rem] font-medium tracking-[0.14em] text-accent transition-colors hover:border-accent hover:bg-accent hover:text-white"
                        >
                          {project.linkLabel}
                          <span aria-hidden className="text-base leading-none">
                            →
                          </span>
                          <span className="sr-only">{t.projects.newTab}</span>
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
