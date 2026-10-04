"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  type MotionValue,
  useReducedMotion,
  useSpring,
  useVelocity,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Magnetic } from "@/components/Magnetic";
import { ScrollReveal } from "@/components/reactbits/ScrollReveal";
import { useConversation } from "@/components/conversation/ConversationProvider";
import { projects, wideImage, type ProjectId } from "@/content/projects";
import { useI18n } from "@/i18n/provider";

/** One showcase capture per service column (same order as process.steps). */
const PREVIEW_IDS: ProjectId[] = ["panorama", "dvd", "golden", "vojta"];

const followSpring = { stiffness: 380, damping: 32, mass: 0.5 };

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

/** Floating screenshot that trails the cursor while a column is hovered. */
function HoverPreview({
  index,
  x,
  y,
}: {
  index: number | null;
  x: MotionValue<number>;
  y: MotionValue<number>;
}) {
  const { t } = useI18n();
  const velocity = useVelocity(x);
  const rotate = useTransform(velocity, [-1500, 0, 1500], [-8, 0, 8], {
    clamp: true,
  });

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[120] hidden [@media(hover:hover)_and_(pointer:fine)]:block"
      style={{ x, y, rotate }}
    >
      <AnimatePresence>
        {index !== null ? (
          <motion.div
            key={index}
            className="absolute left-6 top-6 h-[11.5rem] w-[18rem] overflow-hidden rounded-xl bg-[#0f1115] shadow-[0_30px_70px_rgba(16,18,24,0.35)] ring-1 ring-black/10"
            initial={{ opacity: 0, scale: 0.85, clipPath: "inset(100% 0 0 0)" }}
            animate={{ opacity: 1, scale: 1, clipPath: "inset(0% 0 0 0)" }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
          >
            {(() => {
              const project = projects.find(
                (p) => p.id === PREVIEW_IDS[index],
              );
              if (!project) return null;
              return (
                <>
                  <Image
                    src={wideImage(project)}
                    alt=""
                    fill
                    sizes="18rem"
                    className="object-cover object-top"
                  />
                  <span className="absolute bottom-2 left-2 inline-flex h-6 items-center rounded-full bg-white px-2.5 text-[0.65rem] font-medium text-foreground">
                    {project.title}
                  </span>
                </>
              );
            })()}
          </motion.div>
        ) : null}
      </AnimatePresence>
      <span className="sr-only">{t.process.kicker}</span>
    </motion.div>
  );
}

export function ServicesSection() {
  const { t } = useI18n();
  const { openConversation } = useConversation();
  const reduce = useReducedMotion();
  const steps = t.process.steps;
  const [hovered, setHovered] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const fine = useRef(false);
  const x = useSpring(0, followSpring);
  const y = useSpring(0, followSpring);

  useEffect(() => {
    setMounted(true);
    fine.current = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
  }, []);

  const interactive = () => fine.current && !reduce;

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
              <Magnetic strength={0.35}>
                <button
                  type="button"
                  onClick={openConversation}
                  className="group inline-flex items-center gap-2 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-foreground transition-colors hover:text-accent"
                >
                  {t.projects.requestQuote}
                  <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px" />
                </button>
              </Magnetic>
            </div>
          </header>
        </ScrollReveal>

        <ul
          className="group/list mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4"
          onMouseLeave={() => setHovered(null)}
        >
          {steps.map((step, index) => (
            <li
              key={step.title}
              onMouseEnter={(event) => {
                if (!interactive()) return;
                if (hovered === null) {
                  x.jump(event.clientX);
                  y.jump(event.clientY);
                }
                setHovered(index);
              }}
              onMouseMove={(event) => {
                if (!interactive()) return;
                x.set(event.clientX);
                y.set(event.clientY);
              }}
              className="transition-opacity duration-500 [@media(hover:hover)]:group-hover/list:opacity-45 [@media(hover:hover)]:hover:!opacity-100"
            >
              <ScrollReveal blur={0} y={20} delay={index * 0.06}>
                <article className="group relative pt-5">
                  {/* Top rule fills with accent on hover. */}
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-px bg-foreground/15"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-accent transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-x-100"
                  />
                  <p className="relative h-4 overflow-hidden text-[0.65rem] font-medium tabular-nums tracking-[0.2em] text-accent">
                    <span className="block transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-full">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="absolute left-0 top-full block transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-full">
                      <ArrowIcon className="h-3.5 w-3.5" />
                    </span>
                  </p>
                  <h3 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(1.45rem,2vw,1.75rem)] font-medium leading-[1] tracking-[-0.04em] text-foreground transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                    {step.text}
                  </p>
                  <ul className="mt-5">
                    {step.items
                      .filter((item) => item !== t.process.more)
                      .map((item, itemIndex) => (
                        <li
                          key={item}
                          className="flex items-center gap-2 border-t border-foreground/8 py-2.5 text-[0.92rem] text-foreground transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-2"
                          style={{ transitionDelay: `${itemIndex * 35}ms` }}
                        >
                          <span
                            aria-hidden
                            className="h-1 w-1 scale-0 rounded-full bg-accent transition-transform duration-300 group-hover:scale-100"
                            style={{ transitionDelay: `${itemIndex * 35}ms` }}
                          />
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
      {mounted && !reduce
        ? createPortal(<HoverPreview index={hovered} x={x} y={y} />, document.body)
        : null}
    </section>
  );
}
