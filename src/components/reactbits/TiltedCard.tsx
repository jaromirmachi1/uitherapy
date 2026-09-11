"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useSpring,
  type SpringOptions,
} from "motion/react";

const spring: SpringOptions = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

type Props = {
  children: React.ReactNode;
  className?: string;
  rotateAmplitude?: number;
  scaleOnHover?: number;
};

export function TiltedCard({
  children,
  className,
  rotateAmplitude = 12,
  scaleOnHover = 1.035,
}: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const finePointer = useRef(false);
  const rotateX = useSpring(0, spring);
  const rotateY = useSpring(0, spring);
  const scale = useSpring(1, spring);
  const glareX = useSpring(50, spring);
  const glareY = useSpring(50, spring);
  const glareOpacity = useSpring(0, spring);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.3), transparent 46%)`;

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => {
      finePointer.current = media.matches;
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const reset = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
    glareOpacity.set(0);
    glareX.set(50);
    glareY.set(50);
  }, [glareOpacity, glareX, glareY, rotateX, rotateY, scale]);

  const onEnter = useCallback(() => {
    if (reduce || !finePointer.current) return;
    scale.set(scaleOnHover);
    glareOpacity.set(1);
  }, [glareOpacity, reduce, scale, scaleOnHover]);

  const onMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (reduce || !finePointer.current || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const offsetX = event.clientX - rect.left - rect.width / 2;
      const offsetY = event.clientY - rect.top - rect.height / 2;
      rotateX.set((offsetY / (rect.height / 2)) * -rotateAmplitude);
      rotateY.set((offsetX / (rect.width / 2)) * rotateAmplitude);
      glareX.set(((event.clientX - rect.left) / rect.width) * 100);
      glareY.set(((event.clientY - rect.top) / rect.height) * 100);
    },
    [glareX, glareY, reduce, rotateAmplitude, rotateX, rotateY],
  );

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={`[perspective:800px] ${className ?? ""}`}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      <motion.div
        className="relative h-full [transform-style:preserve-3d]"
        style={{ rotateX, rotateY, scale }}
      >
        {children}
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-[1.45rem] mix-blend-soft-light"
          style={{ opacity: glareOpacity, background: glareBackground }}
          aria-hidden
        />
      </motion.div>
    </div>
  );
}
