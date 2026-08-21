import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/seo/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();
  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: {
          en: base,
          cs: `${base}/cs`,
        },
      },
    },
    {
      url: `${base}/cs`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: {
          en: base,
          cs: `${base}/cs`,
        },
      },
    },
  ];
}
