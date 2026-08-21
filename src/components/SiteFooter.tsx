import Image from "next/image";
import Link from "next/link";
import { getSiteUrl, siteEmail } from "@/seo/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const url = getSiteUrl();

  return (
    <footer className="site-block">
      <div className="mx-auto flex max-w-[90rem] flex-col gap-12 px-4 py-16 sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:px-10">
        <div>
          <div className="inline-flex rounded-xl border border-black/10 bg-black p-3 shadow-[0_16px_42px_rgba(23,21,16,0.12)] backdrop-blur-md sm:p-3.5">
            <Image
              src="/uitherapyblack.png"
              alt="UI Therapy"
              width={781}
              height={188}
              className="h-8 w-auto sm:h-9"
            />
          </div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-neutral-600">
            Frontend craft—layout, motion, performance, accessibility.
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
            © {year} UI Therapy
          </p>
        </div>
      </div>
    </footer>
  );
}
