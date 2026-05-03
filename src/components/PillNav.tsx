"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const NAV = [
  { href: "#projects", label: "Projects" },
  { href: "#capabilities", label: "Lab" },
  { href: "#ecommerce", label: "E-shop" },
  { href: "#process", label: "Process" },
  { href: "#seo-growth", label: "SEO" },
  { href: "#contact", label: "Contact" },
] as const;

const SECTION_IDS = NAV.map((n) => n.href.slice(1)) as readonly string[];

function useScrollActiveSection() {
  const [active, setActive] = useState<string>(SECTION_IDS[0]!);

  const recalc = useCallback(() => {
    const band = window.innerHeight * 0.4;
    let best = SECTION_IDS[0]!;
    let bestDist = Infinity;

    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (r.bottom < 64 || r.top > window.innerHeight - 48) continue;
      const anchor = r.top + Math.min(r.height * 0.22, 140);
      const d = Math.abs(anchor - band);
      if (d < bestDist) {
        bestDist = d;
        best = id;
      }
    }
    setActive((prev) => (prev === best ? prev : best));
  }, []);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && SECTION_IDS.includes(hash)) {
      setActive(hash);
    }
  }, []);

  useEffect(() => {
    let raf = 0;
    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        recalc();
      });
    };
    recalc();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [recalc]);

  return [active, setActive] as const;
}

export function PillNav() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useScrollActiveSection();
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [pill, setPill] = useState({ x: 0, w: 0 });

  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      const idx = Math.max(
        0,
        NAV.findIndex((n) => n.href === `#${active}`),
      );
      const el = itemRefs.current[idx];
      if (!el) return;
      const t = track.getBoundingClientRect();
      const a = el.getBoundingClientRect();
      setPill({ x: a.left - t.left, w: a.width });
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [active]);

  const transition = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 520, damping: 38, mass: 0.85 };

  return (
    <nav aria-label="Primary" className="max-w-full">
      <div
        ref={trackRef}
        className="relative isolate inline-flex max-w-full rounded-full border border-accent/25 bg-black/55 p-1 shadow-[0_12px_48px_rgba(0,0,0,0.55),0_0_36px_-10px_rgba(82,38,255,0.22)] backdrop-blur-2xl backdrop-saturate-150 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <motion.span
          aria-hidden
          className="pointer-events-none absolute top-1 bottom-1 rounded-full bg-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_0_24px_-4px_rgba(82,38,255,0.55)]"
          initial={false}
          animate={{ x: pill.x, width: pill.w }}
          transition={transition}
        />
        <ul className="relative z-10 flex max-w-full items-stretch gap-0.5 overflow-x-auto">
          {NAV.map((item, i) => {
            const id = item.href.slice(1);
            const isActive = active === id;
            return (
              <li key={item.href} className="shrink-0">
                <a
                  ref={(node) => {
                    itemRefs.current[i] = node;
                  }}
                  href={item.href}
                  onClick={() => setActive(id)}
                  className={`relative flex items-center justify-center whitespace-nowrap rounded-full px-3.5 py-2.5 text-[0.62rem] font-semibold uppercase tracking-[0.22em] transition-colors duration-200 sm:px-5 sm:py-2.5 sm:text-[0.65rem] sm:tracking-[0.26em] ${
                    isActive
                      ? "text-white"
                      : "text-neutral-500 hover:text-accent"
                  }`}
                  aria-current={isActive ? "true" : undefined}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
