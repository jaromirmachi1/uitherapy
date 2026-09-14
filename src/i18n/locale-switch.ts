import { articles as catalog } from "@/content/articles";
import { articlesPath, localePath, type Locale } from "@/i18n/config";

/** Resolve locale switch target when on articles routes. */
export function articlesLocaleHref(locale: Locale, pathname: string): string | null {
  const isArticlesIndex =
    pathname === "/clanky" ||
    pathname === "/en/articles" ||
    pathname === "/articles";
  if (isArticlesIndex) return articlesPath(locale);

  const csMatch = pathname.match(/^\/clanky\/([^/]+)\/?$/);
  const enMatch = pathname.match(/^\/en\/articles\/([^/]+)\/?$/);
  const bareMatch = pathname.match(/^\/articles\/([^/]+)\/?$/);
  const slug = csMatch?.[1] ?? enMatch?.[1] ?? bareMatch?.[1];
  if (!slug) return null;

  const article = catalog.find(
    (entry) => entry.slugs.cs === slug || entry.slugs.en === slug,
  );
  if (!article) return articlesPath(locale);
  return articlesPath(locale, article.slugs[locale]);
}

export function localeSwitchHref(locale: Locale, pathname: string): string {
  return articlesLocaleHref(locale, pathname) ?? localePath(locale);
}
