"use client";

import { useCallback, useMemo, useRef } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Cursor glow preset when `spotlightHex` is not set */
  glowTint?: "white" | "accent";
  /**
   * Hex spotlight color (with or without `#`), e.g. `A855F7` for React Bits violet.
   * When set, overrides `glowTint` for the radial follow spotlight.
   */
  spotlightHex?: string;
};

function parseHexRgb(hex: string): [number, number, number] | null {
  const raw = hex.replace(/^#/, "").trim();
  if (!/^[0-9a-fA-F]{6}$/.test(raw)) return null;
  const n = Number.parseInt(raw, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function SpotlightCard({
  children,
  className,
  glowTint = "white",
  spotlightHex,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const spotlightBackground = useMemo(() => {
    const rgb = spotlightHex ? parseHexRgb(spotlightHex) : null;
    if (rgb) {
      const [r, g, b] = rgb;
      return `radial-gradient(600px circle at var(--spot-x) var(--spot-y), rgba(${r},${g},${b},0.22), rgba(${r},${g},${b},0.08) 28%, transparent 55%)`;
    }
    if (glowTint === "accent") {
      return "radial-gradient(520px circle at var(--spot-x) var(--spot-y), rgba(130,80,255,0.16), transparent 42%)";
    }
    return "radial-gradient(520px circle at var(--spot-x) var(--spot-y), rgba(255,255,255,0.08), transparent 45%)";
  }, [glowTint, spotlightHex]);

  const update = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
    el.style.setProperty("--spot-opacity", "1");
  }, []);

  const onLeave = useCallback(() => {
    ref.current?.style.setProperty("--spot-opacity", "0");
  }, []);

  return (
    <div
      ref={ref}
      onMouseEnter={update}
      onMouseMove={update}
      onMouseLeave={onLeave}
      className={`relative isolate overflow-hidden ${className ?? ""}`}
      style={
        {
          "--spot-x": "50%",
          "--spot-y": "50%",
          "--spot-opacity": "0",
        } as React.CSSProperties
      }
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          opacity: "var(--spot-opacity)",
          background: spotlightBackground,
        }}
        aria-hidden
      />
      {children}
    </div>
  );
}
