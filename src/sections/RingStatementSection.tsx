"use client";

import Script from "next/script";
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
      aria-labelledby="ring-statement-heading"
      className="relative isolate min-h-dvh overflow-hidden border-b border-accent/12 bg-black"
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

      <div
        className="absolute inset-0 z-0 min-h-0 opacity-90"
        aria-hidden
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.22),transparent_40%)]" />
        <spline-viewer
          ref={viewerRef}
          url={SPLINE_SCENE_URL}
          className="block h-full w-full min-h-dvh"
          style={{ width: "100%", height: "100%", display: "block" }}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.2)_42%,rgba(0,0,0,0.86)_78%)]" />

      <div className="relative z-20 mx-auto flex min-h-dvh max-w-4xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-10">
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.35em] text-accent/80">
          Interface therapy
        </p>
        <h2
          id="ring-statement-heading"
          className="mt-5 font-(family-name:--font-display) text-[clamp(2.5rem,8vw,6.25rem)] font-bold leading-[0.9] tracking-[-0.055em] text-white"
        >
          Calm structure.
          <span className="block text-outline">Liquid motion.</span>
        </h2>
        <p className="mt-8 max-w-xl text-sm leading-relaxed text-neutral-400 sm:text-base">
          A blank-stage moment for the brand: premium visuals, readable content,
          and motion that supports the message instead of stealing it.
        </p>
      </div>
    </section>
  );
}
