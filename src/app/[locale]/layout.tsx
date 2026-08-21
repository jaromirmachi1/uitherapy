import type { Metadata, Viewport } from "next";
import { DM_Sans, Syne } from "next/font/google";
import { notFound } from "next/navigation";
import { ConversationModal } from "@/components/conversation/ConversationModal";
import { ConversationProvider } from "@/components/conversation/ConversationProvider";
import { GsapProvider } from "@/components/providers/GsapProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { I18nProvider } from "@/i18n/provider";
import { JsonLdProfessionalService, JsonLdWebsite } from "@/seo/jsonld";
import { getSiteUrl, siteName } from "@/seo/site";
import "../globals.css";

const display = Syne({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
});

const sans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

const siteUrl = getSiteUrl();

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw;
  const t = getDictionary(locale);
  const canonical = locale === "en" ? siteUrl : `${siteUrl}/cs`;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t.seo.title,
      template: `%s — ${siteName}`,
    },
    description: t.seo.description,
    applicationName: siteName,
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
      languages: {
        en: siteUrl,
        cs: `${siteUrl}/cs`,
        "x-default": siteUrl,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "cs" ? "cs_CZ" : "en_US",
      alternateLocale: locale === "cs" ? "en_US" : "cs_CZ",
      url: canonical,
      siteName,
      title: `${siteName} — ${t.seo.tagline}`,
      description: t.seo.description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteName} — ${t.seo.tagline}`,
      description: t.seo.description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dictionary = getDictionary(locale);

  return (
    <html lang={locale === "cs" ? "cs" : "en"}>
      <body
        className={`${display.variable} ${sans.variable} font-sans antialiased`}
      >
        <JsonLdWebsite description={dictionary.seo.description} />
        <JsonLdProfessionalService description={dictionary.seo.description} />
        <I18nProvider locale={locale} dictionary={dictionary}>
          <ConversationProvider>
            <SmoothScrollProvider>
              <GsapProvider />
              {children}
              <ConversationModal />
            </SmoothScrollProvider>
          </ConversationProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
