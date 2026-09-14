"use client";

import Image from "next/image";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useConversation } from "@/components/conversation/ConversationProvider";
import { articlesPath, localePath } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";

export function SiteHeader() {
  const { locale, t } = useI18n();
  const { openConversation } = useConversation();
  const homeProjects =
    localePath(locale) === "/"
      ? "/#projects"
      : `${localePath(locale)}#projects`;

  return (
    <header className="site-header site-chrome pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="pointer-events-auto mx-auto flex max-w-[100rem] items-start justify-between gap-3 px-5 pt-5 sm:px-12 sm:pt-12">
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
            <Link
              href={homeProjects}
              className="hidden h-9 items-center rounded-md border border-foreground/85 px-4 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-foreground transition-colors hover:bg-foreground hover:text-white sm:inline-flex"
            >
              {t.nav.projects}
            </Link>
            <Link
              href={articlesPath(locale)}
              className="hidden h-9 items-center rounded-md border border-foreground/85 px-4 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-foreground transition-colors hover:bg-foreground hover:text-white sm:inline-flex"
            >
              {t.nav.articles}
            </Link>
            <button
              type="button"
              onClick={openConversation}
              className="inline-flex h-9 max-w-[12rem] items-center truncate rounded-md bg-foreground px-3 text-[0.62rem] font-medium uppercase tracking-[0.12em] text-white transition-colors hover:bg-accent sm:max-w-none sm:px-4 sm:text-[0.68rem] sm:tracking-[0.14em]"
            >
              {t.nav.contact}
            </button>
          </nav>
          <LanguageSwitcher locale={locale} label={t.nav.language} />
        </div>
      </div>
    </header>
  );
}
