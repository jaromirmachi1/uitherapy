"use client";

import { ScrollReveal } from "@/components/reactbits/ScrollReveal";
import { TiltedCard } from "@/components/reactbits/TiltedCard";
import { useConversation } from "@/components/conversation/ConversationProvider";
import type { Dictionary } from "@/i18n/dictionary";
import { useI18n } from "@/i18n/provider";
import { useReducedMotion } from "motion/react";

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path d="M4 12 12 4M6.5 4H12v5.5" />
    </svg>
  );
}

function ProcessCard({
  step,
  onOpen,
}: {
  step: Dictionary["process"]["steps"][number];
  onOpen: () => void;
}) {
  const hasItems = step.items.length > 0;

  return (
    <TiltedCard className="h-full">
      <article className="group relative flex h-full flex-col rounded-[1.45rem] bg-[#101218] p-5 shadow-[0_24px_60px_rgba(16,18,24,0.18)] ring-1 ring-accent/35 transition-[box-shadow,ring-color] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:ring-accent sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-[family-name:var(--font-display)] text-[clamp(1.55rem,2.4vw,1.95rem)] font-medium leading-[0.95] tracking-[-0.04em] text-white">
            {step.title}
          </h3>
          <button
            type="button"
            onClick={onOpen}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/8 text-white ring-1 ring-white/12 transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-accent active:scale-[0.97]"
            aria-label={step.title}
          >
            <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-px group-hover:-translate-y-px" />
          </button>
        </div>

        <div className="mt-4 h-px w-full bg-white/12" aria-hidden />

        <p className="mt-4 text-[0.88rem] leading-relaxed text-white/65">
          {step.text}
        </p>

        {hasItems ? (
          <ul className="mt-auto pt-5">
            {step.items.map((item) => (
              <li
                key={item}
                className="border-t border-white/12 py-3 text-[0.88rem] leading-snug text-white/82 first:border-t-0 first:pt-0 last:pb-0"
              >
                {item}
              </li>
            ))}
          </ul>
        ) : null}
      </article>
    </TiltedCard>
  );
}

export function ProcessSection() {
  const { t } = useI18n();
  const { openConversation } = useConversation();
  const reduce = useReducedMotion();
  const steps = t.process.steps;

  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="site-block relative overflow-hidden"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        aria-hidden
      >
        <div className="absolute -right-[18%] top-[8%] h-[34rem] w-[34rem] rounded-full border border-accent/25" />
        <div className="absolute -right-[8%] top-[18%] h-[22rem] w-[22rem] rounded-full border border-accent/15" />
        <div className="absolute -left-24 bottom-[-20%] h-[28rem] w-[28rem] rounded-full bg-accent/8 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[90rem] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(16rem,0.78fr)_minmax(0,1.55fr)] lg:gap-12 xl:gap-16">
          <ScrollReveal>
            <header className="lg:sticky lg:top-28">
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.35em] text-accent">
                {t.process.kicker}
              </p>
              <h2
                id="process-heading"
                className="mt-4 max-w-[16ch] font-[family-name:var(--font-display)] text-[clamp(2.1rem,4.2vw,3.6rem)] font-medium leading-[0.88] tracking-[-0.05em] text-foreground text-balance"
              >
                {t.process.heading}
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-neutral-600">
                {t.process.body}
              </p>
              <button
                type="button"
                onClick={openConversation}
                className="group mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-foreground pl-6 pr-1.5 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-white transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-accent active:scale-[0.97]"
              >
                {t.projects.requestQuote}
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/12 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-px group-hover:-translate-y-px">
                  <ArrowIcon className="h-3.5 w-3.5" />
                </span>
              </button>
            </header>
          </ScrollReveal>

          <ScrollReveal blur={reduce ? 0 : 8} y={reduce ? 0 : 22}>
            <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              {steps.map((step) => (
                <li key={step.title}>
                  <ProcessCard step={step} onOpen={openConversation} />
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
