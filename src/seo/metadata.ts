import type { Metadata } from "next";
import { defaultLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { canonicalUrl, languageAlternates } from "./urls";
import { getSiteUrl, siteName } from "./site";

function googleSiteVerification(): Metadata["verification"] | undefined {
  const token = process.env.GOOGLE_SITE_VERIFICATION;
  if (!token) return undefined;
  return { google: token };
}

export function buildSiteMetadata(locale: Locale): Metadata {
  const t = getDictionary(locale);
  const canonical = canonicalUrl(locale);
  const siteUrl = getSiteUrl();
  const ogLocale = locale === "cs" ? "cs_CZ" : "en_US";
  const alternateOgLocale = locale === "cs" ? "en_US" : "cs_CZ";
  const openGraphImage =
    locale === defaultLocale
      ? `${siteUrl}/opengraph-image`
      : `${siteUrl}/${locale}/opengraph-image`;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t.seo.title,
      template: `%s — ${siteName}`,
    },
    description: t.seo.description,
    keywords: t.seo.keywords,
    applicationName: siteName,
    authors: [{ name: siteName, url: siteUrl }],
    creator: siteName,
    publisher: siteName,
    category: "technology",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: [
        { url: "/uifavicon.ico", sizes: "32x32", type: "image/x-icon" },
        { url: "/uifavicon.png", sizes: "32x32", type: "image/png" },
      ],
      shortcut: "/uifavicon.ico",
      apple: [{ url: "/uifavicon.png", sizes: "32x32", type: "image/png" }],
    },
    alternates: {
      canonical,
      languages: languageAlternates(),
    },
    openGraph: {
      type: "website",
      locale: ogLocale,
      alternateLocale: [alternateOgLocale],
      url: canonical,
      siteName,
      title: t.seo.title,
      description: t.seo.description,
      images: [
        {
          url: openGraphImage,
          width: 1200,
          height: 630,
          alt: t.seo.ogImageAlt,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t.seo.title,
      description: t.seo.description,
      images: [openGraphImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: googleSiteVerification(),
  };
}
