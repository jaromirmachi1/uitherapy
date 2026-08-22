import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { canonicalUrl } from "@/seo/urls";
import {
  getSiteUrl,
  legalEntityAddress,
  legalEntityCountry,
  legalEntityIco,
  legalEntityName,
  siteEmail,
  siteLogoPath,
  siteName,
} from "./site";

const services = [
  "Web design",
  "Frontend development",
  "UI engineering",
  "Technical SEO",
  "Ecommerce interfaces",
  "Next.js development",
];

function entityId(path: string) {
  return `${getSiteUrl()}${path}`;
}

export function JsonLdGraph({ locale }: { locale: Locale }) {
  const url = getSiteUrl();
  const pageUrl = canonicalUrl(locale);
  const t = getDictionary(locale);
  const language = locale === "cs" ? "cs-CZ" : "en";

  const organization = {
    "@type": "Organization",
    "@id": entityId("/#organization"),
    name: siteName,
    legalName: legalEntityName,
    url,
    email: siteEmail,
    logo: {
      "@type": "ImageObject",
      url: `${url}${siteLogoPath}`,
    },
    founder: {
      "@type": "Person",
      name: legalEntityName,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: legalEntityAddress.split(",")[0]?.trim(),
      addressLocality: "Slatina",
      postalCode: "742 93",
      addressCountry: legalEntityCountry,
    },
    identifier: {
      "@type": "PropertyValue",
      name: "IČO",
      value: legalEntityIco.replace(/^IČO\s*/, ""),
    },
  };

  const website = {
    "@type": "WebSite",
    "@id": entityId("/#website"),
    name: siteName,
    description: t.seo.description,
    url,
    inLanguage: ["cs-CZ", "en"],
    publisher: { "@id": entityId("/#organization") },
  };

  const professionalService = {
    "@type": "ProfessionalService",
    "@id": entityId("/#service"),
    name: siteName,
    description: t.seo.description,
    url,
    email: siteEmail,
    image: `${url}${siteLogoPath}`,
    provider: { "@id": entityId("/#organization") },
    areaServed: [
      { "@type": "Country", name: "Czech Republic" },
      { "@type": "Place", name: "Worldwide" },
    ],
    serviceType: services,
    knowsAbout: [
      "Web development",
      "Search engine optimization",
      "User interface design",
      "React",
      "Next.js",
    ],
  };

  const webPage = {
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: t.seo.title,
    description: t.seo.description,
    isPartOf: { "@id": entityId("/#website") },
    about: { "@id": entityId("/#service") },
    inLanguage: language,
    primaryImageOfPage: {
      "@type": "ImageObject",
      url:
        locale === "cs"
          ? `${url}/opengraph-image`
          : `${url}/${locale}/opengraph-image`,
    },
  };

  const schema = {
    "@context": "https://schema.org",
    "@graph": [organization, website, professionalService, webPage],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
