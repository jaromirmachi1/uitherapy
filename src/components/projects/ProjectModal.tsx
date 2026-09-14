"use client";

import Image from "next/image";
import { useI18n } from "@/i18n/provider";
import type { ProjectEntry } from "@/content/projects";
import { useLenis } from "lenis/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

const EASE = [0.23, 1, 0.32, 1] as const;
const SHEET = [0.32, 0.72, 0, 1] as const;

const objectClass = {
  top: "object-top",
  center: "object-center",
  bottom: "object-bottom",
} as const;

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

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden
    >
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}

export function ProjectModal({
  project,
  onClose,
}: {
  project: ProjectEntry | null;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const [mounted, setMounted] = useState(false);
  const copy = project ? t.projects.items[project.id] : null;
  const isOpen = Boolean(project && copy);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;

    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    lenis?.stop();
    document.documentElement.classList.add("ut-dialog-open");
    document.body.classList.add("ut-loading");

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !panelRef.current) return;
      const nodes = panelRef.current.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("ut-dialog-open");
      document.body.classList.remove("ut-loading");
      lenis?.start();
      prev?.focus();
    };
  }, [isOpen, lenis, onClose]);

  if (!mounted) return null;

  const labels = t.projects.highlightLabels;
  const rest = project?.highlights.slice(1) ?? [];

  return createPortal(
    <AnimatePresence>
      {isOpen && project && copy ? (
        <motion.div
          className="fixed inset-0 z-[150] flex flex-col justify-end overflow-hidden"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.22, ease: EASE }}
        >
          <div
            className="absolute inset-0 bg-[#101218]/28"
            onClick={onClose}
            aria-hidden
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            data-lenis-prevent
            className="relative z-10 flex h-[calc(100svh-2.5rem)] w-full flex-col overflow-hidden rounded-t-[1.25rem] bg-white shadow-[0_-18px_60px_rgba(16,18,24,0.2)] sm:h-[calc(100svh-3.25rem)]"
            initial={reduce ? false : { opacity: 0, y: "10%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: "8%" }}
            transition={{ duration: reduce ? 0 : 0.32, ease: SHEET }}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 z-20 inline-flex h-11 w-11 items-center justify-center rounded-[0.85rem] bg-[#171717] text-white transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-accent active:scale-[0.97] sm:right-5 sm:top-5"
              aria-label={t.projects.close}
            >
              <CloseIcon className="h-4 w-4" />
            </button>

            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 left-1/2 z-20 inline-flex h-11 -translate-x-1/2 items-center gap-2 rounded-full bg-foreground px-5 text-[0.66rem] font-medium uppercase tracking-[0.16em] text-white transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-accent active:scale-[0.97] sm:bottom-5 sm:h-12 sm:px-6"
            >
              {t.projects.visitSite}
              <ArrowIcon className="h-3.5 w-3.5" />
              <span className="sr-only">{t.projects.newTab}</span>
            </a>

            <article className="min-h-0 flex-1 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch] pb-24">
              <div className="mx-auto max-w-[72rem] px-5 pt-16 text-center sm:px-10 sm:pt-20">
                <h2
                  id={titleId}
                  className="mx-auto max-w-[16ch] text-balance font-[family-name:var(--font-display)] text-[clamp(2.4rem,7vw,5.25rem)] font-medium leading-[0.9] tracking-[-0.04em] text-foreground"
                >
                  {project.title}
                </h2>
                <ul className="mt-5 flex flex-wrap justify-center gap-1.5">
                  {[copy.category, copy.location, project.year].map((tag) => (
                    <li
                      key={tag}
                      className="inline-flex h-7 items-center rounded-full bg-[#ececec] px-3 text-[0.68rem] tracking-[0.04em] text-foreground"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
                <p className="mx-auto mt-6 max-w-[62ch] text-[0.98rem] leading-relaxed tracking-[-0.015em] text-[#222222] sm:text-[1.05rem] sm:leading-[1.55]">
                  {copy.story || copy.summary}
                </p>
              </div>

              <section className="mx-auto mt-12 max-w-[88rem] px-4 sm:mt-16 sm:px-8">
                <h3 className="mb-6 font-[family-name:var(--font-display)] text-[clamp(1.3rem,2.6vw,1.85rem)] font-medium tracking-[-0.035em] text-foreground">
                  {t.projects.highlights}
                </h3>
                <ul className="grid gap-5">
                  {project.highlights.slice(0, 1).map((shot) => (
                    <li key={`${shot.kind}-lead`}>
                      <figure>
                        <span className="relative block aspect-[16/9] overflow-hidden rounded-[1rem] bg-[#111111] sm:rounded-[1.25rem]">
                          <Image
                            src={shot.src}
                            alt={`${copy.alt}. ${labels[shot.kind]}`}
                            fill
                            priority
                            className={`object-cover ${objectClass[shot.object ?? "center"]}`}
                            sizes="100vw"
                            quality={80}
                          />
                        </span>
                        <figcaption className="mt-3 px-1 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-foreground/70">
                          {labels[shot.kind]}
                        </figcaption>
                      </figure>
                    </li>
                  ))}
                  {rest.length > 0 ? (
                    <li>
                      <ul className="grid gap-5 sm:grid-cols-2">
                        {rest.map((shot) => (
                          <li
                            key={`${shot.kind}-${shot.src}-${shot.object}`}
                            className={shot.portrait ? "sm:col-span-2" : undefined}
                          >
                            <figure>
                              <span
                                className={`relative block overflow-hidden rounded-[1rem] bg-[#111111] sm:rounded-[1.25rem] ${
                                  shot.portrait
                                    ? "mx-auto aspect-[9/16] max-w-[14rem]"
                                    : "aspect-[16/10]"
                                }`}
                              >
                                <Image
                                  src={shot.src}
                                  alt={`${copy.alt}. ${labels[shot.kind]}`}
                                  fill
                                  className={`object-cover ${objectClass[shot.object ?? "center"]}`}
                                  sizes="(max-width: 640px) 100vw, 50vw"
                                  quality={75}
                                />
                              </span>
                              <figcaption className="mt-3 px-1 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-foreground/70">
                                {labels[shot.kind]}
                              </figcaption>
                            </figure>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ) : null}
                </ul>
              </section>

              <footer className="mx-auto mt-12 max-w-[72rem] px-5 sm:px-10">
                <p className="text-[0.62rem] font-medium uppercase tracking-[0.18em] text-neutral-400">
                  {t.projects.builtWith}
                </p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {project.tech.map((item) => (
                    <li
                      key={item}
                      className="inline-flex h-8 items-center rounded-full bg-[#ececec] px-3.5 text-[0.72rem] tracking-[0.04em] text-foreground"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </footer>
            </article>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
