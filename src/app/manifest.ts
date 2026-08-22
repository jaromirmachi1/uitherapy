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
        src: "/uifavicon.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/uifavicon.ico",
        sizes: "32x32",
        type: "image/x-icon",
      },
    ],
    id: base,
  };
}
