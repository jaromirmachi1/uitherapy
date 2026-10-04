"use client";

import Link from "next/link";
import { Magnetic } from "@/components/Magnetic";
import { ScrollReveal } from "@/components/reactbits/ScrollReveal";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { featuredProjects } from "@/content/projects";
import { projectsPath } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";

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

export function ProjectsSection() {
  const { locale, t } = useI18n();

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="site-block"
    >
      <div className="mx-auto max-w-[90rem] px-2.5 pb-2.5 pt-14 sm:px-4 sm:pb-4 lg:pt-20">
        <ScrollReveal>
          <header className="flex items-end justify-between gap-6 px-2 pb-8 sm:px-4 lg:px-6 lg:pb-10">
            <div>
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.35em] text-accent">
                {t.projects.kicker}
              </p>
              <h2
                id="projects-heading"
                className="mt-4 font-[family-name:var(--font-display)] text-[clamp(2.1rem,4.6vw,3.9rem)] font-medium leading-[0.9] tracking-[-0.05em] text-foreground"
              >
                {t.projects.featuredHeading}
              </h2>
            </div>
            <Link
              href={projectsPath(locale)}
              className="group hidden shrink-0 items-center gap-2 pb-1 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-foreground transition-colors hover:text-accent sm:inline-flex"
            >
              {t.projects.allProjects}
              <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px" />
            </Link>
          </header>
        </ScrollReveal>

        <ProjectGrid items={featuredProjects} />

        <div className="flex justify-center px-2 py-10 lg:py-14">
          <Magnetic strength={0.3}>
          <Link
            href={projectsPath(locale)}
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-foreground pl-6 pr-1.5 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-white transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-accent active:scale-[0.97]"
          >
            {t.projects.exploreMore}
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/12 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px">
              <ArrowIcon className="h-3.5 w-3.5" />
            </span>
          </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
