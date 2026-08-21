"use client";

import Image from "next/image";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useConversation } from "@/components/conversation/ConversationProvider";
import { localePath } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";

export function SiteHeader() {
  const { locale, t } = useI18n();
  const { openConversation } = useConversation();

  return (
    <header className="site-header pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="pointer-events-auto mx-auto flex max-w-[100rem] items-start justify-between px-6 pt-8 sm:px-12 sm:pt-12">
        <Link
          href={localePath(locale)}
          className="inline-flex overflow-hidden rounded-md"
          aria-label="uitherapy home"
        >
          <Image
            src="/uitherapyblack.png"
            alt=""
            width={781}
            height={188}
            priority
            className="h-8 w-auto"
          />
        </Link>

        <div className="flex items-center gap-2">
          <nav aria-label="Primary" className="flex items-center gap-2">
            <a
              href="#projects"
              className="inline-flex h-9 items-center rounded-md border border-foreground/85 px-3 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-foreground transition-colors hover:bg-foreground hover:text-white sm:px-4"
            >
              {t.nav.projects}
            </a>
            <button
              type="button"
              onClick={openConversation}
              className="inline-flex h-9 items-center rounded-md bg-foreground px-3 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-accent sm:px-4"
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
