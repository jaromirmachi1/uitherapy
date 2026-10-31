import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingShell } from "@/components/MarketingShell";
import { PricingPage } from "@/components/pricing/PricingPage";
import { pricingCopy } from "@/content/pricing";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { pricingLanguageAlternates, pricingUrl } from "@/seo/urls";
import { getSiteUrl, siteName } from "@/seo/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale: Locale = raw;
  const c = pricingCopy[locale];
  const t = getDictionary(locale);
  const canonical = pricingUrl(locale);
  const siteUrl = getSiteUrl();
  const image =
    locale === "cs"
      ? `${siteUrl}/opengraph-image`
      : `${siteUrl}/${locale}/opengraph-image`;

  return {
    title: c.seoTitle,
    description: c.seoDescription,
    alternates: { canonical, languages: pricingLanguageAlternates() },
    openGraph: {
      type: "website",
      locale: locale === "cs" ? "cs_CZ" : "en_US",
      url: canonical,
      siteName,
      title: `${c.seoTitle} — ${siteName}`,
      description: c.seoDescription,
      images: [{ url: image, width: 1200, height: 630, alt: t.seo.ogImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${c.seoTitle} — ${siteName}`,
      description: c.seoDescription,
    },
  };
}

export default async function Pricing({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();

  return (
    <MarketingShell>
      <div className="flex flex-col gap-3 px-2.5 sm:gap-6 sm:px-6">
        <PricingPage />
      </div>
    </MarketingShell>
  );
}
