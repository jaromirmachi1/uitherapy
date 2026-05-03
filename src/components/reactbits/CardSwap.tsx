"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

export type CardSwapItem = {
  title: string;
  eyebrow: string;
  description: string;
  points: readonly string[];
  image: {
    src: string;
    alt: string;
  };
};

type Props = {
  cards: readonly CardSwapItem[];
  intervalMs?: number;
};

const positions = [
  { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1, zIndex: 30 },
  { x: 42, y: 38, rotate: 2.5, scale: 0.965, opacity: 0.72, zIndex: 20 },
  { x: 84, y: 76, rotate: 5, scale: 0.93, opacity: 0.42, zIndex: 10 },
] as const;

export function CardSwap({ cards, intervalMs = 2800 }: Props) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  const ordered = useMemo(
    () =>
      cards.map((card, index) => ({
        card,
        index,
        offset: (index - active + cards.length) % cards.length,
      })),
    [active, cards],
  );

  useEffect(() => {
    if (paused || cards.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % cards.length);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [cards.length, intervalMs, paused]);

  const transition = reduceMotion
    ? { duration: 0 }
    : {
        type: "spring" as const,
        stiffness: 120,
        damping: 22,
        mass: 0.9,
      };

  return (
    <div
      className="relative min-h-[34rem] w-full max-w-[44rem] sm:min-h-[38rem]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-0">
        {ordered.map(({ card, index, offset }) => {
          const isActive = offset === 0;

          return (
            <motion.article
              key={card.title}
              className={`absolute left-0 top-0 flex min-h-[30rem] w-[min(92vw,28rem)] flex-col justify-between overflow-hidden rounded-[1.75rem] border border-white/10 bg-neutral-950/90 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.48)] transition-[border-color,background-color] duration-300 sm:min-h-[34rem] sm:w-[31rem] sm:p-6 lg:w-[34rem] ${
                isActive ? "border-accent/45 bg-neutral-950" : ""
              }`}
              animate={positions[offset] ?? positions[2]}
              transition={transition}
              aria-hidden={!isActive}
            >
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(82,38,255,0.24),transparent_38%)]"
                aria-hidden
              />
              <div className="relative">
                <div className="flex items-start justify-between gap-6">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-accent">
                    {card.eyebrow}
                  </p>
                  <span className="font-mono text-xs tracking-[0.24em] text-neutral-600">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="relative mt-6 aspect-[1.45] overflow-hidden rounded-2xl border border-white/10 bg-black">
                  <Image
                    src={card.image.src}
                    alt={card.image.alt}
                    fill
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 31rem, 34rem"
                    className="object-cover opacity-80 saturate-[0.85]"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"
                    aria-hidden
                  />
                  <div
                    className="absolute inset-x-4 bottom-4 h-10 rounded-xl border border-white/10 bg-black/45 backdrop-blur-md"
                    aria-hidden
                  />
                </div>

                <h3 className="mt-7 font-[family-name:var(--font-display)] text-[clamp(2.25rem,6.5vw,4rem)] font-bold leading-[0.92] tracking-[-0.055em] text-white">
                  {card.title}
                </h3>
                <p className="mt-5 max-w-md text-sm leading-[1.7] text-neutral-400 sm:text-base">
                  {card.description}
                </p>
              </div>

              <ul className="relative mt-8 grid gap-3 border-t border-white/10 pt-5">
                {card.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.24em] text-neutral-500"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_18px_rgba(82,38,255,0.85)]" />
                    {point}
                  </li>
                ))}
              </ul>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
