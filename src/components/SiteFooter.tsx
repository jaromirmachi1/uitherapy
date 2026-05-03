import Image from "next/image";
import Link from "next/link";
import { getSiteUrl } from "@/seo/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const url = getSiteUrl();

  return (
    <footer className="border-t border-accent/15 bg-black">
      <div className="mx-auto flex max-w-[90rem] flex-col gap-12 px-4 py-16 sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:px-10">
        <div>
          <div className="inline-flex rounded-xl border border-white/15 bg-white/[0.06] p-3 backdrop-blur-md sm:p-3.5">
            <Image
              src="/uilogo.png"
              alt="UI Therapy"
              width={781}
              height={188}
              className="h-8 w-auto sm:h-9"
            />
          </div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-neutral-500">
            Frontend craft—layout, motion, performance, accessibility.
          </p>
        </div>
        <div className="flex flex-col gap-6 text-sm text-neutral-500 sm:items-end">
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            <a
              href="mailto:hello@uitherapy.io"
              className="transition-colors hover:text-accent"
            >
              hello@uitherapy.io
            </a>
            <Link href={url} className="transition-colors hover:text-accent">
              {url.replace(/^https?:\/\//, "")}
            </Link>
          </div>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-600">
            © {year} UI Therapy
          </p>
        </div>
      </div>
    </footer>
  );
}
