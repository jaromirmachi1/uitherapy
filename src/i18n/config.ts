export const locales = ["en", "cs"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "cs";

export const localeLabels: Record<Locale, string> = {
  en: "EN",
  cs: "CZ",
};

export const localeNames: Record<Locale, string> = {
  en: "English",
  cs: "Čeština",
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function localePath(locale: Locale, hash = "") {
  const base = locale === defaultLocale ? "/" : `/${locale}`;
  return hash ? `${base}${hash}` : base;
}
