"use client";

import { GradientWaves } from "@/components/GradientWaves";

export function SiteBackground() {
  return (
    <div
      className="ut-site-background pointer-events-none fixed inset-0 z-0 isolate bg-[#e8e8e8] [transform:translateZ(0)] [backface-visibility:hidden]"
      aria-hidden
    >
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
    </div>
  );
}
