import { getSiteUrl, siteDescription, siteEmail, siteName } from "./site";

export function JsonLdWebsite({ description }: { description?: string }) {
  const url = getSiteUrl();
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    description: description ?? siteDescription,
    url,
    inLanguage: ["en", "cs"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function JsonLdProfessionalService({
  description,
}: {
  description?: string;
}) {
  const url = getSiteUrl();
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteName,
    description: description ?? siteDescription,
    url,
    email: siteEmail,
    areaServed: "Worldwide",
    serviceType: ["Web design", "Frontend development", "UI engineering"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
