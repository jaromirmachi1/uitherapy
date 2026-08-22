export const siteName = "uitherapy";
export const siteTagline =
  "Premium interfaces, performance-first builds, and search-ready experiences.";
export const siteDescription =
  "uitherapy is a senior frontend studio building premium marketing sites, ecommerce storefronts, and SEO-ready web interfaces.";

export const siteEmail = "core@uitherapy.com";

export const legalEntityName = "Jaromír Machalíček";
export const legalEntityIco = "IČO 14293811";
export const legalEntityAddress = "Slatina 198, 742 93";
export const legalEntityCountry = "CZ";

export const siteLogoPath = "/uitherapyblack.png";

const fallbackUrl = "https://uitherapy.com";

export function getSiteUrl(): string {
  if (
    typeof process.env.NEXT_PUBLIC_SITE_URL === "string" &&
    process.env.NEXT_PUBLIC_SITE_URL.length > 0
  ) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  return fallbackUrl;
}
