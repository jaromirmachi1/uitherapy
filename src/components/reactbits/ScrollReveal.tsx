"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  blur?: number;
};

const ease = [0.22, 1, 0.36, 1] as const;

const revealTransition = {
  duration: 0.9,
  ease,
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
  y = 28,
  blur = 12,
}: Props) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: `blur(${blur}px)` }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-8% 0px", amount: 0.18 }}
      transition={{ ...revealTransition, delay }}
    >
      {children}
    </motion.div>
  );
}
