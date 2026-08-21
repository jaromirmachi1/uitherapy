"use client";

import Image from "next/image";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useConversation } from "@/components/conversation/ConversationProvider";
import {
  localeLabels,
  localeNames,
  localePath,
  locales,
} from "@/i18n/config";
import { useI18n } from "@/i18n/provider";

export function SiteHeader() {
  const { locale, t } = useI18n();
  const { openConversation } = useConversation();
  const alternate = locales.find((code) => code !== locale) ?? locale;

  return (
    <>
      <header className="site-header pointer-events-none fixed inset-x-0 top-0 z-50">
        <div className="pointer-events-auto mx-auto flex max-w-[100rem] items-start justify-between gap-3 px-3 pt-5 sm:px-12 sm:pt-12">
          <Link
            href={localePath(locale)}
            className="inline-flex shrink-0 overflow-hidden rounded-md"
            aria-label="uitherapy home"
          >
            <Image
              src="/uitherapyblack.png"
              alt=""
              width={781}
              height={188}
              priority
              className="h-7 w-auto sm:h-8"
            />
          </Link>

          <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
            <nav
              aria-label="Primary"
              className="flex items-center gap-1.5 sm:gap-2"
            >
              <a
                href="#projects"
                className="hidden h-9 items-center rounded-md border border-foreground/85 px-4 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-foreground transition-colors hover:bg-foreground hover:text-white sm:inline-flex"
              >
                {t.nav.projects}
              </a>
              <button
                type="button"
                onClick={openConversation}
                className="inline-flex h-9 max-w-[12rem] items-center truncate rounded-md bg-foreground px-3 text-[0.62rem] font-medium uppercase tracking-[0.12em] text-white transition-colors hover:bg-accent sm:max-w-none sm:px-4 sm:text-[0.68rem] sm:tracking-[0.14em]"
              >
                {t.nav.contact}
              </button>
            </nav>
            <div className="hidden sm:block">
              <LanguageSwitcher locale={locale} label={t.nav.language} />
            </div>
          </div>
        </div>
      </header>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 sm:hidden">
        <div className="pointer-events-auto p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <Link
            href={localePath(alternate)}
            hrefLang={alternate}
            lang={alternate}
            aria-label={localeNames[alternate]}
            className="inline-flex h-10 min-w-10 items-center justify-center rounded-md bg-white px-3 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-foreground shadow-[0_8px_28px_rgba(43,43,43,0.14)] transition-colors hover:bg-foreground hover:text-white"
          >
            {localeLabels[alternate]}
          </Link>
        </div>
      </div>
    </>
  );
}
