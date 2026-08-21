"use client";

import Image from "next/image";
import { ScrollReveal } from "@/components/reactbits/ScrollReveal";
import { useConversation } from "@/components/conversation/ConversationProvider";
import { useI18n } from "@/i18n/provider";

type ProjectEntry = {
  id: "panorama" | "golden" | "dvd";
  title: string;
  year: string;
  url: string;
  image: string;
  rotate: string;
  position: string;
};

const projects: ProjectEntry[] = [
  {
    id: "panorama",
    title: "Panorama Žabiny",
    year: "2026",
    url: "https://www.panoramazabiny.cz",
    image: "/panoramaph.webp",
    rotate: "-rotate-[16deg]",
    position:
      "right-[36%] top-[28%] w-[42%] max-w-[20rem] sm:right-[34%] sm:top-[22%]",
  },
  {
    id: "golden",
    title: "Golden Touch",
    year: "2025",
    url: "https://www.goldentouchova.cz",
    image: "/barbermartini.webp",
    rotate: "-rotate-[3deg]",
    position:
      "right-[16%] top-[18%] w-[44%] max-w-[21rem] sm:right-[14%] sm:top-[14%]",
  },
  {
    id: "dvd",
    title: "DVD Culture",
    year: "2025",
    url: "https://www.dvdculture.com",
    image: "/dvdculture.webp",
    rotate: "rotate-[11deg]",
    position:
      "right-[-2%] top-[34%] w-[46%] max-w-[22rem] sm:right-[-1%] sm:top-[30%]",
  },
];

function ExternalIcon() {
  return (
    <svg
      viewBox="0 0 13 13"
      className="h-3.5 w-3.5"
      fill="currentColor"
      aria-hidden
    >
      <path d="M6.4 11.7q-1.1 1.1-2.65 1.1A3.62 3.62 0 0 1 1.1 11.7 3.6 3.6 0 0 1 0 9.06q0-1.55 1.1-2.65l1.59-1.59a.73.73 0 0 1 1.06 0q.23.23.23.53 0 .31-.23.53L2.16 7.47a2.17 2.17 0 0 0-.66 1.59q0 .93.66 1.59a2.17 2.17 0 0 0 1.59.66q.93 0 1.59-.66l1.59-1.59a.73.73 0 0 1 1.06 0q.23.23.23.53 0 .31-.23.53zm-1.06-3.18a.73.73 0 0 1-1.06 0 .73.73 0 0 1 0-1.06l3.18-3.18a.73.73 0 0 1 1.06 0 .73.73 0 0 1 0 1.06zM10.11 8a.73.73 0 0 1-1.06 0 .73.73 0 0 1 0-1.06l1.59-1.59a2.17 2.17 0 0 0 .66-1.59 2.17 2.17 0 0 0-.66-1.59 2.17 2.17 0 0 0-1.59-.66 2.17 2.17 0 0 0-1.59.66L5.87 3.75a.73.73 0 0 1-1.06 0 .73.73 0 0 1 0-1.06L6.4 1.1A3.62 3.62 0 0 1 9.06 0q1.55 0 2.65 1.1A3.62 3.62 0 0 1 12.81 3.75a3.6 3.6 0 0 1-1.1 2.65z" />
    </svg>
  );
}

export function ProjectsSection() {
  const { t } = useI18n();
  const { openConversation } = useConversation();
  const featured = t.projects.items.golden;

  return (
    <section id="projects" aria-labelledby="projects-heading" className="relative">
      <div className="flex flex-wrap gap-4">
        <ScrollReveal className="w-full lg:w-[calc(58.333%-0.5rem)]">
          <div className="relative h-full min-h-[66svh] overflow-hidden rounded-[1.5rem] bg-[#ffffff] lg:min-h-[min(72svh,38rem)]">
            <h2
              id="projects-heading"
              className="pointer-events-none absolute left-6 top-6 z-10 max-w-[4.4em] font-[family-name:var(--font-display)] text-[clamp(2.4rem,5.6vw,4.75rem)] font-medium leading-[0.86] tracking-[-0.05em] text-foreground sm:left-8 sm:top-8"
            >
              {t.projects.heading}
            </h2>

            <div className="absolute inset-0">
              {projects.map((project, index) => {
                const copy = t.projects.items[project.id];
                return (
                  <a
                    key={project.id}
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`absolute overflow-hidden rounded-2xl bg-white p-1.5 shadow-[0_22px_70px_rgba(23,21,16,0.14)] transition-transform duration-500 ease-out hover:-translate-y-1.5 ${project.position} ${project.rotate}`}
                    style={{ zIndex: index + 1 }}
                  >
                    <span className="relative block aspect-[4/5] overflow-hidden rounded-[0.9rem] bg-[#ececec]">
                      <Image
                        src={project.image}
                        alt={copy.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 46vw, 22rem"
                        priority={index === 0}
                      />
                    </span>
                    <span className="sr-only">
                      {project.title} {t.projects.newTab}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal className="w-full lg:w-[calc(41.667%-0.5rem)]" delay={0.08}>
          <blockquote className="relative flex h-full min-h-[22rem] flex-col justify-center overflow-hidden rounded-[1.5rem] bg-foreground px-8 py-16 text-[#fafafa] sm:px-12 lg:min-h-[min(72svh,38rem)] lg:px-[11%]">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.22]"
              aria-hidden
              style={{
                backgroundImage:
                  "radial-gradient(rgba(250,250,250,0.55) 0.7px, transparent 0.8px)",
                backgroundSize: "14px 14px",
              }}
            />
            <div
              className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-accent/35 blur-3xl"
              aria-hidden
            />
            <p className="relative font-[family-name:var(--font-display)] text-[clamp(1.85rem,4.2vw,3.4rem)] font-medium leading-[0.92] tracking-[-0.04em]">
              <span
                className="absolute -left-3 -top-3 text-[1.15em] leading-none text-white/70 sm:-left-5"
                aria-hidden
              >
                “
              </span>
              {featured.quote}
            </p>
            <footer className="relative mt-8 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-white/55">
              — {featured.attribution}
            </footer>
          </blockquote>
        </ScrollReveal>

        <ScrollReveal className="w-full xl:w-[calc(80%-0.5rem)]" delay={0.04}>
          <div className="flex flex-col gap-6 rounded-[1.5rem] bg-[#ffffff] p-5 sm:p-6 lg:flex-row lg:items-stretch lg:gap-8 lg:p-8">
            <div className="flex shrink-0 flex-col justify-between gap-5 lg:max-w-[13.5rem]">
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-[1.45rem] font-medium leading-none tracking-[-0.04em] text-foreground">
                  {t.projects.latestHeading}
                </h3>
                <p className="mt-3 max-w-[16rem] text-sm leading-relaxed text-neutral-500">
                  {t.projects.latestBody}
                </p>
              </div>
              <button
                type="button"
                onClick={openConversation}
                className="hidden h-9 w-fit items-center rounded-md bg-foreground px-3.5 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-accent sm:inline-flex"
              >
                {t.projects.requestQuote}
              </button>
            </div>

            <ul className="grid flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => {
                const copy = t.projects.items[project.id];
                return (
                  <li
                    key={project.id}
                    className="flex min-h-[8.5rem] flex-col justify-between rounded-2xl bg-white p-3.5 sm:p-4"
                  >
                    <p className="px-1 text-[0.9375rem] leading-snug text-foreground">
                      {copy.summary}
                    </p>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-1.5">
                        <span className="inline-flex h-6 items-center rounded-full bg-[#f1f1f1] px-2.5 text-[0.72rem] tracking-[0.03em] text-foreground">
                          {copy.location}
                        </span>
                        <span className="inline-flex h-6 items-center rounded-full bg-[#f1f1f1] px-2.5 text-[0.72rem] tracking-[0.03em] text-foreground">
                          {project.year}
                        </span>
                      </div>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-400 transition-colors hover:text-foreground"
                      >
                        <ExternalIcon />
                        <span className="sr-only">
                          {t.projects.viewProject}: {project.title}{" "}
                          {t.projects.newTab}
                        </span>
                      </a>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </ScrollReveal>

        <ScrollReveal className="hidden min-h-[10rem] xl:block xl:w-[calc(20%-0.5rem)]" delay={0.1}>
          <a
            href={projects[0].url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative block h-full min-h-[10rem] overflow-hidden rounded-[1.5rem]"
          >
            <Image
              src={projects[0].image}
              alt={t.projects.items.panorama.alt}
              fill
              className="object-cover"
              sizes="20vw"
            />
            <span className="sr-only">
              {t.projects.viewProject}: {projects[0].title} {t.projects.newTab}
            </span>
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
