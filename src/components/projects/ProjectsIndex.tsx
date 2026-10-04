"use client";

import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { ScrollReveal } from "@/components/reactbits/ScrollReveal";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import {
  orderedProjects,
  serviceKeys,
  type ServiceKey,
} from "@/content/projects";
import { useI18n } from "@/i18n/provider";

type Filter = "all" | ServiceKey;

export function ProjectsIndex() {
  const { t } = useI18n();
  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(() => {
    const map = { all: orderedProjects.length } as Record<Filter, number>;
    for (const key of serviceKeys) {
      map[key] = orderedProjects.filter((p) => p.services.includes(key)).length;
    }
    return map;
  }, []);

  const filters: Filter[] = [
    "all",
    ...serviceKeys.filter((key) => counts[key] > 0),
  ];
  const items =
    filter === "all"
      ? orderedProjects
      : orderedProjects.filter((p) => p.services.includes(filter));

  return (
    <section aria-labelledby="projects-page-heading" className="site-block">
      <div className="mx-auto max-w-[90rem] px-2.5 pb-2.5 pt-28 sm:px-4 sm:pb-4 sm:pt-36 lg:pt-40">
        <ScrollReveal>
          <header className="grid gap-6 px-2 sm:px-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:items-end lg:px-6">
            <div>
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.35em] text-accent">
                {t.projects.kicker}
              </p>
              <h1
                id="projects-page-heading"
                className="mt-4 font-[family-name:var(--font-display)] text-[clamp(2.6rem,7vw,5.5rem)] font-medium leading-[0.88] tracking-[-0.055em] text-foreground"
              >
                {t.projects.pageTitle}
              </h1>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-neutral-600 sm:text-base">
              {t.projects.pageIntro}
            </p>
          </header>
        </ScrollReveal>

        <nav
          aria-label={t.projects.filterLabel}
          className="mt-10 flex flex-wrap gap-x-1 gap-y-2 border-t border-black/10 px-2 pb-6 pt-6 sm:px-4 lg:mt-14 lg:px-6"
        >
          {filters.map((key) => {
            const active = key === filter;
            const label =
              key === "all" ? t.projects.filterAll : t.projects.services[key];
            return (
              <button
                key={key}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(key)}
                className={`relative inline-flex h-9 items-center rounded-md px-3 font-[family-name:var(--font-display)] text-[1.05rem] font-medium tracking-[-0.03em] transition-colors duration-300 ${
                  active
                    ? "text-white"
                    : "text-foreground/55 hover:text-foreground"
                }`}
              >
                {active ? (
                  <motion.span
                    layoutId="projects-filter-pill"
                    className="absolute inset-0 rounded-md bg-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    aria-hidden
                  />
                ) : null}
                <span className="relative inline-block first-letter:uppercase">{label}</span>
                <sup className="relative -top-[0.55em] ml-1 align-baseline font-sans text-[0.6rem] font-medium tabular-nums opacity-70">
                  {counts[key]}
                </sup>
              </button>
            );
          })}
        </nav>

        {items.length > 0 ? (
          <ProjectGrid key={filter} items={items} withCta />
        ) : (
          <p className="px-6 py-20 text-center text-neutral-500">
            {t.projects.empty}
          </p>
        )}
      </div>
    </section>
  );
}
