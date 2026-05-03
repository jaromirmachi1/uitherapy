"use client";

import { useEffect, useRef } from "react";

const balls = [
  "meta-ball--one",
  "meta-ball--two",
  "meta-ball--three",
  "meta-ball--four",
  "meta-ball--five",
] as const;

export function MetaBalls() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const move = (event: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--meta-x", `${event.clientX - rect.left}px`);
      el.style.setProperty("--meta-y", `${event.clientY - rect.top}px`);
    };

    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <div
      ref={ref}
      className="meta-balls"
      aria-hidden
    >
      <svg className="absolute h-0 w-0" focusable="false">
        <filter id="meta-balls-goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9"
            result="goo"
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </svg>

      {balls.map((ball) => (
        <span key={ball} className={`meta-ball ${ball}`} />
      ))}
      <span className="meta-ball meta-ball--cursor" />
    </div>
  );
}
