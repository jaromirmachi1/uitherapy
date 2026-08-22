"use client";

import { ScrollReveal } from "@/components/reactbits/ScrollReveal";
import { ScrollStack } from "@/components/reactbits/ScrollStack";
import type { Dictionary } from "@/i18n/dictionary";
import { useI18n } from "@/i18n/provider";
import { motion, useReducedMotion } from "motion/react";
import { useRef } from "react";

export function ProcessSection() {
  const { t } = useI18n();
  const steps = t.process.steps;
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const trackHeight = `${100 + Math.max(steps.length - 1, 0) * 40}dvh`;

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
          <div className="relative z-1 flex min-h-0 flex-1 flex-col px-6 py-16 sm:px-10 md:px-16 md:py-14 lg:px-20">
            <ScrollReveal className="mx-auto w-full max-w-4xl shrink-0 text-center">
              <header>
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
            </ScrollReveal>

            <ScrollStack
              trackRef={trackRef}
              peek={26}
              scaleStep={0.07}
              blur={0}
              dim={0.32}
              smooth={0.22}
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
  return (
    <div className="flex h-full min-h-0 flex-col md:grid md:grid-cols-[1.05fr_0.95fr]">
      <div className="relative min-h-40 flex-1 overflow-hidden bg-[#f7f7f7] md:min-h-0">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(color-mix(in srgb, var(--foreground) 40%, transparent) 0.7px, transparent 0.8px)",
            backgroundSize: "14px 14px",
          }}
        />
        <StepMotion index={index} />
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

function StepMotion({ index }: { index: number }) {
  const reduce = useReducedMotion();

  if (index === 0) {
    return (
      <div className="absolute inset-0 flex items-center px-8 md:px-12" aria-hidden>
        <div className="flex w-full flex-col gap-3">
          {[0.72, 0.58, 0.8].map((width, i) => (
            <motion.span
              key={i}
              className="h-2.5 rounded-full bg-accent origin-left"
              style={{ width: `${width * 100}%`, marginLeft: i === 1 ? "1.5rem" : i === 2 ? "0.75rem" : 0 }}
              initial={reduce ? false : { scaleX: 0.35, opacity: 0.45 }}
              animate={
                reduce
                  ? undefined
                  : {
                      scaleX: [0.35, 1, 0.72, 1],
                      opacity: [0.45, 1, 0.7, 1],
                    }
              }
              transition={{
                duration: 3.2,
                delay: i * 0.22,
                repeat: Infinity,
                ease: [0.45, 0, 0.2, 1],
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (index === 1) {
    return (
      <div className="absolute inset-0 grid grid-cols-3 gap-2.5 p-7 md:p-10" aria-hidden>
        {Array.from({ length: 9 }, (_, i) => {
          const accent = i === 4 || i === 1 || i === 7;
          return (
            <motion.span
              key={i}
              className={`rounded-lg ${
                accent
                  ? "bg-accent"
                  : "border border-accent/25 bg-accent/10"
              }`}
              initial={reduce ? false : { scale: 0.7, opacity: 0.35 }}
              animate={
                reduce
                  ? undefined
                  : {
                      scale: accent ? [0.85, 1.06, 0.92, 1] : [0.92, 1, 0.96, 1],
                      opacity: accent ? [0.55, 1, 0.75, 1] : [0.35, 0.7, 0.45, 0.65],
                    }
              }
              transition={{
                duration: 2.8,
                delay: (i % 3) * 0.12 + Math.floor(i / 3) * 0.08,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </div>
    );
  }

  if (index === 2) {
    return (
      <div className="absolute inset-0" aria-hidden>
        <motion.span
          className="absolute left-[12%] top-[14%] h-20 w-20 rounded-2xl bg-accent md:h-28 md:w-28"
          animate={
            reduce
              ? undefined
              : { y: [0, -10, 0], rotate: [0, -4, 0], borderRadius: ["1rem", "1.5rem", "1rem"] }
          }
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          className="absolute bottom-[12%] right-[12%] h-24 w-24 rounded-2xl bg-accent/75 md:h-32 md:w-32"
          animate={
            reduce
              ? undefined
              : { y: [0, 12, 0], rotate: [0, 5, 0], borderRadius: ["1.25rem", "2rem", "1.25rem"] }
          }
          transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        />
        <motion.span
          className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-accent/50 bg-white/80 md:h-20 md:w-20"
          animate={reduce ? undefined : { scale: [1, 1.08, 1], rotate: [0, 8, 0] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 0.35 }}
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
      <motion.span
        className="absolute h-32 w-32 rounded-full border border-accent/25 md:h-44 md:w-44"
        animate={reduce ? undefined : { scale: [1, 1.12, 1], opacity: [0.35, 0.7, 0.35] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        className="absolute h-24 w-24 rounded-full border-2 border-accent/55 md:h-28 md:w-28"
        animate={reduce ? undefined : { scale: [1.05, 0.92, 1.05], rotate: [0, 180, 360] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      <motion.span
        className="h-9 w-9 rounded-full bg-accent md:h-11 md:w-11"
        animate={reduce ? undefined : { scale: [1, 1.18, 1] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        className="absolute h-3 w-3 rounded-full bg-accent"
        animate={
          reduce
            ? undefined
            : {
                x: [0, 52, 0, -52, 0],
                y: [-48, 0, 48, 0, -48],
              }
        }
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
