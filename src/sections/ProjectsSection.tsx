"use client";

import Image from "next/image";
import { ScrollReveal } from "@/components/reactbits/ScrollReveal";
import { useConversation } from "@/components/conversation/ConversationProvider";
import { useI18n } from "@/i18n/provider";
import { useReducedMotion } from "motion/react";

type ProjectId =
  | "panorama"
  | "vojta"
  | "laflare"
  | "sadia"
  | "dvd"
  | "doktor"
  | "golden"
  | "speed"
  | "prevezem";

type ProjectEntry = {
  id: ProjectId;
  title: string;
  year: string;
  url: string;
  image: string;
};

const projects: ProjectEntry[] = [
  {
    id: "panorama",
    title: "Panorama Žabiny",
    year: "2026",
    url: "https://panorama-sooty.vercel.app",
    image: "/projects/panorama.webp",
  },
  {
    id: "vojta",
    title: "Vojta Hubne",
    year: "2025",
    url: "https://www.vojtahubne.cz",
    image: "/projects/vojta.webp",
  },
  {
    id: "laflare",
    title: "Laflare Club",
    year: "2025",
    url: "https://laflareclub.com",
    image: "/projects/laflare.webp",
  },
  {
    id: "sadia",
    title: "Sadia",
    year: "2025",
    url: "https://www.sadiaestate.cz",
    image: "/projects/sadia.webp",
  },
  {
    id: "dvd",
    title: "DVD Culture",
    year: "2025",
    url: "https://www.dvdculture.com",
    image: "/projects/dvd.webp",
  },
  {
    id: "doktor",
    title: "Doktor Barber",
    year: "2025",
    url: "https://doktorbarber.cz",
    image: "/projects/doktor.webp",
  },
  {
    id: "golden",
    title: "Golden Touch",
    year: "2025",
    url: "https://martin-press.vercel.app",
    image: "/projects/golden.webp",
  },
  {
    id: "speed",
    title: "Speed Coffee",
    year: "2025",
    url: "https://www.speedcoffee.shop",
    image: "/projects/speed.webp",
  },
  {
    id: "prevezem",
    title: "Prevezem",
    year: "2025",
    url: "https://www.prevezem.cz",
    image: "/projects/prevezem.webp",
  },
];

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden
    >
      <path d="M4 12 12 4M6.5 4H12v5.5" />
    </svg>
  );
}

function ProjectTags({ tags }: { tags: string[] }) {
  return (
    <ul className="mt-3 flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <li
          key={tag}
          className="inline-flex h-7 items-center rounded-full border border-black/12 px-3 text-[0.68rem] tracking-[0.04em] text-foreground"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}

function MarqueeCard({
  project,
  copy,
  openLabel,
  newTab,
  viewProject,
  inert = false,
}: {
  project: ProjectEntry;
  copy: {
    category: string;
    location: string;
    summary: string;
    alt: string;
  };
  openLabel: string;
  newTab: string;
  viewProject: string;
  inert?: boolean;
}) {
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={inert ? -1 : undefined}
      aria-hidden={inert || undefined}
      className="group grid w-[min(38rem,85vw)] shrink-0 grid-cols-1 overflow-hidden rounded-[1.25rem] bg-[#f6f6f6] sm:w-[42rem] sm:grid-cols-[1.15fr_0.85fr]"
    >
      <span className="relative block aspect-[4/3] sm:aspect-auto sm:min-h-[18rem]">
        <Image
          src={project.image}
          alt={copy.alt}
          fill
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 85vw, 24rem"
        />
      </span>
      <span className="flex flex-col px-5 py-5 sm:px-6 sm:py-6">
        <span className="flex items-start justify-between gap-3">
          <span className="font-[family-name:var(--font-display)] text-[1.55rem] font-medium leading-[0.95] tracking-[-0.04em] text-foreground">
            {project.title}
          </span>
          <ArrowIcon className="mt-1 h-4 w-4 shrink-0 text-foreground/50 transition-colors group-hover:text-accent" />
        </span>
        <ProjectTags tags={[copy.category, copy.location, project.year]} />
        <span className="mt-4 text-sm leading-relaxed text-neutral-600">
          {copy.summary}
        </span>
        <span className="mt-auto pt-6 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-neutral-400 transition-colors group-hover:text-accent">
          {openLabel}
        </span>
      </span>
      <span className="sr-only">
        {viewProject}: {project.title} {newTab}
      </span>
    </a>
  );
}

export function ProjectsSection() {
  const { t } = useI18n();
  const { openConversation } = useConversation();
  const reduceMotion = useReducedMotion();
  const [featured, ...rest] = projects;
  const featuredCopy = t.projects.items[featured.id];
  const marqueeItems = reduceMotion ? rest : [...rest, ...rest];

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="site-block"
    >
      <div className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6 lg:px-10 lg:pb-12 lg:pt-24">
        <ScrollReveal>
          <header>
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.35em] text-accent">
              {t.projects.kicker}
            </p>
            <h2
              id="projects-heading"
              className="mt-5 max-w-[12ch] font-[family-name:var(--font-display)] text-[clamp(2.4rem,5.6vw,4.75rem)] font-medium leading-[0.88] tracking-[-0.055em] text-foreground"
            >
              {t.projects.heading}
            </h2>
          </header>
        </ScrollReveal>

        <ScrollReveal className="mt-10 border-t border-black/10 pt-10 lg:mt-14 lg:pt-14">
          <article>
            <a
              href={featured.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid items-stretch gap-8 md:grid-cols-[minmax(0,1.35fr)_minmax(16rem,0.9fr)] md:gap-10"
            >
              <span className="relative block min-h-[18rem] overflow-hidden rounded-[1.25rem] bg-[#ececec] md:min-h-[26rem]">
                <Image
                  src={featured.image}
                  alt={featuredCopy.alt}
                  fill
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 92vw, 55vw"
                  priority
                />
              </span>
              <span className="flex min-h-0 flex-col">
                <span className="flex items-start justify-between gap-4">
                  <h3 className="font-[family-name:var(--font-display)] text-[clamp(1.85rem,3.6vw,3.1rem)] font-medium leading-[0.92] tracking-[-0.045em] text-foreground">
                    {featured.title}
                  </h3>
                  <ArrowIcon className="mt-2 h-5 w-5 shrink-0 text-foreground/40 transition-colors group-hover:text-accent" />
                </span>
                <ProjectTags
                  tags={[
                    featuredCopy.category,
                    featuredCopy.location,
                    featured.year,
                  ]}
                />
                <p className="mt-6 text-sm leading-relaxed text-neutral-600 sm:text-[0.98rem]">
                  {featuredCopy.story}
                </p>
                {featuredCopy.quote ? (
                  <blockquote className="mt-auto pt-8">
                    <p className="font-[family-name:var(--font-display)] text-[clamp(1.05rem,1.8vw,1.35rem)] font-medium leading-[1.2] tracking-[-0.03em] text-foreground">
                      “{featuredCopy.quote}”
                    </p>
                    <footer className="mt-3 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-neutral-400">
                      — {featuredCopy.attribution}
                    </footer>
                  </blockquote>
                ) : null}
                <span className="sr-only">
                  {t.projects.viewProject}: {featured.title} {t.projects.newTab}
                </span>
              </span>
            </a>
          </article>
        </ScrollReveal>
      </div>

      <div className="border-t border-black/10 pb-16 pt-10 lg:pb-20 lg:pt-12">
        <div className="mx-auto flex max-w-[90rem] items-end justify-between gap-6 px-4 sm:px-6 lg:px-10">
          <p className="font-[family-name:var(--font-display)] text-[clamp(1.35rem,2.4vw,1.9rem)] font-medium tracking-[-0.04em] text-foreground">
            {t.projects.moreWork}
          </p>
          <button
            type="button"
            onClick={openConversation}
            className="hidden text-[0.65rem] font-medium uppercase tracking-[0.16em] text-neutral-500 transition-colors hover:text-accent sm:inline-flex"
          >
            {t.projects.requestQuote} →
          </button>
        </div>

        <div
          className={`ut-marquee mt-8 ${reduceMotion ? "overflow-x-auto" : "overflow-hidden"}`}
        >
          <ul
            className={`flex gap-4 px-4 sm:gap-5 sm:px-6 lg:px-10 ${reduceMotion ? "" : "ut-marquee-track"}`}
          >
            {marqueeItems.map((project, index) => {
              const duplicate = index >= rest.length;
              return (
                <li key={`${project.id}-${index}`}>
                  <MarqueeCard
                    project={project}
                    copy={t.projects.items[project.id]}
                    openLabel={t.projects.open}
                    newTab={t.projects.newTab}
                    viewProject={t.projects.viewProject}
                    inert={duplicate}
                  />
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-8 px-4 sm:hidden sm:px-6">
          <button
            type="button"
            onClick={openConversation}
            className="inline-flex h-12 items-center rounded-full bg-foreground px-7 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-white transition-colors hover:bg-accent"
          >
            {t.projects.requestQuote}
          </button>
        </div>
      </div>
    </section>
  );
}
