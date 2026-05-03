"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import "./GradualBlur.css";

type CurveKey = "linear" | "bezier" | "ease-in" | "ease-out" | "ease-in-out";
type PresetKey = keyof typeof PRESETS;
type Target = "parent" | "page";
type Animated = boolean | "scroll";
type Position = "top" | "bottom" | "left" | "right";

export type GradualBlurProps = {
  preset?: PresetKey;
  position?: Position;
  strength?: number;
  height?: string;
  width?: string;
  divCount?: number;
  exponential?: boolean;
  zIndex?: number;
  animated?: Animated;
  duration?: string;
  easing?: string;
  opacity?: number;
  curve?: CurveKey;
  responsive?: boolean;
  target?: Target;
  className?: string;
  style?: React.CSSProperties;
  hoverIntensity?: number;
  onAnimationComplete?: () => void;
};

const DEFAULT_CONFIG = {
  position: "bottom" as Position,
  strength: 2,
  height: "6rem",
  width: undefined as string | undefined,
  divCount: 5,
  exponential: false,
  zIndex: 1000,
  animated: false as Animated,
  duration: "0.3s",
  easing: "ease-out",
  opacity: 1,
  curve: "linear" as CurveKey,
  responsive: false,
  target: "parent" as Target,
  className: "",
  style: {} as React.CSSProperties,
  hoverIntensity: undefined as number | undefined,
  onAnimationComplete: undefined as (() => void) | undefined,
};

export const PRESETS = {
  top: { position: "top" as const, height: "6rem" },
  bottom: { position: "bottom" as const, height: "6rem" },
  left: { position: "left" as const, height: "6rem" },
  right: { position: "right" as const, height: "6rem" },
  subtle: { height: "4rem", strength: 1, opacity: 0.8, divCount: 3 },
  intense: { height: "10rem", strength: 4, divCount: 8, exponential: true },
  smooth: { height: "8rem", curve: "bezier" as const, divCount: 10 },
  sharp: { height: "5rem", curve: "linear" as const, divCount: 4 },
  header: { position: "top" as const, height: "8rem", curve: "ease-out" as const },
  footer: { position: "bottom" as const, height: "8rem", curve: "ease-out" as const },
  sidebar: { position: "left" as const, height: "6rem", strength: 2.5 },
  "page-header": {
    position: "top" as const,
    height: "10rem",
    target: "page" as const,
    strength: 3,
  },
  "page-footer": {
    position: "bottom" as const,
    height: "10rem",
    target: "page" as const,
    strength: 3,
  },
} as const;

export const CURVE_FUNCTIONS: Record<CurveKey, (p: number) => number> = {
  linear: (p) => p,
  bezier: (p) => p * p * (3 - 2 * p),
  "ease-in": (p) => p * p,
  "ease-out": (p) => 1 - (1 - p) ** 2,
  "ease-in-out": (p) =>
    p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2,
};

function mergeConfigs<T extends Record<string, unknown>>(...configs: Partial<T>[]) {
  return configs.reduce((acc, c) => ({ ...acc, ...c }), {} as T);
}

function getGradientDirection(position: string) {
  const map: Record<string, string> = {
    top: "to top",
    bottom: "to bottom",
    left: "to left",
    right: "to right",
  };
  return map[position] ?? "to bottom";
}

function useIntersectionObserver(
  ref: React.RefObject<HTMLElement | null>,
  shouldObserve: boolean,
) {
  const [isVisible, setIsVisible] = useState(!shouldObserve);

  useEffect(() => {
    if (!shouldObserve || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, shouldObserve]);

  return isVisible;
}

function GradualBlur(props: GradualBlurProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const config = useMemo(() => {
    const { preset: presetName, ...restProps } = props;
    const presetConfig =
      presetName && presetName in PRESETS ? PRESETS[presetName as PresetKey] : {};
    return mergeConfigs(
      DEFAULT_CONFIG,
      presetConfig as Partial<typeof DEFAULT_CONFIG>,
      restProps as Partial<typeof DEFAULT_CONFIG>,
    );
  }, [props]);

  const isVisible = useIntersectionObserver(
    containerRef,
    config.animated === "scroll",
  );

  const blurDivs = useMemo(() => {
    const divs: React.ReactNode[] = [];
    const divCount = config.divCount ?? DEFAULT_CONFIG.divCount;
    const increment = 100 / divCount;
    const strength = config.strength ?? DEFAULT_CONFIG.strength;
    const currentStrength =
      isHovered && config.hoverIntensity
        ? strength * config.hoverIntensity
        : strength;

    const curveFunc =
      CURVE_FUNCTIONS[config.curve ?? DEFAULT_CONFIG.curve] ?? CURVE_FUNCTIONS.linear;

    for (let i = 1; i <= divCount; i++) {
      let progress = i / divCount;
      progress = curveFunc(progress);

      const exponential = config.exponential ?? DEFAULT_CONFIG.exponential;
      let blurValue: number;
      if (exponential) {
        blurValue = Math.pow(2, progress * 4) * 0.0625 * currentStrength;
      } else {
        blurValue = 0.0625 * (progress * divCount + 1) * currentStrength;
      }

      const p1 = Math.round((increment * i - increment) * 10) / 10;
      const p2 = Math.round(increment * i * 10) / 10;
      const p3 = Math.round((increment * i + increment) * 10) / 10;
      const p4 = Math.round((increment * i + increment * 2) * 10) / 10;

      let gradient = `transparent ${p1}%, black ${p2}%`;
      if (p3 <= 100) gradient += `, black ${p3}%`;
      if (p4 <= 100) gradient += `, transparent ${p4}%`;

      const direction = getGradientDirection(config.position ?? DEFAULT_CONFIG.position);

      const divStyle: React.CSSProperties = {
        position: "absolute",
        inset: 0,
        maskImage: `linear-gradient(${direction}, ${gradient})`,
        WebkitMaskImage: `linear-gradient(${direction}, ${gradient})`,
        backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
        WebkitBackdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
        opacity: config.opacity ?? DEFAULT_CONFIG.opacity,
        transition:
          config.animated && config.animated !== "scroll"
            ? `backdrop-filter ${config.duration ?? DEFAULT_CONFIG.duration} ${config.easing ?? DEFAULT_CONFIG.easing}`
            : undefined,
      };

      divs.push(<div key={i} style={divStyle} />);
    }

    return divs;
  }, [config, isHovered]);

  const containerStyle = useMemo(() => {
    const position: Position = (config.position ?? DEFAULT_CONFIG.position) as Position;
    const target = config.target ?? DEFAULT_CONFIG.target;
    const isVertical = ["top", "bottom"].includes(position);
    const isHorizontal = ["left", "right"].includes(position);
    const isPageTarget = target === "page";

    const baseStyle: React.CSSProperties = {
      position: isPageTarget ? "fixed" : "absolute",
      pointerEvents: config.hoverIntensity ? "auto" : "none",
      opacity: isVisible ? 1 : 0,
      transition: config.animated ? `opacity ${config.duration} ${config.easing}` : undefined,
      zIndex: isPageTarget ? (config.zIndex ?? DEFAULT_CONFIG.zIndex) + 100 : (config.zIndex ?? DEFAULT_CONFIG.zIndex),
      ...config.style,
    };

    if (isVertical) {
      baseStyle.height = config.height ?? DEFAULT_CONFIG.height;
      baseStyle.width = config.width ?? "100%";
      if (position === "top") baseStyle.top = 0;
      if (position === "bottom") baseStyle.bottom = 0;
      baseStyle.left = 0;
      baseStyle.right = 0;
    } else if (isHorizontal) {
      baseStyle.width = config.width ?? config.height ?? DEFAULT_CONFIG.height;
      baseStyle.height = "100%";
      if (position === "left") baseStyle.left = 0;
      if (position === "right") baseStyle.right = 0;
      baseStyle.top = 0;
      baseStyle.bottom = 0;
    }

    return baseStyle;
  }, [config, isVisible]);

  const { hoverIntensity, animated, onAnimationComplete, duration } = config;

  useEffect(() => {
    if (isVisible && animated === "scroll" && onAnimationComplete) {
      const ms = parseFloat(String(duration)) * 1000;
      const t = setTimeout(() => onAnimationComplete(), ms);
      return () => clearTimeout(t);
    }
  }, [isVisible, animated, onAnimationComplete, duration]);

  const pageClass =
    (config.target ?? DEFAULT_CONFIG.target) === "page"
      ? "gradual-blur-page"
      : "gradual-blur-parent";

  return (
    <div
      ref={containerRef}
      className={`gradual-blur ${pageClass} ${config.className ?? ""}`}
      style={containerStyle}
      aria-hidden
      onMouseEnter={hoverIntensity ? () => setIsHovered(true) : undefined}
      onMouseLeave={hoverIntensity ? () => setIsHovered(false) : undefined}
    >
      <div className="gradual-blur-inner">
        {blurDivs}
      </div>
    </div>
  );
}

const GradualBlurMemo = React.memo(GradualBlur);
GradualBlurMemo.displayName = "GradualBlur";

export default GradualBlurMemo;
