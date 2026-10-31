"use client";

import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/reactbits/ScrollReveal";
import { useConversation } from "@/components/conversation/ConversationProvider";
import { formatCzk, packagePrices, redesignFrom } from "@/content/pricing";
import { redesignCopy, redesignWork, withPrices } from "@/content/redesign";
import { pricingPath, projectsPath } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";

const display = "font-[family-name:var(--font-display)]";

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M4 12 12 4M6.5 4H12v5.5" />
    </svg>
  );
}

function PrimaryCta({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-7 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-white transition-colors hover:bg-accent"
    >
      {label}
      <Arrow />
    </button>
  );
}

export function RedesignPage() {
  const { locale } = useI18n();
  const c = redesignCopy[locale];
  const { openConversation } = useConversation();
  const price = { redesign: redesignFrom, start: packagePrices.start };

  return (
    <>
      <section aria-labelledby="redesign-heading" className="site-block">
        <div className="mx-auto max-w-[90rem] px-4 pb-12 pt-28 sm:px-8 sm:pb-16 sm:pt-36 lg:px-10 lg:pt-40">
          <ScrollReveal>
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.35em] text-accent">
              {c.kicker}
            </p>
            <h1
              id="redesign-heading"
              className={`${display} mt-4 max-w-[20ch] text-[clamp(2.4rem,5.6vw,4.8rem)] font-medium leading-[0.94] tracking-[-0.055em] text-foreground`}
            >
              {c.title}
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg">
              {c.intro}
            </p>
            <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
              <PrimaryCta label={c.cta} onClick={openConversation} />
              <p className="text-sm text-neutral-600">
                {c.priceLead}{" "}
                <span className="font-medium text-foreground">{formatCzk(redesignFrom, locale)}</span>
                {" · "}
                <Link href={pricingPath(locale)} className="underline decoration-foreground/30 underline-offset-4 hover:text-accent">
                  {c.newSiteLead} {formatCzk(packagePrices.start, locale)}
                </Link>
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section aria-labelledby="redesign-signs" className="site-block">
        <div className="mx-auto grid max-w-[90rem] gap-8 px-4 py-14 sm:px-8 sm:py-20 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:px-10">
          <h2 id="redesign-signs" className={`${display} text-[clamp(1.8rem,3.5vw,2.8rem)] font-medium leading-[1] tracking-[-0.045em]`}>
            {c.signsTitle}
          </h2>
          <ul className="border-t border-black/10">
            {c.signs.map((sign, index) => (
              <li key={sign} className="flex gap-4 border-b border-black/10 py-5 text-base sm:text-lg">
                <span className="mt-1 font-mono text-xs tabular-nums text-accent">0{index + 1}</span>
                {sign}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="redesign-paths" className="site-block">
        <div className="mx-auto max-w-[90rem] px-4 py-14 sm:px-8 sm:py-20 lg:px-10">
          <h2 id="redesign-paths" className={`${display} text-[clamp(1.8rem,3.5vw,2.8rem)] font-medium tracking-[-0.045em]`}>
            {c.pathsTitle}
          </h2>
          <ul className="mt-8 grid gap-2.5 md:grid-cols-2">
            {c.paths.map((path, index) => (
              <li
                key={path.name}
                className={`rounded-[1.25rem] p-7 sm:p-9 ${index === 0 ? "bg-[#111214] text-white" : "border border-black/10 bg-white"}`}
              >
                <h3 className={`${display} text-[1.8rem] font-medium tracking-[-0.045em]`}>{path.name}</h3>
                <p className={`mt-3 max-w-md text-sm leading-relaxed sm:text-base ${index === 0 ? "text-white/70" : "text-neutral-600"}`}>
                  {path.body}
                </p>
                <p className="mt-8 flex items-baseline gap-1.5">
                  <span className={`text-sm ${index === 0 ? "text-white/55" : "text-neutral-500"}`}>
                    {locale === "cs" ? "od" : "from"}
                  </span>
                  <span className={`${display} text-[2rem] font-medium tracking-[-0.04em]`}>
                    {formatCzk(price[path.priceKey], locale)}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="redesign-process" className="site-block">
        <div className="mx-auto max-w-[90rem] px-4 py-14 sm:px-8 sm:py-20 lg:px-10">
          <h2 id="redesign-process" className={`${display} text-[clamp(1.8rem,3.5vw,2.8rem)] font-medium tracking-[-0.045em]`}>
            {c.processTitle}
          </h2>
          <ol className="mt-8 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
            {c.process.map((step, index) => (
              <li key={step.title} className="rounded-[1.25rem] border border-black/10 bg-white p-6">
                <span className="font-mono text-xs tabular-nums text-accent">0{index + 1}</span>
                <h3 className={`${display} mt-4 text-xl font-medium tracking-[-0.035em]`}>{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="redesign-work" className="site-block">
        <div className="mx-auto max-w-[90rem] px-4 py-14 sm:px-8 sm:py-20 lg:px-10">
          <div className="flex items-end justify-between gap-4">
            <h2 id="redesign-work" className={`${display} text-[clamp(1.8rem,3.5vw,2.8rem)] font-medium tracking-[-0.045em]`}>
              {c.workTitle}
            </h2>
            <Link
              href={projectsPath(locale)}
              className="inline-flex items-center gap-2 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-foreground/70 hover:text-accent"
            >
              {c.workLink}
              <Arrow />
            </Link>
          </div>
          <ul className="mt-8 grid gap-2.5 md:grid-cols-3">
            {redesignWork.map((item) => (
              <li key={item.name}>
                <Link href={projectsPath(locale)} className="group block">
                  <span className="relative block aspect-[16/10] overflow-hidden rounded-[1.25rem] bg-[#ececee]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 30vw"
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </span>
                  <span className="mt-3 block text-sm font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="redesign-faq" className="site-block">
        <div className="mx-auto grid max-w-[90rem] gap-8 px-4 py-14 sm:px-8 sm:py-20 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:px-10">
          <div>
            <h2 id="redesign-faq" className={`${display} text-[clamp(1.8rem,3.5vw,2.8rem)] font-medium leading-[1] tracking-[-0.045em]`}>
              {c.faqTitle}
            </h2>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-neutral-600">{c.finalBody}</p>
            <div className="mt-6">
              <PrimaryCta label={c.finalCta} onClick={openConversation} />
            </div>
          </div>
          <div className="border-t border-black/10">
            {c.faq.map((item) => (
              <details key={item.q} className="group border-b border-black/10">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left [&::-webkit-details-marker]:hidden">
                  <h3 className={`${display} text-lg font-medium tracking-[-0.03em] sm:text-xl`}>{item.q}</h3>
                  <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/10 text-lg transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="max-w-2xl pb-6 text-sm leading-relaxed text-neutral-600 sm:text-base">
                  {withPrices(item.a, locale)}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
