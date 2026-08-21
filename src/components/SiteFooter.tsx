"use client";

import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/reactbits/ScrollReveal";
import { useI18n } from "@/i18n/provider";
import { getSiteUrl, siteEmail } from "@/seo/site";

export function SiteFooter() {
  const { t } = useI18n();
  const year = new Date().getFullYear();
  const url = getSiteUrl();

  return (
    <footer>
      <ScrollReveal className="flex w-full flex-col gap-12 py-16 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Image
            src="/uitherapyblack.png"
            alt="uitherapy"
            width={781}
            height={188}
            className="h-10 w-auto rounded-xl sm:h-11"
          />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-600">
            {t.footer.blurb}
          </p>
        </div>
        <div className="flex flex-col gap-6 text-sm text-neutral-600 sm:items-end">
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            <a
              href={`mailto:${siteEmail}`}
              className="transition-colors hover:text-accent"
            >
              {siteEmail}
            </a>
            <Link href={url} className="transition-colors hover:text-accent">
              {url.replace(/^https?:\/\//, "")}
            </Link>
          </div>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            © {year} uitherapy
          </p>
        </div>
      </ScrollReveal>
    </footer>
  );
}
