import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingShell } from "@/components/MarketingShell";
import { RedesignPage } from "@/components/redesign/RedesignPage";
import { redesignFrom } from "@/content/pricing";
import { redesignCopy, withPrices } from "@/content/redesign";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { redesignLanguageAlternates, redesignUrl } from "@/seo/urls";
import { getSiteUrl, siteName } from "@/seo/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale: Locale = raw;
  const c = redesignCopy[locale];
  const t = getDictionary(locale);
  const canonical = redesignUrl(locale);
  const siteUrl = getSiteUrl();
  const title = withPrices(c.seoTitle, locale);
  const description = withPrices(c.seoDescription, locale);
  const image =
    locale === "cs" ? `${siteUrl}/opengraph-image` : `${siteUrl}/${locale}/opengraph-image`;

  return {
    // Absolute: the keyword-first title shouldn't get the site suffix twice.
    title: { absolute: `${title} | ${siteName}` },
    description,
    alternates: { canonical, languages: redesignLanguageAlternates() },
    openGraph: {
      type: "website",
      locale: locale === "cs" ? "cs_CZ" : "en_US",
      url: canonical,
      siteName,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: t.seo.ogImageAlt }],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function Redesign({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const c = redesignCopy[locale];
  const siteUrl = getSiteUrl();
  const url = redesignUrl(locale);

  // Service + FAQ structured data, so Google can show prices and answers.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: c.kicker,
        serviceType: c.kicker,
        description: withPrices(c.seoDescription, locale),
        url,
        provider: { "@id": `${siteUrl}/#organization` },
        areaServed: { "@type": "Country", name: "Czech Republic" },
        offers: {
          "@type": "Offer",
          priceCurrency: "CZK",
          priceSpecification: {
            "@type": "PriceSpecification",
            minPrice: redesignFrom,
            priceCurrency: "CZK",
          },
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: c.faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: withPrices(item.a, locale) },
        })),
      },
    ],
  };

  return (
    <MarketingShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col gap-3 px-2.5 sm:gap-6 sm:px-6">
        <RedesignPage />
      </div>
    </MarketingShell>
  );
}
