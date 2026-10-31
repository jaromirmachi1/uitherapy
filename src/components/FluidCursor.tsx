"use client";

import { startFluidEngine } from "@/components/fluid-cursor-engine";
import { useEffect, useRef, useState, type RefObject } from "react";

type RGB = { r: number; g: number; b: number };

type Props = {
  colors?: string[];
  intensity?: number;
  className?: string;
  /** Dye wash opacity (0–1) when the canvas sits above CSS overlays. */
  washOpacity?: number;
  /**
   * Text the fluid should distort (e.g. the hero heading). Its word spans
   * are redrawn into the canvas; while active, the closest `[data-fluid-scope]`
   * ancestor gets `data-fluid-text="on"` so the DOM copy can be hidden.
   */
  textTarget?: RefObject<HTMLElement | null>;
  /** Wait before swapping in the canvas text (lets intro animations finish). */
  textDelayMs?: number;
};

const RESIZE_DEBOUNCE_MS = 140;
const MAX_PIXEL_RATIO = 1.5;

export function FluidCursor({
  colors,
  intensity = 0.42,
  className,
  washOpacity,
  textTarget,
  textDelayMs = 1500,
}: Props) {
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

    // Touch + Safari chrome show/hide thrash WebGL resize/paint. Keep a static wash.
    if (isTouchPrimary) {
      setStaticMode(true);
      return;
    }

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
        washOpacity,
        text: textTarget ? resolveTextColors() : undefined,
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

    // --- Optional distorted text layer ---
    const scope = root.closest<HTMLElement>("[data-fluid-scope]");
    const maskCanvas = textTarget ? document.createElement("canvas") : null;
    let textOn = false;
    let textTimer = 0;
    let disposed = false;

    const drawText = () => {
      const target = textTarget?.current;
      if (!maskCanvas || !target || disposed) return;
      const ok = drawTextMask(maskCanvas, canvas, root, target);
      if (!ok) {
        engine.setText(null);
        if (scope) delete scope.dataset.fluidText;
        textOn = false;
        return;
      }
      engine.setText(maskCanvas);
      if (!textOn && scope) scope.dataset.fluidText = "on";
      textOn = true;
    };

    if (maskCanvas) {
      const fontsReady = document.fonts?.ready ?? Promise.resolve();
      textTimer = window.setTimeout(() => {
        fontsReady.then(() => requestAnimationFrame(drawText));
      }, textDelayMs);
    }

    const resizeObserver = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        engine.resize();
        if (textOn) drawText();
        playIfVisible();
      }, RESIZE_DEBOUNCE_MS);
    });
    resizeObserver.observe(root);

    return () => {
      disposed = true;
      window.clearTimeout(textTimer);
      if (scope) delete scope.dataset.fluidText;
      window.clearTimeout(resizeTimer);
      intersection.disconnect();
      resizeObserver.disconnect();
      engine.dispose();
    };
  }, [colors, intensity, washOpacity, textTarget, textDelayMs]);

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

/** Text ink and hover tint, from the site's CSS tokens. */
function resolveTextColors() {
  const styles = getComputedStyle(document.documentElement);
  const read = (name: string, fallback: RGB) =>
    parseCssColor(styles.getPropertyValue(name).trim()) ?? fallback;
  return {
    color: read("--foreground", { r: 0.17, g: 0.17, b: 0.17 }),
    tint: read("--accent", { r: 0.12, g: 0.37, b: 1 }),
  };
}

/**
 * Paints each visible word of `target` into `mask` at its on-screen spot,
 * in the canvas's pixel space. Word spans are `inline-block` (StaggeredText),
 * so each one is drawn at its own box; plain text falls back to the element.
 */
function drawTextMask(
  mask: HTMLCanvasElement,
  canvas: HTMLCanvasElement,
  root: HTMLElement,
  target: HTMLElement,
) {
  const width = canvas.width;
  const height = canvas.height;
  const rootRect = root.getBoundingClientRect();
  if (!width || !height || rootRect.width === 0) return false;

  mask.width = width;
  mask.height = height;
  const ctx = mask.getContext("2d");
  if (!ctx) return false;
  ctx.clearRect(0, 0, width, height);

  const scale = width / rootRect.width;
  const words = Array.from(
    target.querySelectorAll<HTMLElement>("span.inline-block"),
  );
  const pieces = words.length > 0 ? words : [target];
  let drawn = 0;

  for (const piece of pieces) {
    const text = piece.textContent?.trim();
    if (!text) continue;
    const rect = piece.getBoundingClientRect();
    if (rect.width === 0) continue;
    const style = getComputedStyle(piece);
    const size = Number.parseFloat(style.fontSize) * scale;
    ctx.font = `${style.fontStyle} ${style.fontWeight} ${size}px ${style.fontFamily}`;
    const spacing = Number.parseFloat(style.letterSpacing);
    if ("letterSpacing" in ctx) {
      (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing =
        Number.isFinite(spacing) ? `${spacing * scale}px` : "0px";
    }
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#fff";
    const metrics = ctx.measureText(text);
    const ascent = metrics.fontBoundingBoxAscent ?? size * 0.9;
    const descent = metrics.fontBoundingBoxDescent ?? size * 0.25;
    const boxHeight = rect.height * scale;
    const x = (rect.left - rootRect.left) * scale;
    const y =
      (rect.top - rootRect.top) * scale + (boxHeight - (ascent + descent)) / 2 + ascent;
    ctx.fillText(text, x, y);
    drawn += 1;
  }
  return drawn > 0;
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
