import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/seo/site";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    host: new URL(base).host,
    sitemap: `${base}/sitemap.xml`,
  };
}
