import { defaultLocale, type Locale } from "@/i18n/config";
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

export function languageAlternates(): Record<string, string> {
  const base = getSiteUrl();
  return {
    cs: base,
    en: `${base}/en`,
    "x-default": base,
  };
}
