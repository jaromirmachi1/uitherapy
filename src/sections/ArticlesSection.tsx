"use client";

import Link from "next/link";
import { ScrollReveal } from "@/components/reactbits/ScrollReveal";
import { getFeaturedArticles } from "@/content/articles";
import { articlesPath } from "@/i18n/config";
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

export function ArticlesSection() {
  const { locale, t } = useI18n();
  const items = getFeaturedArticles(locale, 3);

  return (
    <section
      id="articles"
      aria-labelledby="articles-heading"
      className="site-block"
    >
      <div className="mx-auto max-w-[90rem] px-4 py-14 sm:px-8 lg:px-10 lg:py-20">
        <ScrollReveal>
          <header className="flex items-end justify-between gap-6">
            <div>
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.35em] text-accent">
                {t.articles.kicker}
              </p>
              <h2
                id="articles-heading"
                className="mt-4 font-[family-name:var(--font-display)] text-[clamp(2.1rem,4.6vw,3.9rem)] font-medium leading-[0.9] tracking-[-0.05em] text-foreground"
              >
                {t.articles.heading}
              </h2>
            </div>
            <Link
              href={articlesPath(locale)}
              className="group inline-flex shrink-0 items-center gap-2 pb-1 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-foreground transition-colors hover:text-accent"
            >
              {t.articles.viewAll}
              <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px" />
            </Link>
          </header>
        </ScrollReveal>

        <ul className="mt-12 grid gap-x-8 gap-y-2 md:grid-cols-3 lg:mt-16">
          {items.map((article, index) => (
            <li key={article.id}>
              <ScrollReveal blur={0} y={20} delay={index * 0.06}>
                <Link
                  href={articlesPath(locale, article.slug)}
                  className="group flex h-full flex-col border-t border-foreground/15 pb-6 pt-5"
                >
                  <span className="flex items-center justify-between gap-4 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-neutral-500">
                    <span className="tabular-nums">
                      {article.local.dateLabel}
                    </span>
                    <span>{article.local.category}</span>
                  </span>
                  <span className="mt-4 font-[family-name:var(--font-display)] text-[1.3rem] font-medium leading-[1.12] tracking-[-0.03em] text-foreground transition-colors group-hover:text-accent sm:text-[1.45rem]">
                    {article.local.title}
                  </span>
                  <span className="mt-6 inline-flex items-center gap-2 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-neutral-500 transition-colors group-hover:text-accent">
                    {t.articles.read}
                    <ArrowIcon className="h-3 w-3" />
                  </span>
                </Link>
              </ScrollReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
