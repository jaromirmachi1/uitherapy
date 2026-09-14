"use client";

import Link from "next/link";
import { ScrollReveal } from "@/components/reactbits/ScrollReveal";
import { getFeaturedArticles } from "@/content/articles";
import { articlesPath } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";

export function ArticlesSection() {
  const { locale, t } = useI18n();
  const items = getFeaturedArticles(locale, 3);

  return (
    <section
      id="articles"
      aria-labelledby="articles-heading"
      className="site-block"
    >
      <div className="mx-auto max-w-[90rem] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <ScrollReveal>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16 lg:items-end">
            <div>
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.35em] text-accent">
                {t.articles.kicker}
              </p>
              <h2
                id="articles-heading"
                className="mt-6 max-w-xl font-[family-name:var(--font-display)] text-[clamp(2.25rem,5.5vw,4rem)] font-bold leading-[1.05] tracking-[-0.04em] text-foreground"
              >
                {t.articles.heading}
              </h2>
              <p className="mt-6 max-w-md text-neutral-600">{t.articles.body}</p>
              <Link
                href={articlesPath(locale)}
                className="mt-10 inline-flex h-11 items-center rounded-md border border-foreground/85 px-5 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-foreground transition-colors hover:bg-foreground hover:text-white active:scale-[0.97]"
              >
                {t.articles.viewAll}
              </Link>
            </div>

            <ul className="divide-y divide-foreground/10 border-y border-foreground/10">
              {items.map((article) => (
                <li key={article.id}>
                  <Link
                    href={articlesPath(locale, article.slug)}
                    className="group flex flex-col gap-3 py-6 transition-colors sm:flex-row sm:items-baseline sm:justify-between sm:gap-8 sm:py-7"
                  >
                    <div className="min-w-0">
                      <p className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-neutral-500 tabular-nums">
                        {article.local.dateLabel}
                      </p>
                      <h3 className="mt-2 font-[family-name:var(--font-display)] text-[1.15rem] font-semibold leading-snug tracking-[-0.02em] text-foreground transition-colors group-hover:text-accent sm:text-[1.35rem]">
                        {article.local.title}
                      </h3>
                    </div>
                    <span className="shrink-0 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-neutral-500 transition-colors group-hover:text-accent">
                      {article.local.category}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
