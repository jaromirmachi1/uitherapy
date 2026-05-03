"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function GsapProvider() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const media = gsap.matchMedia();
    const ctx = gsap.context(() => {
      const revealItems = gsap.utils.toArray<HTMLElement>(
        '[data-gsap="reveal"]',
      );
      revealItems.forEach((item) => {
        const delay = Number(item.dataset.gsapDelay ?? 0);
        gsap.fromTo(
          item,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.95,
            delay,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 86%",
              once: true,
            },
          },
        );
      });

      const parallaxItems = gsap.utils.toArray<HTMLElement>(
        '[data-gsap="parallax"]',
      );
      parallaxItems.forEach((item) => {
        const yPercent = Number(item.dataset.gsapY ?? -10);
        gsap.to(item, {
          yPercent,
          ease: "none",
          scrollTrigger: {
            trigger: item,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      media.add("(min-width: 1024px)", () => {
        const horizontalSections = gsap.utils.toArray<HTMLElement>(
          '[data-gsap="horizontal-section"]',
        );

        horizontalSections.forEach((section) => {
          const viewport = section.querySelector<HTMLElement>(
            "[data-gsap-horizontal-viewport]",
          );
          const track = section.querySelector<HTMLElement>(
            "[data-gsap-horizontal-track]",
          );
          if (!viewport || !track) return;

          const getDistance = () =>
            Math.max(0, track.scrollWidth - viewport.clientWidth);

          gsap.to(track, {
            x: () => -getDistance(),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${getDistance() + viewport.clientHeight * 0.15}`,
              scrub: true,
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onRefresh: (self) => {
                track.style.willChange = self.isActive ? "transform" : "auto";
              },
            },
          });
        });
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    return () => {
      media.revert();
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return null;
}
