import Link from "next/link";
import {
  localeLabels,
  localeNames,
  localePath,
  locales,
  type Locale,
} from "@/i18n/config";

type Props = {
  locale: Locale;
  label: string;
};

export function LanguageSwitcher({ locale, label }: Props) {
  const alternate = locales.find((code) => code !== locale) ?? locale;

  return (
    <nav aria-label={label} className="ml-0.5 flex items-center sm:ml-2">
      <Link
        href={localePath(alternate)}
        hrefLang={alternate}
        lang={alternate}
        aria-label={localeNames[alternate]}
        className="inline-flex h-8 items-center rounded-md bg-white px-2.5 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-foreground shadow-[0_1px_2px_rgba(43,43,43,0.06)] transition-colors hover:bg-foreground hover:text-white sm:hidden"
      >
        {localeLabels[alternate]}
      </Link>

      <div className="hidden items-center sm:flex">
        {locales.map((code) => {
          const active = code === locale;
          return (
            <Link
              key={code}
              href={localePath(code)}
              hrefLang={code}
              lang={code}
              aria-label={localeNames[code]}
              aria-current={active ? "page" : undefined}
              className={`inline-flex h-8 items-center px-2.5 text-[0.68rem] font-medium uppercase tracking-[0.14em] transition-colors ${
                active
                  ? "rounded-md bg-white text-foreground shadow-[0_1px_2px_rgba(43,43,43,0.06)]"
                  : "text-foreground/40 hover:text-foreground"
              }`}
            >
              {localeLabels[code]}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
