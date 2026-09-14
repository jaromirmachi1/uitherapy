"use client";

import { GradientWaves } from "@/components/GradientWaves";
import { useEffect, useState } from "react";

export function SiteBackground() {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setAnimated(finePointer.matches && !reduceMotion.matches);
    };
    sync();
    finePointer.addEventListener("change", sync);
    reduceMotion.addEventListener("change", sync);
    return () => {
      finePointer.removeEventListener("change", sync);
      reduceMotion.removeEventListener("change", sync);
    };
  }, []);

  return (
    <div
      className="ut-site-background pointer-events-none fixed top-0 left-0 z-0 isolate h-[100lvh] w-full bg-[#e8e8e8] [transform:translateZ(0)] [backface-visibility:hidden]"
      aria-hidden
    >
      {animated ? (
        <GradientWaves
          horizonColor="#e8e8e8"
          waveColor="#1f5eff"
          crestColor="#ffffff"
          speed={0.38}
          opacity={0.92}
          brightness={1.22}
          fogDepth={24}
          amplitude={3.1}
          detail="medium"
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(31,94,255,0.14),transparent_42%),radial-gradient(ellipse_at_80%_100%,rgba(21,71,206,0.1),transparent_48%),linear-gradient(180deg,#eceef2_0%,#e8e8e8_48%,#e4e6ea_100%)]" />
      )}
    </div>
  );
}
