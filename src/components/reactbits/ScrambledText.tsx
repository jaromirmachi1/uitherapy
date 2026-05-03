"use client";

import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { SplitText } from "gsap/SplitText";
import { useLayoutEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

import styles from "./ScrambledText.module.css";

gsap.registerPlugin(SplitText, ScrambleTextPlugin);

export type ScrambledTextProps = {
  radius?: number;
  duration?: number;
  speed?: number;
  scrambleChars?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  /** Plain copy for splitting (use when `children` is not a string). */
  text?: string;
};

function getPlainCopy(
  children: React.ReactNode,
  text: string | undefined,
): string {
  if (typeof children === "string") return children;
  if (text != null) return text;
  return "";
}

/**
 * Proximity scramble via GSAP SplitText + ScrambleTextPlugin.
 * Inspired by Tom Miller / GSAP community:
 * https://codepen.io/creativeocean/pen/NPWLwJM
 */
export function ScrambledText({
  radius = 100,
  duration = 1.2,
  speed = 0.5,
  scrambleChars = ".:",
  className = "",
  style,
  children,
  text,
}: ScrambledTextProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const pRef = useRef<HTMLParagraphElement | null>(null);
  const charsRef = useRef<HTMLElement[]>([]);
  const reduceMotion = useReducedMotion();

  const copy = getPlainCopy(children, text);

  useLayoutEffect(() => {
    if (reduceMotion) return;
    const root = rootRef.current;
    const p = pRef.current;
    if (!root || !p) return;
    if (!copy.length) return;

    p.textContent = copy;

    const split = SplitText.create(p, {
      type: "chars",
      charsClass: styles.char,
    });

    charsRef.current = split.chars as HTMLElement[];

    charsRef.current.forEach((c) => {
      gsap.set(c, {
        display: "inline-block",
        attr: { "data-content": c.innerHTML },
      });
    });

    const handleMove = (e: PointerEvent) => {
      charsRef.current.forEach((c) => {
        const { left, top, width, height } = c.getBoundingClientRect();
        const dx = e.clientX - (left + width / 2);
        const dy = e.clientY - (top + height / 2);
        const dist = Math.hypot(dx, dy);

        if (dist < radius) {
          gsap.to(c, {
            overwrite: true,
            duration: duration * (1 - dist / radius),
            scrambleText: {
              text: c.dataset.content ?? "",
              chars: scrambleChars,
              speed,
            },
            ease: "none",
          });
        }
      });
    };

    root.addEventListener("pointermove", handleMove);

    return () => {
      root.removeEventListener("pointermove", handleMove);
      charsRef.current.forEach((c) => gsap.killTweensOf(c));
      split.revert();
      charsRef.current = [];
      p.textContent = copy;
    };
  }, [
    reduceMotion,
    copy,
    radius,
    duration,
    speed,
    scrambleChars,
  ]);

  if (reduceMotion) {
    return (
      <div className="pointer-events-auto">
        <p className={className} style={style}>
          {copy || children}
        </p>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="pointer-events-auto">
      <p ref={pRef} className={className} style={style} />
    </div>
  );
}

export default ScrambledText;
