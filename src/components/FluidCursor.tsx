"use client";

import { startFluidEngine } from "@/components/fluid-cursor-engine";
import { useEffect, useRef, useState } from "react";

type RGB = { r: number; g: number; b: number };

type Props = {
  colors?: string[];
  intensity?: number;
  className?: string;
};

const RESIZE_DEBOUNCE_MS = 140;
const MAX_PIXEL_RATIO = 1.5;

export function FluidCursor({ colors, intensity = 0.42, className }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [staticMode, setStaticMode] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setStaticMode(true);
      return;
    }

    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const noHover = window.matchMedia("(hover: none)").matches;
    const isTouchPrimary = coarsePointer || noHover;

    const palette = resolvePalette(colors);
    if (palette.length === 0) {
      setStaticMode(true);
      return;
    }

    const clamped = clamp(intensity, 0.15, 1);
    let engine: ReturnType<typeof startFluidEngine> = null;
    try {
      engine = startFluidEngine(canvas, {
        colors: palette,
        dyeScale: 0.22 + clamped * 0.18,
        splatForce: 1800 + clamped * 2600,
        splatRadius: 0.16 + clamped * 0.08,
        simResolution: isTouchPrimary ? 96 : 128,
        dyeResolution: isTouchPrimary ? 256 : 512,
        pressureIterations: isTouchPrimary ? 10 : 14,
        ambient: isTouchPrimary,
        maxPixelRatio: MAX_PIXEL_RATIO,
        pointerRoot: root.parentElement,
      });
    } catch {
      engine = null;
    }

    if (!engine) {
      setStaticMode(true);
      return;
    }

    let visible = false;
    let resizeTimer = 0;

    const playIfVisible = () => {
      if (visible) engine.play();
    };

    const intersection = new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry?.isIntersecting);
        if (visible) engine.play();
        else engine.pause();
      },
      { threshold: 0.08, rootMargin: "80px 0px" },
    );
    intersection.observe(root);
    visible = true;
    engine.play();

    const resizeObserver = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        engine.resize();
        playIfVisible();
      }, RESIZE_DEBOUNCE_MS);
    });
    resizeObserver.observe(root);

    return () => {
      window.clearTimeout(resizeTimer);
      intersection.disconnect();
      resizeObserver.disconnect();
      engine.dispose();
    };
  }, [colors, intensity]);

  return (
    <div
      ref={rootRef}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
      aria-hidden
    >
      {staticMode ? (
        <StaticPoster />
      ) : (
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      )}
    </div>
  );
}

function StaticPoster() {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,color-mix(in_srgb,var(--accent)_18%,transparent),transparent_42%),radial-gradient(ellipse_at_70%_70%,color-mix(in_srgb,var(--accent-hover)_12%,transparent),transparent_46%),var(--background)]" />
  );
}

function resolvePalette(colors?: string[]): RGB[] {
  const styles = getComputedStyle(document.documentElement);
  const fallbacks = [
    styles.getPropertyValue("--accent").trim(),
    styles.getPropertyValue("--accent-hover").trim(),
  ];
  const source = colors?.length ? colors : fallbacks;
  return source.map(parseCssColor).filter((color): color is RGB => color !== null);
}

function parseCssColor(value: string): RGB | null {
  const raw = value.trim();
  if (!raw) return null;

  const hex = raw.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    let h = hex[1]!;
    if (h.length === 3) {
      h = `${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}`;
    }
    const n = Number.parseInt(h, 16);
    return {
      r: ((n >> 16) & 255) / 255,
      g: ((n >> 8) & 255) / 255,
      b: (n & 255) / 255,
    };
  }

  const rgb = raw.match(/^rgba?\(([^)]+)\)$/i);
  if (rgb) {
    const parts = rgb[1]!.split(",").map((part) => Number.parseFloat(part.trim()));
    if (parts.length < 3 || parts.some((part) => Number.isNaN(part))) return null;
    return {
      r: parts[0]! / 255,
      g: parts[1]! / 255,
      b: parts[2]! / 255,
    };
  }

  return null;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
