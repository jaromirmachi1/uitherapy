"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const DURATION_MS = 2000;
const EXIT_MS = 650;

export function IntroLoader() {
  const [progress, setProgress] = useState(0);
  const [closing, setClosing] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    document.body.classList.add("ut-loading");

    const startedAt = performance.now();
    const tick = window.setInterval(() => {
      const elapsed = performance.now() - startedAt;
      const next = Math.min(100, Math.round((elapsed / DURATION_MS) * 100));
      setProgress(next);
      if (next >= 100) {
        window.clearInterval(tick);
        setClosing(true);
      }
    }, 32);

    return () => {
      window.clearInterval(tick);
      document.body.classList.remove("ut-loading");
    };
  }, []);

  useEffect(() => {
    if (!closing) return;
    document.body.classList.remove("ut-loading");
    const timeout = window.setTimeout(() => setVisible(false), EXIT_MS);
    return () => window.clearTimeout(timeout);
  }, [closing]);

  if (!visible) return null;

  return (
    <div
      className={`intro-loader ${closing ? "is-closing" : ""}`}
      aria-hidden="true"
    >
      <div className="intro-loader__inner">
        <Image
          src="/uilogo.png"
          alt=""
          width={781}
          height={188}
          priority
          className="intro-loader__logo h-[clamp(1.75rem,5.5vw,3.25rem)] w-auto"
        />
        <p className="intro-loader__tag">Premium interfaces and technical SEO</p>
      </div>
      <div className="intro-loader__meter">
        <span>{progress.toString().padStart(2, "0")}</span>
      </div>
    </div>
  );
}
