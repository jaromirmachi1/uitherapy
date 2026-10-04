"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, [data-cursor="interactive"]';
const LABEL_SELECTOR = "[data-cursor-label]";

/**
 * Dot + lagging ring cursor.
 * - Grows over anything interactive.
 * - Over `[data-cursor-label="…"]` the ring morphs into a filled accent
 *   disc carrying that label (used on project tiles and CTAs).
 */
export function InteractiveCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const trailRefs = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!finePointer || reduceMotion) return;

    const root = rootRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    const trails = trailRefs.current;
    if (!root || !dot || !ring || !label) return;

    document.documentElement.classList.add("has-interactive-cursor");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf = 0;
    let active = false;
    let labelled = false;

    const render = () => {
      // Labelled disc follows more tightly so the text stays readable.
      const ease = labelled ? 0.24 : 0.18;
      ringX += (mouseX - ringX) * ease;
      ringY += (mouseY - ringY) * ease;

      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${
        labelled ? 1 : active ? 1.65 : 1
      })`;

      trails.forEach((trail, index) => {
        const lag = (index + 1) * 0.075;
        const x = mouseX + (ringX - mouseX) * lag;
        const y = mouseY + (ringY - mouseY) * lag;
        trail.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${
          active ? 0.75 : 1
        })`;
      });

      raf = requestAnimationFrame(render);
    };

    const sync = (target: EventTarget | null) => {
      const el = target instanceof Element ? target : null;
      const labelHost = el?.closest<HTMLElement>(LABEL_SELECTOR) ?? null;
      const text = labelHost?.dataset.cursorLabel ?? "";
      active = Boolean(el?.closest(INTERACTIVE_SELECTOR));
      labelled = text.length > 0;
      if (labelled) label.textContent = text;
      root.dataset.active = String(active);
      root.dataset.label = String(labelled);
    };

    const move = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      root.style.opacity = "1";
    };

    const over = (event: MouseEvent) => sync(event.target);
    const out = (event: MouseEvent) => {
      if (!event.relatedTarget) sync(null);
    };
    const leave = () => {
      root.style.opacity = "0";
      sync(null);
    };

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    document.addEventListener("mouseleave", leave);
    raf = requestAnimationFrame(render);

    return () => {
      document.documentElement.classList.remove("has-interactive-cursor");
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
      document.removeEventListener("mouseleave", leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="interactive-cursor pointer-events-none fixed inset-0 z-[130] hidden opacity-0 transition-opacity duration-300 lg:block"
      aria-hidden
    >
      <span
        ref={dotRef}
        className="cursor-dot absolute left-0 top-0 h-2 w-2 rounded-full bg-accent shadow-[0_0_18px_rgba(31,94,255,0.95)] transition-opacity duration-200"
      />
      <span
        ref={ringRef}
        className="cursor-ring absolute left-0 top-0 flex h-11 w-11 items-center justify-center rounded-full border border-foreground/40"
      >
        <span
          ref={labelRef}
          className="cursor-label whitespace-nowrap text-[0.62rem] font-medium uppercase tracking-[0.16em] text-white"
        />
      </span>
      {[0, 1, 2].map((item) => (
        <span
          key={item}
          ref={(node) => {
            if (node) trailRefs.current[item] = node;
          }}
          className="cursor-trail absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-accent/70 blur-[1px] transition-opacity duration-200"
          style={{ opacity: 0.48 - item * 0.12 }}
        />
      ))}
    </div>
  );
}
