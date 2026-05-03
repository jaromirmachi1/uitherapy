"use client";

import dynamic from "next/dynamic";
import GradualBlur from "@/components/reactbits/GradualBlur";
import { HeroMotion } from "@/components/reactbits/HeroMotion";
import { ScrambledText } from "@/components/reactbits/ScrambledText";
import { motion, useReducedMotion } from "motion/react";

const Dither = dynamic(() => import("@/components/reactbits/Dither"), {
  ssr: false,
  loading: () => null,
});

export function HeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative min-h-dvh overflow-hidden border-b border-accent/15"
    >
      {!reduceMotion && (
        <div
          className="absolute inset-0 z-0 [&_canvas]:block [&_canvas]:h-full [&_canvas]:w-full"
          aria-hidden
        >
          <Dither
            waveColor={[0.32, 0.15, 1]}
            disableAnimation={false}
            enableMouseInteraction
            mouseRadius={0.4}
            colorNum={4}
            pixelSize={2}
            waveAmplitude={0.3}
            waveFrequency={3}
            waveSpeed={0.05}
          />
        </div>
      )}
      <GradualBlur
        preset="smooth"
        target="parent"
        zIndex={3}
        className="pointer-events-none"
      />
      <div className="pointer-events-none relative z-10 mx-auto flex min-h-dvh max-w-[90rem] flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-24 lg:px-10 lg:pb-32 lg:pt-32">
        <HeroMotion className="absolute left-4 top-28 max-w-[12rem] sm:left-6 lg:left-10 lg:top-32">
          <p className="text-[0.65rem] font-medium uppercase leading-relaxed tracking-[0.35em] text-accent/85">
            Frontend studio · Interfaces & systems
          </p>
        </HeroMotion>

        <div className="relative">
          <motion.div
            className="mb-6 h-px w-full max-w-md origin-left bg-gradient-to-r from-accent via-accent/50 to-transparent"
            aria-hidden
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{
              duration: 0.9,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
          <h1
            id="hero-heading"
            data-gsap="reveal"
            className="font-[family-name:var(--font-display)] text-[clamp(2.75rem,11vw,7.5rem)] font-bold leading-[0.92] tracking-[-0.04em] text-white"
          >
            <motion.span
              className="block"
              initial={reduceMotion ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.85,
                delay: reduceMotion ? 0 : 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              Therapy for
            </motion.span>
            <motion.span
              className="mt-1 block text-outline sm:mt-2"
              initial={reduceMotion ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.85,
                delay: reduceMotion ? 0 : 0.18,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              the interface.
            </motion.span>
          </h1>
          <HeroMotion className="mt-8 max-w-xl" delay={0.35}>
            <div data-gsap="reveal" data-gsap-delay="0.08">
              <ScrambledText
                text="We ship bold, production-grade front ends—typography, motion, and performance tuned like an instrument. Built to feel expensive in the hand and clear to crawlers."
                className="text-base leading-relaxed text-neutral-400 sm:text-lg"
              />
            </div>
          </HeroMotion>
          <HeroMotion
            className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center"
            delay={0.45}
          >
            <motion.a
              href="#projects"
              className="pointer-events-auto inline-flex h-14 min-w-[200px] items-center justify-center bg-accent px-8 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-[0_0_40px_-8px_rgba(82,38,255,0.35)] transition-colors hover:bg-accent-hover"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              View projects
            </motion.a>
            <motion.a
              href="#capabilities"
              className="pointer-events-auto inline-flex h-14 min-w-[200px] items-center justify-center border border-accent/40 px-8 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:border-accent hover:bg-accent/10"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              Capabilities
            </motion.a>
          </HeroMotion>
        </div>

        <HeroMotion
          className="mt-20 flex items-end justify-between gap-6 border-t border-accent/15 pt-8 text-[0.65rem] uppercase tracking-[0.25em] text-neutral-600"
          delay={0.55}
        >
          <span>Scroll</span>
          <span className="hidden text-right sm:block">
            Design systems · Next.js · Motion · A11y · SEO
          </span>
        </HeroMotion>
      </div>
    </section>
  );
}
