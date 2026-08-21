import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="pointer-events-auto mx-auto flex max-w-[100rem] items-start justify-between px-12 pt-12">
        <Link
          href="/"
          className="inline-flex overflow-hidden rounded-md"
          aria-label="UI Therapy home"
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

        <nav aria-label="Primary" className="flex items-center gap-2">
          <a
            href="#projects"
            className="inline-flex h-9 items-center rounded-md border border-foreground/85 px-4 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-foreground transition-colors hover:bg-foreground hover:text-white"
          >
            Projects
          </a>
          <a
            href="#contact"
            className="inline-flex h-9 items-center rounded-md bg-foreground px-4 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-accent"
          >
            Start a conversation
          </a>
        </nav>
      </div>
    </header>
  );
}
