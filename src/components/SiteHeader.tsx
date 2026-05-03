import Image from "next/image";
import Link from "next/link";
import { PillNav } from "@/components/PillNav";

export function SiteHeader() {
  return (
    <header className="site-header pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="pointer-events-auto mx-auto flex max-w-[90rem] items-center gap-3 px-4 pt-4 sm:gap-5 sm:px-6 sm:pt-5 lg:px-10">
        <Link
          href="/"
          className="flex shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/45 px-3 py-2 shadow-[0_16px_42px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-colors duration-300 hover:border-white/35 sm:px-3.5 sm:py-2.5"
          aria-label="UI Therapy home"
        >
          <Image
            src="/uilogo.png"
            alt=""
            width={781}
            height={188}
            priority
            className="h-6 w-auto sm:h-7"
          />
        </Link>
        <div className="flex min-w-0 flex-1 justify-center">
          <PillNav />
        </div>
        <a
          href="#contact"
          className="shrink-0 rounded-full border border-white/25 bg-black/40 px-4 py-2.5 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-white shadow-[0_16px_42px_rgba(0,0,0,0.42)] backdrop-blur-xl transition-[background-color,color,transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-white/45 hover:bg-white hover:text-black sm:px-5 sm:text-[0.65rem] sm:tracking-[0.26em]"
        >
          Let&apos;s talk
        </a>
      </div>
    </header>
  );
}
