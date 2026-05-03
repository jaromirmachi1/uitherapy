"use client";

import { useCallback, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Cursor glow tint */
  glowTint?: "white" | "accent";
};

export function SpotlightCard({
  children,
  className,
  glowTint = "white",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [spot, setSpot] = useState({ x: 0, y: 0, active: false });

  const update = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setSpot({ x: e.clientX - r.left, y: e.clientY - r.top, active: true });
  }, []);

  const onLeave = useCallback(() => {
    setSpot((g) => ({ ...g, active: false }));
  }, []);

  return (
    <div
      ref={ref}
      onMouseEnter={update}
      onMouseMove={update}
      onMouseLeave={onLeave}
      className={`relative overflow-hidden ${className ?? ""}`}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: spot.active ? 1 : 0,
          background:
            glowTint === "accent"
              ? `radial-gradient(520px circle at ${spot.x}px ${spot.y}px, rgba(130,80,255,0.16), transparent 42%)`
              : `radial-gradient(520px circle at ${spot.x}px ${spot.y}px, rgba(255,255,255,0.08), transparent 45%)`,
        }}
        aria-hidden
      />
      {children}
    </div>
  );
}
