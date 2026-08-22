import type { Metadata, Viewport } from "next";
import { DM_Sans, Syne } from "next/font/google";
import { notFound } from "next/navigation";
import { ConversationModal } from "@/components/conversation/ConversationModal";
import { ConversationProvider } from "@/components/conversation/ConversationProvider";
import { LegalModal } from "@/components/legal/LegalModal";
import { LegalProvider } from "@/components/legal/LegalProvider";
import { GsapProvider } from "@/components/providers/GsapProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { I18nProvider } from "@/i18n/provider";
import { buildSiteMetadata } from "@/seo/metadata";
import { JsonLdGraph } from "@/seo/jsonld";
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

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
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
  return buildSiteMetadata(raw);
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
        <JsonLdGraph locale={locale} />
        <I18nProvider locale={locale} dictionary={dictionary}>
          <ConversationProvider>
            <LegalProvider>
              <SmoothScrollProvider>
                <GsapProvider />
                {children}
                <ConversationModal />
                <LegalModal />
              </SmoothScrollProvider>
            </LegalProvider>
          </ConversationProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
