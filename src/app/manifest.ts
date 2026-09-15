import type { MetadataRoute } from "next";
import { getSiteUrl, siteDescription, siteName } from "@/seo/site";

export default function manifest(): MetadataRoute.Manifest {
  const base = getSiteUrl();

  return {
    name: siteName,
    short_name: siteName,
    description: siteDescription,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#e8e8e8",
    theme_color: "#ffffff",
    lang: "cs",
    dir: "ltr",
    categories: ["business", "design"],
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
    id: base,
  };
}
