"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
} from "react";

type SegmentState = {
  opacity: number;
  x: number;
  y: number;
  filter?: string;
};

export type StaggeredTextProps = {
  text?: string;
  className?: string;
  id?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  segmentBy?: "chars" | "words" | "lines";
  separator?: string;
  delay?: number;
  duration?: number;
  threshold?: number;
  rootMargin?: string;
  direction?: "top" | "bottom" | "left" | "right";
  blur?: boolean;
  staggerDirection?: "forward" | "reverse" | "center";
  respectReducedMotion?: boolean;
  exitOnScrollOut?: boolean;
  from?: SegmentState;
  to?: SegmentState;
  onAnimationComplete?: () => void;
  onExitComplete?: () => void;
  style?: CSSProperties;
};

const offsetForDirection = (direction: StaggeredTextProps["direction"]) => {
  switch (direction) {
    case "bottom":
      return { x: 0, y: 28 };
    case "left":
      return { x: -24, y: 0 };
    case "right":
      return { x: 24, y: 0 };
    case "top":
    default:
      return { x: 0, y: -28 };
  }
};

const splitSegments = (
  text: string,
  segmentBy: NonNullable<StaggeredTextProps["segmentBy"]>,
  separator?: string,
): string[] => {
  if (separator) {
    return text.split(separator).flatMap((row, index, rows) => {
      const parts =
        segmentBy === "chars"
          ? Array.from(row)
          : segmentBy === "lines"
            ? [row]
            : row.split(/(\s+)/).filter(Boolean);
      if (index < rows.length - 1) return [...parts, separator];
      return parts;
    });
  }

  if (segmentBy === "chars") return Array.from(text);
  if (segmentBy === "lines") return text.split("\n");
  return text.split(/(\s+)/).filter(Boolean);
};

const staggerIndex = (
  index: number,
  total: number,
  mode: NonNullable<StaggeredTextProps["staggerDirection"]>,
) => {
  if (mode === "reverse") return total - 1 - index;
  if (mode === "center") {
    const mid = (total - 1) / 2;
    return Math.abs(index - mid);
  }
  return index;
};

export default function StaggeredText({
  text = "",
  className = "",
  id,
  as = "p",
  segmentBy = "words",
  separator,
  delay = 80,
  duration = 0.6,
  threshold = 0.1,
  rootMargin = "0px",
  direction = "top",
  blur = true,
  staggerDirection = "forward",
  respectReducedMotion = true,
  exitOnScrollOut = false,
  from,
  to,
  onAnimationComplete,
  onExitComplete,
  style,
}: StaggeredTextProps) {
  const Tag = as as ElementType;
  const rootRef = useRef<HTMLElement | null>(null);
  const prefersReduced = useReducedMotion();
  const reduceMotion = Boolean(respectReducedMotion && prefersReduced);
  const [visible, setVisible] = useState(false);
  const completedRef = useRef(false);
  const visibleRef = useRef(false);

  const segments = useMemo(
    () => splitSegments(text, segmentBy, separator),
    [text, segmentBy, separator],
  );

  const offset = offsetForDirection(direction);
  const initialStyle: SegmentState = from ?? {
    opacity: 0,
    x: offset.x,
    y: offset.y,
    ...(blur ? { filter: "blur(12px)" } : {}),
  };
  const targetStyle: SegmentState = to ?? {
    opacity: 1,
    x: 0,
    y: 0,
    ...(blur ? { filter: "blur(0px)" } : {}),
  };

  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);

  useEffect(() => {
    const node = rootRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (!exitOnScrollOut) observer.disconnect();
          return;
        }
        if (exitOnScrollOut && visibleRef.current) {
          setVisible(false);
          completedRef.current = false;
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [exitOnScrollOut, rootMargin, threshold]);

  useEffect(() => {
    completedRef.current = false;
  }, [text]);

  const handleSegmentComplete = (index: number) => {
    if (completedRef.current) return;
    const lastIndex =
      staggerDirection === "reverse"
        ? 0
        : staggerDirection === "center"
          ? segments.reduce(
              (best, _, i) =>
                staggerIndex(i, segments.length, "center") >
                staggerIndex(best, segments.length, "center")
                  ? i
                  : best,
              0,
            )
          : segments.length - 1;
    if (index === lastIndex) {
      completedRef.current = true;
      if (visibleRef.current) onAnimationComplete?.();
      else onExitComplete?.();
    }
  };

  return (
    <Tag
      ref={rootRef}
      id={id}
      className={className}
      style={style}
      aria-label={text}
    >
      {segments.map((segment, index) => {
        const isWhitespace = /^\s+$/.test(segment);
        const order = staggerIndex(index, segments.length, staggerDirection);
        const delaySec = reduceMotion ? 0 : (order * delay) / 1000;

        if (isWhitespace) {
          return (
            <span key={`ws-${index}`} aria-hidden="true">
              {segment}
            </span>
          );
        }

        const animateState = reduceMotion || visible ? targetStyle : initialStyle;

        return (
          <motion.span
            key={`${segment}-${index}`}
            className="inline-block will-change-transform"
            aria-hidden="true"
            initial={reduceMotion ? false : initialStyle}
            animate={animateState}
            transition={{
              duration: reduceMotion ? 0 : duration,
              delay: delaySec,
              ease: [0.22, 1, 0.36, 1],
            }}
            onAnimationComplete={() => handleSegmentComplete(index)}
          >
            {segment}
          </motion.span>
        );
      })}
    </Tag>
  );
}
