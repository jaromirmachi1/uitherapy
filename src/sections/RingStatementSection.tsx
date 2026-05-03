"use client";

import GradualBlur from "@/components/reactbits/GradualBlur";
import Script from "next/script";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

const SPLINE_VIEWER_SCRIPT =
  "https://unpkg.com/@splinetool/viewer@1.12.90/build/spline-viewer.js";

const SPLINE_SCENE_URL =
  "https://prod.spline.design/FWDsjCwjzgt8nr1b/scene.splinecode";

function hideSplineViewerLogo(viewer: HTMLElement) {
  const root = viewer.shadowRoot;
  if (!root) return false;
  const logo = root.querySelector<HTMLElement>("#logo");
  if (!logo) return false;
  logo.style.display = "none";
  return true;
}

export function RingStatementSection() {
  const viewerRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const el = viewerRef.current;
    if (!el) return;

    let cancelled = false;
    const tryHide = () => !cancelled && hideSplineViewerLogo(el);

    tryHide();

    const onLoad = () => {
      tryHide();
      requestAnimationFrame(tryHide);
      setTimeout(tryHide, 0);
      setTimeout(tryHide, 400);
    };

    el.addEventListener("load-complete", onLoad);

    let detachObserver: (() => void) | undefined;
    const shadowPoll = window.setInterval(() => {
      if (!el.shadowRoot) return;
      clearInterval(shadowPoll);

      const root = el.shadowRoot;
      const obs = new MutationObserver(tryHide);
      obs.observe(root, { childList: true, subtree: true });
      detachObserver = () => obs.disconnect();

      tryHide();
    }, 50);

    return () => {
      cancelled = true;
      clearInterval(shadowPoll);
      detachObserver?.();
      el.removeEventListener("load-complete", onLoad);
    };
  }, []);

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate min-h-dvh overflow-hidden border-b border-accent/15 bg-black"
    >
      <Script
        type="module"
        src={SPLINE_VIEWER_SCRIPT}
        strategy="lazyOnload"
      />

      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(82,38,255,0.2),transparent_34%),radial-gradient(circle_at_50%_72%,rgba(168,85,247,0.12),transparent_28%)]"
        aria-hidden
      />

      <div className="absolute inset-0 z-0 min-h-0 opacity-90" aria-hidden>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.22),transparent_40%)]" />
        <spline-viewer
          ref={viewerRef}
          url={SPLINE_SCENE_URL}
          className="block h-full w-full min-h-dvh"
          style={{ width: "100%", height: "100%", display: "block" }}
        />
      </div>

      <GradualBlur
        preset="smooth"
        target="parent"
        zIndex={3}
        className="pointer-events-none"
      />

      <div className="pointer-events-none absolute inset-0 z-4 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.2)_42%,rgba(0,0,0,0.86)_78%)]" />

      <div className="pointer-events-none relative z-10 mx-auto flex min-h-dvh w-full max-w-[90rem] flex-col items-center justify-center px-4 pt-24 pb-12 sm:px-6 sm:pt-28 lg:px-10">
        <div className="relative w-full max-w-4xl text-center">
          <motion.div
            className="mx-auto mb-6 h-px w-full max-w-md origin-center bg-gradient-to-r from-transparent via-accent/55 to-transparent"
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
            className="font-(family-name:--font-display) text-[clamp(2.75rem,11vw,7.5rem)] font-bold leading-[0.92] tracking-[-0.04em] text-white"
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
              uitherapy
            </motion.span>
            <motion.span
              className="mt-1 block text-[clamp(1.2rem,3.85vw,2.85rem)] leading-[1.06] tracking-[-0.03em] text-outline sm:mt-2"
              initial={reduceMotion ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.85,
                delay: reduceMotion ? 0 : 0.18,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              we fix interfaces,
              <br />
              sadly not people
            </motion.span>
          </h1>
        </div>
      </div>
    </section>
  );
}
