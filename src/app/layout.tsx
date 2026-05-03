import type { Metadata, Viewport } from "next";
import { DM_Sans, Syne } from "next/font/google";
import { GsapProvider } from "@/components/providers/GsapProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { JsonLdProfessionalService, JsonLdWebsite } from "@/seo/jsonld";
import { getSiteUrl, siteDescription, siteName, siteTagline } from "@/seo/site";
import "./globals.css";

const display = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
});

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — Premium interfaces & technical SEO`,
    template: `%s — ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName,
    title: `${siteName} — ${siteTagline}`,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} — ${siteTagline}`,
    description: siteDescription,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#080512",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${sans.variable} font-sans antialiased`}
      >
        <JsonLdWebsite />
        <JsonLdProfessionalService />
        <SmoothScrollProvider>
          <GsapProvider />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
