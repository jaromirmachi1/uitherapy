import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/seo/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();
  const languages = {
    cs: base,
    en: `${base}/en`,
  };

  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages },
    },
    {
      url: `${base}/en`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: { languages },
    },
  ];
}
