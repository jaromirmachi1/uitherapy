import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleArticle } from "@/components/articles/ArticleArticle";
import { MarketingShell } from "@/components/MarketingShell";
import {
  getArticleBySlug,
  getArticleSlugs,
} from "@/content/articles";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { articlesLanguageAlternates, articlesUrl } from "@/seo/urls";
import { getSiteUrl, siteName } from "@/seo/site";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getArticleSlugs(locale).map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) return {};
  const locale: Locale = raw;
  const article = getArticleBySlug(locale, slug);
  if (!article) return {};

  const canonical = articlesUrl(locale, article.slug);
  const siteUrl = getSiteUrl();
  const ogLocale = locale === "cs" ? "cs_CZ" : "en_US";

  return {
    title: article.local.title,
    description: article.local.excerpt,
    alternates: {
      canonical,
      languages: articlesLanguageAlternates(article.slugs),
    },
    openGraph: {
      type: "article",
      locale: ogLocale,
      url: canonical,
      siteName,
      title: article.local.title,
      description: article.local.excerpt,
      publishedTime: article.publishedAt,
      images: [
        {
          url:
            locale === "cs"
              ? `${siteUrl}/opengraph-image`
              : `${siteUrl}/${locale}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: article.local.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.local.title,
      description: article.local.excerpt,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const article = getArticleBySlug(locale, slug);
  if (!article) notFound();
  const t = getDictionary(locale);

  return (
    <MarketingShell>
      <div className="px-2.5 sm:px-6">
        <ArticleArticle locale={locale} article={article} t={t.articles} />
      </div>
    </MarketingShell>
  );
}
