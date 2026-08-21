"use client";

import { FluidCursor } from "@/components/FluidCursor";
import { useI18n } from "@/i18n/provider";
import { motion, useReducedMotion } from "motion/react";

export function RingStatementSection() {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const proof = t.hero.proof;

  return (
    <section
      aria-labelledby="hero-heading"
      className="site-block relative isolate min-h-[calc(100dvh-3rem)] overflow-hidden"
    >
      <FluidCursor intensity={0.42} />

      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--background)_48%,transparent)_0%,color-mix(in_srgb,var(--background)_12%,transparent)_42%,color-mix(in_srgb,var(--background)_58%,transparent)_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.16]"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(color-mix(in srgb, var(--foreground) 35%, transparent) 0.6px, transparent 0.7px)",
          backgroundSize: "18px 18px",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-[72rem] flex-col items-center justify-center px-6 py-28 text-center sm:px-8">
        <motion.ul
          className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-foreground"
          aria-label={t.hero.proofLabel}
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {proof.map((item, index) => (
            <li key={item} className="flex items-center gap-3">
              {index > 0 ? (
                <span className="h-1 w-1 rounded-full bg-accent" aria-hidden />
              ) : null}
              {item}
            </li>
          ))}
        </motion.ul>

        <h1
          id="hero-heading"
          data-gsap="reveal"
          className="mt-10 max-w-[18ch] font-[family-name:var(--font-display)] text-[clamp(3.4rem,8.4vw,7.6rem)] font-medium leading-[0.86] tracking-[-0.055em] text-foreground"
        >
          <motion.span
            className="block"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.85,
              delay: reduceMotion ? 0 : 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {t.hero.heading}
          </motion.span>
        </h1>

        <motion.p
          className="mt-10 max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.75,
            delay: reduceMotion ? 0 : 0.22,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {t.hero.body}
        </motion.p>
      </div>
    </section>
  );
}
