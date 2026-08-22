"use client";

import { useLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";
import {
  Children,
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
} from "react";

type Props = {
  children: ReactNode;
  trackRef: RefObject<HTMLElement | null>;
  peek?: number;
  scaleStep?: number;
  blur?: number;
  dim?: number;
  smooth?: number;
  depth?: number;
  cardWidth?: number;
  borderRadius?: number;
  showProgress?: boolean;
  showCounter?: boolean;
  className?: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function ScrollStack({
  children,
  trackRef,
  peek = 26,
  scaleStep = 0.07,
  blur = 4,
  dim = 0.28,
  smooth = 0.18,
  depth = 3,
  cardWidth = 880,
  borderRadius = 22,
  showProgress = true,
  showCounter = true,
  className,
}: Props) {
  const stageRef = useRef<HTMLOListElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const currentRef = useRef<HTMLSpanElement>(null);
  const totalRef = useRef<HTMLSpanElement>(null);
  const targetProgress = useRef(0);
  const visualProgress = useRef(0);
  const inRangeRef = useRef(true);
  const startTickRef = useRef<() => void>(() => {});
  const items = Children.toArray(children);
  const count = items.length;
  const reduceMotion = useReducedMotion();

  const readProgress = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const rect = track.getBoundingClientRect();
    const total = Math.max(track.offsetHeight - window.innerHeight, 1);
    return clamp(-rect.top / total, 0, 1) * Math.max(count - 1, 0);
  }, [count, trackRef]);

  useLenis(() => {
    targetProgress.current = readProgress();
    if (inRangeRef.current) startTickRef.current();
  });

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const frame = frameRef.current;
    if (!track || !stage || !frame || count === 0) return;
    if (
      reduceMotion ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const cards = Array.from(
      stage.querySelectorAll<HTMLElement>("[data-scroll-stack-card]"),
    );
    if (totalRef.current) {
      totalRef.current.textContent = String(count).padStart(2, "0");
    }

    const apply = (progress: number) => {
      const max = Math.max(count - 1, 0);
      const p = clamp(progress, 0, max);
      const height = Math.max(frame.offsetHeight, 1);

      cards.forEach((card, i) => {
        const overlay = card.querySelector<HTMLElement>("[data-stack-dim]");
        const inner = card.querySelector<HTMLElement>("[data-stack-inner]");
        const delta = p - i;
        let y = 0;
        let scale = 1;
        let opacity = 1;
        let blurPx = 0;
        let dimAmt = 0;

        if (delta < -1) {
          y = height * 1.08;
          opacity = 0;
        } else if (delta < 0) {
          y = (1 - (delta + 1)) * height;
        } else {
          const stacked = Math.min(delta, depth);
          y = -peek * stacked;
          scale = Math.max(0.55, 1 - scaleStep * stacked);
          blurPx = blur * Math.min(stacked, 1);
          dimAmt = dim * Math.min(stacked, 1);
          if (delta > depth) opacity = 0;
        }

        card.style.transform = `translate3d(0, ${y}px, 0) scale(${scale})`;
        card.style.opacity = String(opacity);
        card.style.zIndex = String(i + 1);
        if (inner) {
          inner.style.filter = blurPx > 0.08 ? `blur(${blurPx}px)` : "none";
        }
        if (overlay) overlay.style.opacity = String(dimAmt);
      });

      if (fillRef.current) {
        fillRef.current.style.transform = `scaleX(${max === 0 ? 1 : p / max})`;
      }
      if (currentRef.current) {
        currentRef.current.textContent = String(Math.round(p) + 1).padStart(
          2,
          "0",
        );
      }
    };

    let raf = 0;

    const tick = () => {
      const next =
        visualProgress.current +
        (targetProgress.current - visualProgress.current) * smooth;
      const settled = Math.abs(targetProgress.current - next) < 0.0008;
      visualProgress.current = settled ? targetProgress.current : next;
      apply(visualProgress.current);
      raf =
        inRangeRef.current && !settled
          ? requestAnimationFrame(tick)
          : 0;
    };

    const start = () => {
      if (!raf && inRangeRef.current) raf = requestAnimationFrame(tick);
    };

    startTickRef.current = start;

    apply(readProgress());
    start();

    const io = new IntersectionObserver(
      ([entry]) => {
        inRangeRef.current = Boolean(entry?.isIntersecting);
        if (inRangeRef.current) start();
        else if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { rootMargin: "120% 0px" },
    );
    io.observe(track);

    const onScroll = () => {
      targetProgress.current = readProgress();
      start();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      startTickRef.current = () => {};
    };
  }, [
    blur,
    count,
    depth,
    dim,
    peek,
    readProgress,
    reduceMotion,
    scaleStep,
    smooth,
    trackRef,
  ]);

  if (reduceMotion) {
    return (
      <div
        className={`mx-auto flex w-full flex-col gap-5 ${className ?? ""}`}
        style={{ maxWidth: cardWidth }}
      >
        {items.map((child, index) => (
          <div
            key={index}
            className="overflow-hidden border border-black/10 bg-surface shadow-[0_22px_60px_rgba(43,43,43,0.1)]"
            style={{ borderRadius }}
          >
            {child}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`flex w-full flex-1 flex-col items-center justify-center ${className ?? ""}`}
    >
      <div
        ref={frameRef}
        className="relative w-full"
        style={{
          maxWidth: cardWidth,
          height: "min(32rem, 52svh)",
        }}
      >
        <ol ref={stageRef} className="absolute inset-0 m-0 list-none p-0">
          {items.map((child, index) => (
            <li
              key={index}
              data-scroll-stack-card
              className="absolute inset-0 origin-top will-change-transform"
              style={{
                zIndex: index + 1,
                borderRadius,
                transform:
                  index === 0 ? undefined : "translate3d(0, 110%, 0)",
              }}
            >
              <div
                data-stack-inner
                className="h-full w-full overflow-hidden border border-black/10 bg-surface shadow-[0_22px_60px_rgba(43,43,43,0.12)]"
                style={{ borderRadius }}
              >
                {child}
              </div>
              <div
                data-stack-dim
                className="pointer-events-none absolute inset-0 bg-foreground"
                style={{ borderRadius, opacity: 0 }}
                aria-hidden
              />
            </li>
          ))}
        </ol>
      </div>

      {(showProgress || showCounter) && (
        <div
          className="mt-6 flex w-full shrink-0 items-center gap-5 px-1"
          style={{ maxWidth: cardWidth }}
        >
          {showProgress && (
            <div
              className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-foreground/10"
              aria-hidden
            >
              <span
                ref={fillRef}
                className="absolute inset-y-0 left-0 w-full origin-left bg-accent"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
          )}
          {showCounter && (
            <p
              className="shrink-0 font-[family-name:var(--font-display)] text-sm tabular-nums tracking-[0.18em] text-foreground/55"
              aria-live="polite"
            >
              <span ref={currentRef}>01</span>
              <span className="mx-1.5 text-foreground/25">/</span>
              <span ref={totalRef}>{String(count).padStart(2, "0")}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
