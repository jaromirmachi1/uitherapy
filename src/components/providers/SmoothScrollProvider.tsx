"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

type Props = {
  children: React.ReactNode;
};

function useDesktopSmoothScroll() {
  const prefersReducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => {
      setEnabled(media.matches && !prefersReducedMotion);
    };

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [prefersReducedMotion]);

  return enabled;
}

export function SmoothScrollProvider({ children }: Props) {
  const [mounted, setMounted] = useState(false);
  const desktopSmoothScroll = useDesktopSmoothScroll();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "ut-native-scroll",
      mounted && !desktopSmoothScroll,
    );
    return () => {
      document.documentElement.classList.remove("ut-native-scroll");
    };
  }, [desktopSmoothScroll, mounted]);

  const options = useMemo(
    () =>
      ({
        lerp: 0.1,
        smoothWheel: true,
        syncTouch: false,
        anchors: true,
        wheelMultiplier: 1,
        touchMultiplier: 1,
        overscroll: true,
      }) as const,
    [],
  );

  if (!mounted || !desktopSmoothScroll) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={options}>
      {children}
    </ReactLenis>
  );
}
