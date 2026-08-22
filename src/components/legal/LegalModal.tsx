"use client";

import { useI18n } from "@/i18n/provider";
import {
  legalEntityAddress,
  legalEntityIco,
  legalEntityName,
  siteEmail,
} from "@/seo/site";
import { useLenis } from "lenis/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLegal } from "./LegalProvider";

export function LegalModal() {
  const { isOpen, closeLegal } = useLegal();
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;

    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    lenis?.stop();
    document.documentElement.classList.add("ut-modal-open");
    document.body.classList.add("ut-loading");

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLegal();
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("ut-modal-open");
      document.body.classList.remove("ut-loading");
      lenis?.start();
      prev?.focus();
    };
  }, [closeLegal, isOpen, lenis]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          data-lenis-prevent
          className="fixed inset-0 z-[126] overflow-y-auto overscroll-contain bg-[#d7dbe6] touch-pan-y [-webkit-overflow-scrolling:touch]"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="pointer-events-none fixed inset-0 z-0 bg-[#d7dbe6] max-sm:min-h-[100dvh] sm:absolute"
            aria-hidden
          />

          <div className="relative z-10 flex min-h-[100dvh] flex-col max-sm:min-h-[100svh]">
            <div className="relative flex justify-end px-5 pt-5 sm:px-8 sm:pt-7">
              <button
                ref={closeRef}
                type="button"
                onClick={closeLegal}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md text-2xl leading-none text-foreground/70 transition-colors hover:bg-white/70 hover:text-foreground"
                aria-label={t.legal.close}
              >
                ×
              </button>
            </div>

            <motion.article
              className="relative mx-auto w-full max-w-2xl px-5 pb-[max(4rem,env(safe-area-inset-bottom))] sm:px-8"
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="rounded-[1.75rem] bg-white px-7 py-8 shadow-[0_24px_80px_rgba(43,43,43,0.08)] sm:px-10 sm:py-10">
                <header id="privacy-policy">
                  <p className="text-[0.62rem] font-medium uppercase tracking-[0.2em] text-neutral-400">
                    {t.legal.updated}
                  </p>
                  <h2
                    id={titleId}
                    className="mt-3 font-[family-name:var(--font-display)] text-[clamp(1.75rem,5vw,2.5rem)] font-medium leading-[0.95] tracking-[-0.04em] text-foreground"
                  >
                    {t.legal.title}
                  </h2>
                </header>

                <div className="mt-8 space-y-8">
                  {t.legal.sections.map((section) => (
                    <section key={section.title}>
                      <h3 className="text-[0.62rem] font-medium uppercase tracking-[0.2em] text-neutral-400">
                        {section.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-[0.9375rem]">
                        {section.body}
                      </p>
                    </section>
                  ))}
                </div>

                <footer className="mt-10 border-t border-black/10 pt-6 text-sm leading-relaxed text-neutral-600">
                  <p>{legalEntityName}</p>
                  <p className="mt-1">{legalEntityIco}</p>
                  <p className="mt-1">{legalEntityAddress}</p>
                  <p className="mt-3">
                    <a
                      href={`mailto:${siteEmail}`}
                      className="underline decoration-foreground/25 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                    >
                      {siteEmail}
                    </a>
                  </p>
                  <p className="mt-3">
                    <a
                      href="#privacy-policy"
                      className="text-[0.62rem] font-medium uppercase tracking-[0.18em] text-foreground transition-colors hover:text-accent"
                    >
                      {t.legal.entityLine.privacyLink}
                    </a>
                  </p>
                </footer>
              </div>
            </motion.article>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
