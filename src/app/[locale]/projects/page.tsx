import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingShell } from "@/components/MarketingShell";
import { ProjectsIndex } from "@/components/projects/ProjectsIndex";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { projectsLanguageAlternates, projectsUrl } from "@/seo/urls";
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
  const canonical = projectsUrl(locale);
  const siteUrl = getSiteUrl();

  return {
    title: t.projects.seoTitle,
    description: t.projects.seoDescription,
    alternates: {
      canonical,
      languages: projectsLanguageAlternates(),
    },
    openGraph: {
      type: "website",
      locale: locale === "cs" ? "cs_CZ" : "en_US",
      url: canonical,
      siteName,
      title: `${t.projects.seoTitle} — ${siteName}`,
      description: t.projects.seoDescription,
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
      title: `${t.projects.seoTitle} — ${siteName}`,
      description: t.projects.seoDescription,
    },
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();

  return (
    <MarketingShell>
      <div className="px-2.5 sm:px-6">
        <ProjectsIndex />
      </div>
    </MarketingShell>
  );
}
