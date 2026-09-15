"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ScrollReveal } from "@/components/reactbits/ScrollReveal";
import { useConversation } from "@/components/conversation/ConversationProvider";
import type { Dictionary } from "@/i18n/dictionary";
import { useI18n } from "@/i18n/provider";
import {
  motion,
  useInView,
  useMotionTemplate,
  useReducedMotion,
  useSpring,
  type SpringOptions,
} from "motion/react";
import { projects } from "@/content/projects";

const EASE = "cubic-bezier(0.23, 1, 0.32, 1)";

const followSpring: SpringOptions = {
  stiffness: 420,
  damping: 36,
  mass: 0.55,
};

type ProjectId = keyof Dictionary["projects"]["items"];

const projectImageById = Object.fromEntries(
  projects.map((project) => [project.id, project.image]),
) as Record<ProjectId, string>;

const SERVICE_SCREENS: ProjectId[][] = [
  ["panorama", "vojta", "sadia"],
  ["dvd", "laflare", "golden"],
  ["laflare", "doktor", "speed"],
  ["prevezem", "speed", "golden"],
];

const COLLIDE = [
  "sm:translate-x-[46%] sm:translate-y-[42%]",
  "sm:-translate-x-[46%] sm:translate-y-[42%]",
  "sm:translate-x-[46%] sm:-translate-y-[42%]",
  "sm:-translate-x-[46%] sm:-translate-y-[42%]",
] as const;

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
  screens,
  learnMore,
  open,
  delay,
  onOpen,
}: {
  step: Dictionary["process"]["steps"][number];
  screens: Array<{ src: string; alt: string }>;
  learnMore: string;
  open: boolean;
  delay: number;
  onOpen: () => void;
}) {
  const reduce = useReducedMotion();
  const finePointer = useRef(false);
  const [mounted, setMounted] = useState(false);
  const x = useSpring(0, followSpring);
  const y = useSpring(0, followSpring);
  const followOpacity = useSpring(0, followSpring);
  const followTransform = useMotionTemplate`translate3d(${x}px, ${y}px, 0) translate(14px, 10px)`;
  const hasItems = step.items.length > 0;

  useEffect(() => {
    setMounted(true);
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => {
      finePointer.current = media.matches;
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const track = (event: React.MouseEvent<HTMLElement>) => {
    if (reduce || !finePointer.current) return;
    x.set(event.clientX);
    y.set(event.clientY);
  };

  const showFollow = (event: React.MouseEvent<HTMLElement>) => {
    if (reduce || !finePointer.current) return;
    x.jump(event.clientX);
    y.jump(event.clientY);
    followOpacity.set(1);
  };

  return (
    <article
      onMouseEnter={showFollow}
      onMouseMove={track}
      onMouseLeave={() => followOpacity.set(0)}
      onClick={(event) => {
        if (!finePointer.current) return;
        if ((event.target as HTMLElement).closest("button")) return;
        onOpen();
      }}
      className="group relative flex flex-col rounded-[1.45rem] bg-[#101218] p-5 shadow-[0_24px_60px_rgba(16,18,24,0.18)] ring-1 ring-accent/35 transition-[box-shadow,ring-color] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:ring-accent sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-[family-name:var(--font-display)] text-[clamp(1.55rem,2.4vw,1.95rem)] font-medium leading-[0.95] tracking-[-0.04em] text-white">
          {step.title}
        </h3>
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md bg-white/8 text-white ring-1 ring-white/12 transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-accent active:scale-[0.97]"
          aria-label={learnMore}
        >
          <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-px group-hover:-translate-y-px" />
        </button>
      </div>

      <div className="mt-4 h-px w-full bg-white/12" aria-hidden />

      <p className="mt-4 text-[0.88rem] leading-relaxed text-white/65">
        {step.text}
      </p>

      {hasItems ? (
        <div
          className={`grid transition-[grid-template-rows,opacity,margin] duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:mt-5 motion-reduce:grid-rows-[1fr] motion-reduce:opacity-100 ${
            open
              ? "mt-5 grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
          style={{ transitionDelay: open ? `${delay}ms` : "0ms" }}
        >
          <div className="min-h-0 overflow-hidden">
            <ul>
              {step.items.map((item) => (
                <li
                  key={item}
                  className="border-t border-white/12 py-3 text-[0.88rem] leading-snug text-white/82 first:border-t-0 first:pt-0 last:pb-0"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      {screens.length > 0 ? (
        <div className="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity,margin] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:mt-5 group-hover:grid-rows-[1fr] group-hover:opacity-100 group-focus-within:mt-5 group-focus-within:grid-rows-[1fr] group-focus-within:opacity-100 motion-reduce:mt-5 motion-reduce:grid-rows-[1fr] motion-reduce:opacity-100 [@media(hover:none)]:mt-5 [@media(hover:none)]:grid-rows-[1fr] [@media(hover:none)]:opacity-100">
          <div className="min-h-0 overflow-hidden">
            <ul className="grid grid-cols-3 gap-1.5">
              {screens.map((screen) => (
                <li
                  key={screen.src}
                  className="relative aspect-[4/3] overflow-hidden rounded-lg bg-white/6"
                >
                  <Image
                    src={screen.src}
                    alt={screen.alt}
                    fill
                    sizes="(max-width: 768px) 30vw, 180px"
                    className="object-cover object-top"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      {mounted
        ? createPortal(
            <motion.div
              aria-hidden
              className="pointer-events-none fixed top-0 left-0 z-[140] hidden [@media(hover:hover)_and_(pointer:fine)]:block"
              style={{ transform: followTransform, opacity: followOpacity }}
            >
              <span className="inline-flex h-10 items-center gap-2 rounded-full bg-accent px-4 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-white shadow-[0_10px_28px_rgba(31,94,255,0.45)]">
                <ArrowIcon className="h-3 w-3" />
                {learnMore}
              </span>
            </motion.div>,
            document.body,
          )
        : null}
    </article>
  );
}

export function ProcessSection() {
  const { t } = useI18n();
  const { openConversation } = useConversation();
  const reduce = useReducedMotion();
  const gridRef = useRef<HTMLUListElement>(null);
  const inView = useInView(gridRef, { once: true, amount: 0.28, margin: "-8% 0px" });
  const spread = Boolean(reduce) || inView;
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

          <ul
            ref={gridRef}
            className="grid items-start gap-3 sm:grid-cols-2 sm:gap-4"
          >
            {steps.map((step, index) => {
              const delay = reduce ? 0 : index * 90;
              return (
                <li
                  key={step.title}
                  className={`transition-transform duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transform-none ${
                    spread ? "translate-x-0 translate-y-0" : COLLIDE[index]
                  }`}
                  style={{
                    zIndex: spread ? 1 : 4 - index,
                    transitionDelay: spread ? `${delay}ms` : "0ms",
                    transitionTimingFunction: EASE,
                  }}
                >
                  <ProcessCard
                    step={step}
                    open={spread}
                    delay={delay + 120}
                    learnMore={t.process.learnMore}
                    onOpen={openConversation}
                    screens={SERVICE_SCREENS[index].map((id) => ({
                      src: projectImageById[id] ?? `/projects/${id}.webp`,
                      alt: t.projects.items[id].alt,
                    }))}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
