import Link from "next/link";
import { getArticles, type Article } from "@/content/articles";
import { articlesPath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionary";

type LocalizedArticle = Article & {
  slug: string;
  local: Article["copy"][Locale];
};

type Props = {
  locale: Locale;
  article: LocalizedArticle;
  t: Dictionary["articles"];
};

export function ArticleArticle({ locale, article, t }: Props) {
  const all = getArticles(locale);
  const index = all.findIndex((entry) => entry.id === article.id);
  const next = index >= 0 ? all[(index + 1) % all.length] : null;
  const showNext = next && next.id !== article.id;

  return (
    <article className="site-block">
      <div className="mx-auto max-w-[48rem] px-4 pb-20 pt-28 sm:px-6 lg:px-10 lg:pb-28 lg:pt-36">
        <Link
          href={articlesPath(locale)}
          className="inline-flex text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-neutral-500 transition-colors hover:text-accent"
        >
          ← {t.back}
        </Link>

        <header className="mt-10 border-b border-foreground/10 pb-10">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-neutral-500">
            <time dateTime={article.publishedAt}>{article.local.dateLabel}</time>
            <span aria-hidden>·</span>
            <span>{article.local.category}</span>
          </div>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-[clamp(2.1rem,5.5vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.035em] text-foreground text-pretty">
            {article.local.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600">
            {article.local.excerpt}
          </p>
          <p className="mt-8 text-sm text-neutral-600">
            <span className="font-medium text-foreground">{article.local.author}</span>
            <span className="mx-2 text-neutral-400">·</span>
            {article.local.authorRole}
          </p>
        </header>

        <div className="mt-12 space-y-12">
          {article.local.sections.map((section, sectionIndex) => (
            <section key={section.heading ?? sectionIndex}>
              {section.heading ? (
                <h2 className="font-[family-name:var(--font-display)] text-[1.45rem] font-semibold tracking-[-0.02em] text-foreground sm:text-[1.7rem]">
                  {section.heading}
                </h2>
              ) : null}
              <div className={section.heading ? "mt-5 space-y-5" : "space-y-5"}>
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 48)}
                    className="text-[1.05rem] leading-[1.75] text-neutral-700"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {showNext ? (
          <footer className="mt-16 border-t border-foreground/10 pt-10">
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-neutral-500">
              {t.next}
            </p>
            <Link
              href={articlesPath(locale, next.slug)}
              className="group mt-3 inline-flex max-w-full items-baseline gap-2 font-[family-name:var(--font-display)] text-xl font-semibold tracking-[-0.02em] text-foreground transition-colors hover:text-accent sm:text-2xl"
            >
              <span className="text-pretty">{next.local.title}</span>
              <span
                aria-hidden
                className="shrink-0 transition-transform group-hover:translate-x-0.5"
              >
                ›
              </span>
            </Link>
          </footer>
        ) : null}
      </div>
    </article>
  );
}
