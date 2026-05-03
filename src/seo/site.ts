export const siteName = "UI Therapy";
export const siteTagline =
  "Premium interfaces, performance-first builds, and search-ready experiences.";
export const siteDescription =
  "UI Therapy is a frontend studio crafting luxury-grade web experiences—motion, typography, accessibility, and technical SEO baked in from day one.";

const fallbackUrl = "https://uitherapy.io";

export function getSiteUrl(): string {
  if (typeof process.env.NEXT_PUBLIC_SITE_URL === "string" && process.env.NEXT_PUBLIC_SITE_URL.length > 0) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  return fallbackUrl;
}
