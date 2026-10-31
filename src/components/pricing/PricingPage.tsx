"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { ScrollReveal } from "@/components/reactbits/ScrollReveal";
import { useConversation } from "@/components/conversation/ConversationProvider";
import {
  carePrices,
  featuredPackage,
  formatCzk,
  oneOffWithCareTotal,
  packageExample,
  packagePrices,
  pricingCopy,
  redesignFrom,
  subscriptionTotal,
  subscriptions,
  type CareId,
  type PackageId,
} from "@/content/pricing";
import { useI18n } from "@/i18n/provider";

type Mode = "oneOff" | "subscription";

const display = "font-[family-name:var(--font-display)]";

function Check({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={`h-4 w-4 shrink-0 ${className}`} fill="none" aria-hidden>
      <path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M4 12 12 4M6.5 4H12v5.5" />
    </svg>
  );
}

function CtaButton({
  label,
  dark,
  onClick,
}: {
  label: string;
  dark?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-12 w-full items-center justify-center gap-2 rounded-full text-[0.72rem] font-medium uppercase tracking-[0.16em] transition-colors ${
        dark
          ? "bg-white text-foreground hover:bg-accent hover:text-white"
          : "bg-foreground text-white hover:bg-accent"
      }`}
    >
      {label}
      <Arrow />
    </button>
  );
}

function Example({
  pkg,
  label,
  dark,
}: {
  pkg: PackageId;
  label: string;
  dark?: boolean;
}) {
  const example = packageExample[pkg];
  return (
    <figure className="mt-6">
      <span className="relative block aspect-[16/10] overflow-hidden rounded-xl bg-black/5">
        <Image
          src={example.image}
          alt=""
          fill
          sizes="(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 22vw"
          className="object-cover object-top"
        />
      </span>
      <figcaption
        className={`mt-2 text-[0.68rem] uppercase tracking-[0.14em] ${
          dark ? "text-white/50" : "text-neutral-400"
        }`}
      >
        {label} · {example.id}
      </figcaption>
    </figure>
  );
}

export function PricingPage() {
  const { locale } = useI18n();
  const c = pricingCopy[locale];
  const reduce = useReducedMotion();
  const { openConversation } = useConversation();
  const [mode, setMode] = useState<Mode>("oneOff");
  const czk = (value: number) => formatCzk(value, locale);

  const fade = {
    initial: reduce ? false : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: reduce ? undefined : { opacity: 0, y: -8 },
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  };

  return (
    <>
      <section aria-labelledby="pricing-heading" className="site-block">
        <div className="mx-auto max-w-[90rem] px-2.5 pb-6 pt-28 sm:px-4 sm:pb-10 sm:pt-36 lg:pt-40">
          <ScrollReveal>
            <header className="grid gap-6 px-2 sm:px-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:items-end lg:px-6">
              <div>
                <p className="text-[0.65rem] font-medium uppercase tracking-[0.35em] text-accent">
                  {c.kicker}
                </p>
                <h1
                  id="pricing-heading"
                  className={`${display} mt-4 max-w-[16ch] text-[clamp(2.4rem,6vw,5rem)] font-medium leading-[0.92] tracking-[-0.055em] text-foreground`}
                >
                  {c.title}
                </h1>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-neutral-600 sm:text-base">
                {c.intro}
              </p>
            </header>
          </ScrollReveal>

          <div className="mt-10 flex border-t border-black/10 px-2 pt-6 sm:px-4 lg:mt-14 lg:px-6">
            <div
              role="tablist"
              aria-label={c.kicker}
              className="inline-flex rounded-full bg-black/[0.05] p-1"
            >
              {(["oneOff", "subscription"] as Mode[]).map((key) => {
                const active = key === mode;
                return (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setMode(key)}
                    className={`relative inline-flex h-10 items-center rounded-full px-5 text-sm font-medium transition-colors ${
                      active ? "text-white" : "text-foreground/60 hover:text-foreground"
                    }`}
                  >
                    {active ? (
                      <motion.span
                        layoutId="pricing-mode-pill"
                        className="absolute inset-0 rounded-full bg-foreground"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        aria-hidden
                      />
                    ) : null}
                    <span className="relative">{c.modes[key]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {mode === "oneOff" ? (
              <motion.div key="oneOff" {...fade} className="mt-6 px-0 sm:px-2 lg:px-4">
                <ul className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-4">
                  {(Object.keys(packagePrices) as PackageId[]).map((pkg) => {
                    const p = c.packages[pkg];
                    const dark = pkg === featuredPackage;
                    return (
                      <li
                        key={pkg}
                        className={`relative flex flex-col rounded-[1.25rem] p-6 sm:p-7 ${
                          dark
                            ? "bg-[#111214] text-white"
                            : "border border-black/10 bg-white text-foreground"
                        }`}
                      >
                        {dark ? (
                          <span className="absolute right-5 top-5 rounded-full bg-accent px-2.5 py-1 text-[0.62rem] font-medium uppercase tracking-[0.12em] text-white">
                            {c.featured}
                          </span>
                        ) : null}
                        <h2 className={`${display} text-[1.9rem] font-medium tracking-[-0.045em]`}>
                          {p.name}
                        </h2>
                        <p className={`mt-2 min-h-[3rem] text-sm leading-relaxed ${dark ? "text-white/65" : "text-neutral-600"}`}>
                          {p.lead}
                        </p>
                        <p className="mt-6 flex items-baseline gap-1.5">
                          <span className={`text-sm ${dark ? "text-white/55" : "text-neutral-500"}`}>{c.from}</span>
                          <span className={`${display} text-[2rem] font-medium tracking-[-0.04em]`}>
                            {czk(packagePrices[pkg])}
                          </span>
                        </p>
                        <p className={`mt-6 border-t pt-5 text-[0.62rem] font-medium uppercase tracking-[0.22em] ${dark ? "border-white/10 text-white/45" : "border-black/10 text-neutral-400"}`}>
                          {c.includesLabel}
                        </p>
                        <ul className="mt-3 flex flex-col gap-2.5">
                          {p.includes.map((item) => (
                            <li key={item} className="flex items-start gap-2.5 text-sm">
                              <Check className={`mt-0.5 ${dark ? "text-white" : "text-accent"}`} />
                              {item}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-auto">
                          <Example pkg={pkg} label={c.exampleLabel} dark={dark} />
                          <div className="mt-6">
                            <CtaButton label={c.cta} dark={dark} onClick={openConversation} />
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-16 px-2 sm:px-2">
                  <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:items-end">
                    <h2 className={`${display} text-[clamp(1.8rem,3.5vw,2.8rem)] font-medium tracking-[-0.045em]`}>
                      {c.care.title}
                    </h2>
                    <p className="max-w-md text-sm leading-relaxed text-neutral-600">
                      {c.care.intro}
                    </p>
                  </div>
                  <ul className="mt-6 grid gap-2.5 md:grid-cols-3">
                    {(Object.keys(carePrices) as CareId[]).map((care) => {
                      const tier = c.care.tiers[care];
                      return (
                        <li key={care} className="rounded-[1.25rem] border border-black/10 bg-white p-6 sm:p-7">
                          <div className="flex items-baseline justify-between gap-4">
                            <h3 className={`${display} text-xl font-medium tracking-[-0.035em]`}>
                              {tier.name}
                            </h3>
                            <p className="whitespace-nowrap">
                              <span className={`${display} text-xl font-medium tracking-[-0.03em]`}>
                                {czk(carePrices[care])}
                              </span>{" "}
                              <span className="text-sm text-neutral-500">{c.care.perMonth}</span>
                            </p>
                          </div>
                          <ul className="mt-5 flex flex-col gap-2.5 border-t border-black/10 pt-5">
                            {tier.includes.map((item) => (
                              <li key={item} className="flex items-start gap-2.5 text-sm">
                                <Check className="mt-0.5 text-accent" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </motion.div>
            ) : (
              <motion.div key="subscription" {...fade} className="mt-6 px-0 sm:px-2 lg:px-4">
                <p className="max-w-2xl px-2 text-sm leading-relaxed text-neutral-600 sm:text-base">
                  {c.sub.intro}
                </p>
                <ul className="mt-6 grid gap-2.5 lg:grid-cols-3">
                  {subscriptions.map((s) => {
                    const dark = s.pkg === featuredPackage;
                    const p = c.packages[s.pkg];
                    const care = c.care.tiers[s.care];
                    return (
                      <li
                        key={s.id}
                        className={`relative flex flex-col rounded-[1.25rem] p-6 sm:p-7 ${
                          dark ? "bg-[#111214] text-white" : "border border-black/10 bg-white text-foreground"
                        }`}
                      >
                        {dark ? (
                          <span className="absolute right-5 top-5 rounded-full bg-accent px-2.5 py-1 text-[0.62rem] font-medium uppercase tracking-[0.12em] text-white">
                            {c.featured}
                          </span>
                        ) : null}
                        <h2 className={`${display} text-[1.9rem] font-medium tracking-[-0.045em]`}>
                          {p.name}
                          <span className={dark ? "text-white/40" : "text-foreground/35"}> + {care.name}</span>
                        </h2>
                        <p className={`mt-2 text-sm leading-relaxed ${dark ? "text-white/65" : "text-neutral-600"}`}>
                          {p.lead}
                        </p>
                        <p className="mt-6 flex items-baseline gap-1.5">
                          <span className={`${display} text-[2.3rem] font-medium tracking-[-0.04em]`}>
                            {czk(s.monthly)}
                          </span>
                          <span className={`text-sm ${dark ? "text-white/55" : "text-neutral-500"}`}>{c.sub.monthly}</span>
                        </p>
                        <p className={`mt-1 text-sm ${dark ? "text-white/65" : "text-neutral-600"}`}>
                          + {c.sub.entry.toLowerCase()} {czk(s.entry)}
                        </p>
                        <p className={`mt-6 border-t pt-5 text-[0.62rem] font-medium uppercase tracking-[0.22em] ${dark ? "border-white/10 text-white/45" : "border-black/10 text-neutral-400"}`}>
                          {c.includesLabel}
                        </p>
                        <ul className="mt-3 flex flex-col gap-2.5">
                          {[...p.includes.slice(0, 3), `${c.sub.includesCare} ${care.name}`, c.sub.term].map((item) => (
                            <li key={item} className="flex items-start gap-2.5 text-sm">
                              <Check className={`mt-0.5 ${dark ? "text-white" : "text-accent"}`} />
                              {item}
                            </li>
                          ))}
                        </ul>
                        <dl className={`mt-6 grid gap-1.5 rounded-xl p-4 text-sm ${dark ? "bg-white/[0.06]" : "bg-black/[0.035]"}`}>
                          <div className="flex justify-between gap-4">
                            <dt className={dark ? "text-white/65" : "text-neutral-600"}>{c.sub.total}</dt>
                            <dd className="font-medium tabular-nums">{czk(subscriptionTotal(s))}</dd>
                          </div>
                          <div className="flex justify-between gap-4">
                            <dt className={dark ? "text-white/65" : "text-neutral-600"}>{c.sub.compare}</dt>
                            <dd className="tabular-nums">{czk(oneOffWithCareTotal(s))}</dd>
                          </div>
                        </dl>
                        <div className="mt-auto">
                          <Example pkg={s.pkg} label={c.exampleLabel} dark={dark} />
                          <div className="mt-6">
                            <CtaButton label={c.cta} dark={dark} onClick={openConversation} />
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-6 max-w-3xl px-2 text-sm leading-relaxed text-neutral-600">
                  {c.sub.honest}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section className="site-block bg-accent! text-white">
        <div className="mx-auto flex max-w-[90rem] flex-col gap-6 px-6 py-10 sm:px-10 sm:py-14 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className={`${display} text-[clamp(1.6rem,3vw,2.4rem)] font-medium tracking-[-0.045em]`}>
              {c.redesign.title}
            </h2>
            <p className="mt-2 max-w-xl text-white/80">
              {c.redesign.body}{" "}
              <span className="whitespace-nowrap font-medium text-white">
                {c.redesign.price} {czk(redesignFrom)}.
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={openConversation}
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-7 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-foreground transition-colors hover:bg-foreground hover:text-white"
          >
            {c.redesign.cta}
            <Arrow />
          </button>
        </div>
      </section>

      <section aria-labelledby="pricing-faq" className="site-block">
        <div className="mx-auto grid max-w-[90rem] gap-8 px-6 py-14 sm:px-10 sm:py-20 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div>
            <h2 id="pricing-faq" className={`${display} text-[clamp(1.8rem,3.5vw,2.8rem)] font-medium tracking-[-0.045em]`}>
              {c.faqTitle}
            </h2>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-neutral-600">
              {c.finalBody}
            </p>
            <button
              type="button"
              onClick={openConversation}
              className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-7 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-white transition-colors hover:bg-accent"
            >
              {c.finalCta}
              <Arrow />
            </button>
          </div>
          <div className="border-t border-black/10">
            {c.faq.map((item) => (
              <details key={item.q} className="group border-b border-black/10">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left [&::-webkit-details-marker]:hidden">
                  <span className={`${display} text-lg font-medium tracking-[-0.03em] sm:text-xl`}>
                    {item.q}
                  </span>
                  <span
                    aria-hidden
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/10 text-lg transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="max-w-2xl pb-6 text-sm leading-relaxed text-neutral-600 sm:text-base">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
