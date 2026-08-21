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
  return (
    <nav aria-label={label} className="ml-1 flex items-center sm:ml-2">
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
    </nav>
  );
}
