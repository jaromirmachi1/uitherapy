import type { MetadataRoute } from "next";
import { articles } from "@/content/articles";
import { articlesPath } from "@/i18n/config";
import { articlesLanguageAlternates, languageAlternates } from "@/seo/urls";
import { getSiteUrl } from "@/seo/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();
  const languages = languageAlternates();
  const articlesIndexLanguages = articlesLanguageAlternates();

  const articleEntries: MetadataRoute.Sitemap = articles.flatMap((article) => {
    const published = new Date(article.publishedAt);
    return [
      {
        url: `${base}${articlesPath("cs", article.slugs.cs)}`,
        lastModified: published,
        changeFrequency: "monthly" as const,
        priority: 0.7,
        alternates: {
          languages: articlesLanguageAlternates(article.slugs),
        },
      },
      {
        url: `${base}${articlesPath("en", article.slugs.en)}`,
        lastModified: published,
        changeFrequency: "monthly" as const,
        priority: 0.65,
        alternates: {
          languages: articlesLanguageAlternates(article.slugs),
        },
      },
    ];
  });

  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
      alternates: { languages },
    },
    {
      url: `${base}/en`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: { languages },
    },
    {
      url: `${base}${articlesPath("cs")}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: { languages: articlesIndexLanguages },
    },
    {
      url: `${base}${articlesPath("en")}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
      alternates: { languages: articlesIndexLanguages },
    },
    ...articleEntries,
  ];
}
