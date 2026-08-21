"use client";

import { GradientWaves } from "@/components/GradientWaves";
import { ScrollStack } from "@/components/reactbits/ScrollStack";
import type { Dictionary } from "@/i18n/dictionary";
import { useI18n } from "@/i18n/provider";
import { useReducedMotion } from "motion/react";
import { useRef } from "react";

export function ProcessSection() {
  const { t } = useI18n();
  const steps = t.process.steps;
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const trackHeight = `${Math.max(steps.length, 1) * 100}dvh`;

  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="relative"
    >
      <div
        ref={trackRef}
        className="relative"
        style={{ height: reduceMotion ? undefined : trackHeight }}
      >
        <div className="sticky top-0 flex h-dvh w-full flex-col motion-reduce:relative motion-reduce:h-auto motion-reduce:min-h-dvh">
          <GradientWaves
            className="z-0"
            horizonColor="#e8e8e8"
            waveColor="#1f5eff"
            crestColor="#ffffff"
            speed={0.38}
            opacity={0.92}
            brightness={1.22}
            fogDepth={24}
            amplitude={3.1}
            detail="medium"
          />

          <div className="relative z-1 flex min-h-0 flex-1 flex-col px-6 py-16 sm:px-10 md:px-16 md:py-14 lg:px-20">
            <header className="mx-auto w-full max-w-4xl shrink-0 text-center">
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.35em] text-accent">
                {t.process.kicker}
              </p>
              <h2
                id="process-heading"
                className="mt-5 font-[family-name:var(--font-display)] text-[clamp(2.4rem,5.4vw,4.6rem)] font-medium leading-[0.88] tracking-[-0.055em] text-foreground"
              >
                {t.process.heading}
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-neutral-600 sm:text-base">
                {t.process.body}
              </p>
            </header>

            <ScrollStack
              trackRef={trackRef}
              peek={26}
              scaleStep={0.07}
              blur={4}
              dim={0.28}
              smooth={0.18}
              depth={3}
              cardWidth={880}
              borderRadius={22}
              showProgress
              showCounter
              className="mt-8"
            >
              {steps.map((step, index) => (
                <ProcessCard key={step.title} step={step} index={index} />
              ))}
            </ScrollStack>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessCard({
  step,
  index,
}: {
  step: Dictionary["process"]["steps"][number];
  index: number;
}) {
  const n = String(index + 1).padStart(2, "0");

  return (
    <div className="flex h-full min-h-0 flex-col md:grid md:grid-cols-[1.05fr_0.95fr]">
      <div className="relative min-h-40 flex-1 overflow-hidden bg-[#f1f1f1] md:min-h-0">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(color-mix(in srgb, var(--foreground) 40%, transparent) 0.7px, transparent 0.8px)",
            backgroundSize: "14px 14px",
          }}
        />
        <span
          className="pointer-events-none absolute right-4 top-2 font-[family-name:var(--font-display)] text-[clamp(4rem,8vw,6.5rem)] font-medium leading-none tracking-[-0.08em] text-foreground/6"
          aria-hidden
        >
          {n}
        </span>
        <StepIllustration index={index} />
      </div>

      <div className="flex flex-1 flex-col justify-end px-6 py-6 sm:px-8 sm:py-8">
        <p className="text-[0.62rem] font-medium uppercase tracking-[0.28em] text-accent">
          {step.label}
        </p>
        <h3 className="mt-2 font-[family-name:var(--font-display)] text-[clamp(1.85rem,3.4vw,2.7rem)] font-medium leading-[0.94] tracking-[-0.04em] text-foreground">
          {step.title}
        </h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-neutral-600 sm:text-base">
          {step.text}
        </p>
      </div>
    </div>
  );
}

function StepIllustration({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className="absolute inset-0 flex items-center px-8 md:px-12" aria-hidden>
        <div className="flex w-full flex-col gap-2.5">
          <span className="h-2.5 w-[72%] rounded-full bg-foreground/80" />
          <span className="ml-6 h-2.5 w-[62%] rounded-full bg-accent" />
          <span className="ml-3 h-2.5 w-[78%] rounded-full bg-foreground/55" />
        </div>
      </div>
    );
  }

  if (index === 1) {
    return (
      <div className="absolute inset-0 grid grid-cols-3 gap-2 p-7 md:p-10" aria-hidden>
        {Array.from({ length: 9 }, (_, i) => (
          <span
            key={i}
            className={`rounded-md ${
              i === 4 ? "bg-accent" : "border border-foreground/15 bg-white/70"
            }`}
          />
        ))}
      </div>
    );
  }

  if (index === 2) {
    return (
      <div className="absolute inset-0" aria-hidden>
        <span className="absolute left-8 top-8 h-20 w-20 rounded-2xl bg-foreground/90 md:h-28 md:w-28" />
        <span className="absolute bottom-8 right-10 h-24 w-24 rounded-2xl bg-accent/90 md:h-32 md:w-32" />
        <span className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-foreground/20 bg-white/80 md:h-20 md:w-20" />
      </div>
    );
  }

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      aria-hidden
    >
      <span className="absolute h-28 w-28 rounded-full border border-foreground/15 md:h-40 md:w-40" />
      <span className="absolute h-20 w-20 rounded-full border border-accent/40 md:h-28 md:w-28" />
      <span className="h-8 w-8 rounded-full bg-accent md:h-10 md:w-10" />
    </div>
  );
}
