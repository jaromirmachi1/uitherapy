import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlesIndex } from "@/components/articles/ArticlesIndex";
import { MarketingShell } from "@/components/MarketingShell";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { articlesLanguageAlternates, articlesUrl } from "@/seo/urls";
import { getSiteUrl, siteName } from "@/seo/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale: Locale = raw;
  const t = getDictionary(locale);
  const canonical = articlesUrl(locale);
  const siteUrl = getSiteUrl();
  const ogLocale = locale === "cs" ? "cs_CZ" : "en_US";

  return {
    title: t.articles.seoTitle,
    description: t.articles.seoDescription,
    alternates: {
      canonical,
      languages: articlesLanguageAlternates(),
    },
    openGraph: {
      type: "website",
      locale: ogLocale,
      url: canonical,
      siteName,
      title: `${t.articles.seoTitle} — ${siteName}`,
      description: t.articles.seoDescription,
      images: [
        {
          url:
            locale === "cs"
              ? `${siteUrl}/opengraph-image`
              : `${siteUrl}/${locale}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: t.seo.ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${t.articles.seoTitle} — ${siteName}`,
      description: t.articles.seoDescription,
    },
  };
}

export default async function ArticlesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const t = getDictionary(locale);

  return (
    <MarketingShell>
      <div className="px-2.5 sm:px-6">
        <ArticlesIndex locale={locale} t={t.articles} />
      </div>
    </MarketingShell>
  );
}
