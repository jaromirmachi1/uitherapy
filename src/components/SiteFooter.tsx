"use client";

import Link from "next/link";
import { useLegal } from "@/components/legal/LegalProvider";
import { pricingPath, projectsPath, redesignPath } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";
import { getSiteUrl, siteEmail } from "@/seo/site";

export function SiteFooter() {
  const { t, locale } = useI18n();
  const { openLegal } = useLegal();
  const year = new Date().getFullYear();
  const url = getSiteUrl();

  return (
    <footer className="flex w-full flex-col gap-6 py-12 text-sm text-neutral-600 sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:py-8">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
        <a
          href={`mailto:${siteEmail}`}
          className="transition-colors hover:text-accent"
        >
          {siteEmail}
        </a>
        <Link href={url} className="transition-colors hover:text-accent">
          {url.replace(/^https?:\/\//, "")}
        </Link>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href={redesignPath(locale)} className="transition-colors hover:text-accent">
            {t.footer.redesign}
          </Link>
          <Link href={pricingPath(locale)} className="transition-colors hover:text-accent">
            {t.nav.pricing}
          </Link>
          <Link href={projectsPath(locale)} className="transition-colors hover:text-accent">
            {t.nav.projects}
          </Link>
        </nav>
        <button
          type="button"
          onClick={openLegal}
          className="text-[0.62rem] font-medium uppercase tracking-[0.18em] text-neutral-500 transition-colors hover:text-accent"
        >
          {t.footer.legal}
        </button>
      </div>
      <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
        © {year} uitherapy
      </p>
    </footer>
  );
}
