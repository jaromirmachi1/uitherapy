"use client";

import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/reactbits/ScrollReveal";
import { TiltedCard } from "@/components/reactbits/TiltedCard";
import { projects, wideImage } from "@/content/projects";
import { projectsPath } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";

const SOURCE_ID = "panorama" as const;

export function TestimonialSection() {
  const { locale, t } = useI18n();
  const copy = t.projects.items[SOURCE_ID];
  const project = projects.find((p) => p.id === SOURCE_ID);
  if (!copy.quote || !project) return null;
  const image = wideImage(project);

  return (
    <section aria-labelledby="testimonial-heading" className="site-block">
      <div className="mx-auto grid max-w-[90rem] items-center gap-10 px-4 py-14 sm:px-8 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] lg:gap-16 lg:px-10 lg:py-20">
        <ScrollReveal blur={0} y={20}>
          <TiltedCard className="max-w-[14rem] md:max-w-none" rotateAmplitude={10}>
            <Link
              href={projectsPath(locale)}
              data-cursor-label={t.projects.cursorView}
              className="relative block aspect-[4/5] w-full max-w-[14rem] md:max-w-none overflow-hidden rounded-[1.25rem] bg-[#0f1115]"
            >
              <Image
                src={image}
                alt={copy.alt}
                fill
                sizes="14rem"
                className="object-cover object-center"
              />
            </Link>
          </TiltedCard>
        </ScrollReveal>
        <ScrollReveal>
          <figure>
            <p
              id="testimonial-heading"
              className="text-[0.65rem] font-medium uppercase tracking-[0.35em] text-accent"
            >
              {t.testimonial.kicker}
            </p>
            <blockquote className="mt-6">
              <p className="max-w-[28ch] font-[family-name:var(--font-display)] text-[clamp(1.6rem,3.4vw,3rem)] font-medium leading-[1.04] tracking-[-0.045em] text-foreground text-balance">
                “{copy.quote}”
              </p>
            </blockquote>
            <figcaption className="mt-6 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-neutral-500">
              — {copy.attribution}
            </figcaption>
          </figure>
        </ScrollReveal>
      </div>
    </section>
  );
}
