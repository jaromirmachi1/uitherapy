"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, [data-cursor="interactive"]';

export function InteractiveCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduceMotion) return;

    const root = rootRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const trails = trailRefs.current;
    if (!root || !dot || !ring) return;

    document.documentElement.classList.add("has-interactive-cursor");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf = 0;
    let active = false;

    const render = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${
        active ? 1.65 : 1
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

    const move = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      root.style.opacity = "1";
    };

    const setActive = (value: boolean) => {
      active = value;
      root.dataset.active = String(value);
    };

    const over = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest(INTERACTIVE_SELECTOR)) setActive(true);
    };

    const out = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest(INTERACTIVE_SELECTOR)) setActive(false);
    };

    const leave = () => {
      root.style.opacity = "0";
      setActive(false);
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
      className="interactive-cursor pointer-events-none fixed inset-0 z-[130] hidden opacity-0 mix-blend-difference transition-opacity duration-300 lg:block"
      aria-hidden
    >
      <span
        ref={dotRef}
        className="absolute left-0 top-0 h-2 w-2 rounded-full bg-white shadow-[0_0_18px_rgba(82,38,255,0.95)]"
      />
      <span
        ref={ringRef}
        className="absolute left-0 top-0 h-11 w-11 rounded-full border border-white/70 transition-[border-color,background-color] duration-200"
      />
      {[0, 1, 2].map((item) => (
        <span
          key={item}
          ref={(node) => {
            if (node) trailRefs.current[item] = node;
          }}
          className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-accent/70 opacity-60 blur-[1px]"
          style={{ opacity: 0.48 - item * 0.12 }}
        />
      ))}
    </div>
  );
}
