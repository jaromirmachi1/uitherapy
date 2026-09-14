import { articlesPath, defaultLocale, type Locale } from "@/i18n/config";
import { getSiteUrl } from "./site";

export function localePath(locale: Locale, hash = ""): string {
  const base = locale === defaultLocale ? "" : `/${locale}`;
  return hash ? `${base}${hash}` : base || "/";
}

export function localeUrl(locale: Locale, hash = ""): string {
  const base = getSiteUrl();
  const path = localePath(locale, hash);
  return path === "/" ? base : `${base}${path}`;
}

export function canonicalUrl(locale: Locale): string {
  return localeUrl(locale);
}

export function articlesUrl(locale: Locale, slug?: string): string {
  const base = getSiteUrl();
  return `${base}${articlesPath(locale, slug)}`;
}

export function articlesLanguageAlternates(
  slugByLocale?: Partial<Record<Locale, string>>,
): Record<string, string> {
  const base = getSiteUrl();
  const csPath = articlesPath("cs", slugByLocale?.cs);
  const enPath = articlesPath("en", slugByLocale?.en);
  return {
    cs: `${base}${csPath}`,
    en: `${base}${enPath}`,
    "x-default": `${base}${csPath}`,
  };
}

export function languageAlternates(): Record<string, string> {
  const base = getSiteUrl();
  return {
    cs: base,
    en: `${base}/en`,
    "x-default": base,
  };
}
