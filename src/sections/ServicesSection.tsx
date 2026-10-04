"use client";

import { ScrollReveal } from "@/components/reactbits/ScrollReveal";
import { useConversation } from "@/components/conversation/ConversationProvider";
import { useI18n } from "@/i18n/provider";

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden
    >
      <path d="M4 12 12 4M6.5 4H12v5.5" />
    </svg>
  );
}

export function ServicesSection() {
  const { t } = useI18n();
  const { openConversation } = useConversation();
  const steps = t.process.steps;

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="site-block"
    >
      <div className="mx-auto max-w-[90rem] px-4 py-14 sm:px-8 lg:px-10 lg:py-20">
        <ScrollReveal>
          <header className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end">
            <div>
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.35em] text-accent">
                {t.process.kicker}
              </p>
              <h2
                id="services-heading"
                className="mt-4 font-[family-name:var(--font-display)] text-[clamp(2.1rem,4.6vw,3.9rem)] font-medium leading-[0.9] tracking-[-0.05em] text-foreground"
              >
                {t.process.heading}
              </h2>
            </div>
            <div className="flex flex-col items-start gap-5">
              <p className="max-w-md text-sm leading-relaxed text-neutral-600 sm:text-base">
                {t.process.body}
              </p>
              <button
                type="button"
                onClick={openConversation}
                className="group inline-flex items-center gap-2 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-foreground transition-colors hover:text-accent"
              >
                {t.projects.requestQuote}
                <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px" />
              </button>
            </div>
          </header>
        </ScrollReveal>

        <ul className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title}>
              <ScrollReveal blur={0} y={20} delay={index * 0.06}>
                <article className="border-t border-foreground/15 pt-5">
                  <p className="text-[0.65rem] font-medium tabular-nums tracking-[0.2em] text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(1.45rem,2vw,1.75rem)] font-medium leading-[1] tracking-[-0.04em] text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                    {step.text}
                  </p>
                  <ul className="mt-5">
                    {step.items
                      .filter((item) => item !== t.process.more)
                      .map((item) => (
                        <li
                          key={item}
                          className="border-t border-foreground/8 py-2.5 text-[0.92rem] text-foreground"
                        >
                          {item}
                        </li>
                      ))}
                  </ul>
                </article>
              </ScrollReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
