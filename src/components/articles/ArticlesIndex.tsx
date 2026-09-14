import Link from "next/link";
import { getArticles } from "@/content/articles";
import { articlesPath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionary";

type Props = {
  locale: Locale;
  t: Dictionary["articles"];
};

export function ArticlesIndex({ locale, t }: Props) {
  const items = getArticles(locale);

  return (
    <section
      aria-labelledby="articles-page-heading"
      className="site-block"
    >
      <div className="mx-auto max-w-[90rem] px-4 pb-20 pt-28 sm:px-6 lg:px-10 lg:pb-28 lg:pt-36">
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.35em] text-accent">
          {t.kicker}
        </p>
        <h1
          id="articles-page-heading"
          className="mt-6 max-w-3xl font-[family-name:var(--font-display)] text-[clamp(2.75rem,8vw,5.5rem)] font-bold leading-[0.98] tracking-[-0.04em] text-foreground"
        >
          {t.pageTitle}
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-neutral-600">
          {t.pageDescription}
        </p>

        <ul className="mt-16 divide-y divide-foreground/10 border-y border-foreground/10 sm:mt-20">
          {items.map((article) => (
            <li key={article.id}>
              <Link
                href={articlesPath(locale, article.slug)}
                className="group grid gap-4 py-8 transition-colors sm:grid-cols-[7.5rem_minmax(0,1fr)_auto] sm:items-baseline sm:gap-8 sm:py-10"
              >
                <time
                  dateTime={article.publishedAt}
                  className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-neutral-500 tabular-nums"
                >
                  {article.local.dateLabel}
                </time>
                <div className="min-w-0">
                  <h2 className="font-[family-name:var(--font-display)] text-[1.35rem] font-semibold leading-snug tracking-[-0.02em] text-foreground transition-colors group-hover:text-accent sm:text-[1.65rem]">
                    {article.local.title}
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-600 sm:text-base">
                    {article.local.excerpt}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 sm:justify-end">
                  <span className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-neutral-500">
                    {article.local.category}
                  </span>
                  <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground transition-colors group-hover:text-accent">
                    {t.read}
                    <span aria-hidden className="ml-1.5 inline-block transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
