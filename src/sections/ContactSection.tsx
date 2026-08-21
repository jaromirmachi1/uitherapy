"use client";

import { ScrollReveal } from "@/components/reactbits/ScrollReveal";
import { useConversation } from "@/components/conversation/ConversationProvider";
import { useI18n } from "@/i18n/provider";
import { motion } from "motion/react";

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function ContactSection() {
  const { t } = useI18n();
  const { openConversation } = useConversation();

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="site-block relative overflow-hidden"
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden bg-[#d7dbe6]"
        aria-hidden
      >
        <div
          className="absolute inset-0"
          style={{
            background: [
              "radial-gradient(ellipse 70% 55% at 88% 8%, rgba(31,94,255,0.42), transparent 58%)",
              "radial-gradient(ellipse 55% 45% at 8% 92%, rgba(31,94,255,0.22), transparent 52%)",
              "radial-gradient(ellipse 40% 30% at 42% 48%, rgba(255,255,255,0.55), transparent 70%)",
            ].join(","),
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.38]"
          style={{
            backgroundImage: "radial-gradient(#2b2b2b 0.7px, transparent 0.8px)",
            backgroundSize: "13px 13px",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.14] mix-blend-multiply"
          style={{ backgroundImage: NOISE, backgroundSize: "180px 180px" }}
        />
      </div>

      <div className="relative mx-auto max-w-[90rem] px-4 py-20 sm:px-6 lg:px-10 lg:py-36">
        <ScrollReveal>
          <div>
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.35em] text-accent">
              {t.contact.kicker}
            </p>
            <h2
              id="contact-heading"
              className="mt-6 max-w-4xl font-[family-name:var(--font-display)] text-[clamp(2.25rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.04em] text-foreground"
            >
              {t.contact.heading}
            </h2>
            <p className="mt-8 max-w-lg text-neutral-600">{t.contact.body}</p>
          </div>
        </ScrollReveal>
        <ScrollReveal className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center" delay={0.12}>
          <motion.button
            type="button"
            onClick={openConversation}
            className="inline-flex h-14 min-w-[240px] items-center justify-center rounded-full bg-foreground px-10 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-[0_20px_55px_rgba(23,21,16,0.18)] transition-colors hover:bg-accent"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
          >
            {t.contact.openForm}
          </motion.button>
          <motion.a
            href="#projects"
            className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-neutral-500 transition-colors hover:text-accent"
            whileHover={{ x: -4 }}
          >
            ← {t.contact.back}
          </motion.a>
        </ScrollReveal>
      </div>
    </section>
  );
}
