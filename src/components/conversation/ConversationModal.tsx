"use client";

import { useI18n } from "@/i18n/provider";
import { siteEmail } from "@/seo/site";
import { useLenis } from "lenis/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useConversation } from "./ConversationProvider";

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const fieldClass =
  "h-12 w-full rounded-xl bg-[#ececec] px-4 text-sm text-foreground outline-none transition-[box-shadow,background-color] placeholder:text-foreground/35 focus:bg-white focus:shadow-[0_0_0_2px_var(--accent)]";

type FormState = {
  name: string;
  email: string;
  company: string;
  website: string;
  budget: string;
  start: string;
  launch: string;
  brief: string;
};

const empty: FormState = {
  name: "",
  email: "",
  company: "",
  website: "",
  budget: "",
  start: "",
  launch: "",
  brief: "",
};

export function ConversationModal() {
  const { isOpen, closeConversation } = useConversation();
  const { t, locale } = useI18n();
  const reduce = useReducedMotion();
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const [mounted, setMounted] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(empty);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;

    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    lenis?.stop();
    document.documentElement.classList.add("ut-modal-open");
    document.body.classList.add("ut-loading");

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeConversation();
      if (event.key !== "Tab" || !panelRef.current) return;
      const nodes = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select',
      );
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("ut-modal-open");
      document.body.classList.remove("ut-loading");
      lenis?.start();
      prev?.focus();
    };
  }, [closeConversation, isOpen, lenis]);

  useEffect(() => {
    if (!isOpen) {
      setSent(false);
      setSending(false);
      setError(null);
      setForm(empty);
    }
  }, [isOpen]);

  useEffect(() => {
    setForm((current) => ({ ...current, budget: "" }));
  }, [locale]);

  const ready =
    form.name.trim().length > 1 &&
    /\S+@\S+\.\S+/.test(form.email) &&
    form.budget.length > 0 &&
    form.brief.trim().length >= 3;

  const set =
    (key: keyof FormState) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setForm((current) => ({ ...current, [key]: event.target.value }));
    };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!ready || sending) return;

    setSending(true);
    setError(null);

    try {
      const budgetLabel =
        t.enquiry.budgets.find((item) => item.value === form.budget)?.label ??
        form.budget;

      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, budget: budgetLabel, locale }),
      });

      if (!response.ok) {
        setError(t.enquiry.error);
        return;
      }

      setSent(true);
      setForm(empty);
    } catch {
      setError(t.enquiry.error);
    } finally {
      setSending(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          data-lenis-prevent
          className="fixed inset-0 z-[125] overflow-y-auto overscroll-contain bg-[#d7dbe6] touch-pan-y [-webkit-overflow-scrolling:touch]"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#d7dbe6] max-sm:min-h-[100dvh] sm:absolute"
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
                backgroundImage:
                  "radial-gradient(#2b2b2b 0.7px, transparent 0.8px)",
                backgroundSize: "13px 13px",
              }}
            />
            <div
              className="absolute inset-0 opacity-[0.14] mix-blend-multiply"
              style={{ backgroundImage: NOISE, backgroundSize: "180px 180px" }}
            />
            <p className="absolute -right-8 bottom-[-4rem] font-[family-name:var(--font-display)] text-[clamp(8rem,22vw,18rem)] font-medium leading-none tracking-[-0.08em] text-accent/[0.08]">
              THERAPY
            </p>
          </div>

          <div className="relative z-10 flex min-h-[100dvh] flex-col max-sm:min-h-[100svh]">
            <div className="relative flex justify-end px-5 pt-5 sm:px-8 sm:pt-7">
              <button
                ref={closeRef}
                type="button"
                onClick={closeConversation}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md text-2xl leading-none text-foreground/70 transition-colors hover:bg-white/70 hover:text-foreground"
                aria-label={t.enquiry.close}
              >
                ×
              </button>
            </div>

            <div className="relative mx-auto grid w-full max-w-[92rem] flex-1 grid-cols-1 items-start gap-5 px-5 pb-[max(4rem,env(safe-area-inset-bottom))] sm:px-8 lg:grid-cols-[minmax(20rem,0.85fr)_minmax(0,1.2fr)] lg:gap-8 lg:px-12 xl:gap-10 xl:px-16">
            <motion.section
              className="rounded-[1.75rem] bg-white px-7 py-8 shadow-[0_24px_80px_rgba(43,43,43,0.08)] sm:px-10 lg:sticky lg:top-8"
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2
                id={titleId}
                className="font-[family-name:var(--font-display)] text-[clamp(2rem,4vw,3.1rem)] font-medium leading-[0.95] tracking-[-0.045em] text-foreground"
              >
                {t.enquiry.title}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-600 sm:text-base">
                {t.enquiry.intro}
              </p>
              <p className="mt-6 text-sm leading-relaxed text-neutral-600">
                {t.enquiry.emailLead}{" "}
                <a
                  href={`mailto:${siteEmail}`}
                  className="underline decoration-foreground/30 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                >
                  {t.enquiry.emailCta}
                </a>{" "}
                {t.enquiry.emailTrail}
              </p>
              <p className="mt-6 text-xs uppercase tracking-[0.18em] text-neutral-400">
                {t.enquiry.timezone}
              </p>
            </motion.section>

            <motion.section
              className="rounded-[1.75rem] bg-white px-7 py-8 shadow-[0_24px_80px_rgba(43,43,43,0.08)] sm:px-10 sm:py-10"
              initial={reduce ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.55,
                delay: 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {sent ? (
                <div className="py-10">
                  <p className="font-[family-name:var(--font-display)] text-4xl font-medium tracking-[-0.04em] text-foreground">
                    {t.enquiry.successTitle}
                  </p>
                  <p className="mt-4 max-w-md text-neutral-600">
                    {t.enquiry.successBody}
                  </p>
                </div>
              ) : (
                <form onSubmit={submit} className="flex flex-col gap-10">
                  <FormBlock index={1} label={t.enquiry.you}>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="sr-only" htmlFor="enquiry-name">
                        {t.enquiry.name}
                      </label>
                      <input
                        id="enquiry-name"
                        className={fieldClass}
                        placeholder={`${t.enquiry.name}*`}
                        autoComplete="name"
                        required
                        value={form.name}
                        onChange={set("name")}
                      />
                      <label className="sr-only" htmlFor="enquiry-email">
                        {t.enquiry.email}
                      </label>
                      <input
                        id="enquiry-email"
                        className={fieldClass}
                        type="email"
                        placeholder={`${t.enquiry.email}*`}
                        autoComplete="email"
                        required
                        value={form.email}
                        onChange={set("email")}
                      />
                    </div>
                  </FormBlock>

                  <FormBlock index={2} label={t.enquiry.company}>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="sr-only" htmlFor="enquiry-company">
                        {t.enquiry.companyName}
                      </label>
                      <input
                        id="enquiry-company"
                        className={fieldClass}
                        placeholder={t.enquiry.companyName}
                        autoComplete="organization"
                        value={form.company}
                        onChange={set("company")}
                      />
                      <label className="sr-only" htmlFor="enquiry-website">
                        {t.enquiry.website}
                      </label>
                      <input
                        id="enquiry-website"
                        className={fieldClass}
                        type="text"
                        placeholder={t.enquiry.website}
                        autoComplete="url"
                        value={form.website}
                        onChange={set("website")}
                      />
                    </div>
                  </FormBlock>

                  <FormBlock index={3} label={t.enquiry.project}>
                    <div className="grid gap-3 md:grid-cols-3">
                      <label className="sr-only" htmlFor="enquiry-budget">
                        {t.enquiry.budget}
                      </label>
                      <div className="relative">
                        <select
                          id="enquiry-budget"
                          className={`${fieldClass} appearance-none pr-10`}
                          required
                          value={form.budget}
                          onChange={set("budget")}
                        >
                          <option value="" disabled>
                            {t.enquiry.budget}*
                          </option>
                          {t.enquiry.budgets.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                        <span
                          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40"
                          aria-hidden
                        >
                          ⌄
                        </span>
                      </div>
                      <label className="sr-only" htmlFor="enquiry-start">
                        {t.enquiry.start}
                      </label>
                      <input
                        id="enquiry-start"
                        className={`${fieldClass} [color-scheme:light]`}
                        type="date"
                        aria-label={t.enquiry.start}
                        value={form.start}
                        onChange={set("start")}
                      />
                      <label className="sr-only" htmlFor="enquiry-launch">
                        {t.enquiry.launch}
                      </label>
                      <input
                        id="enquiry-launch"
                        className={`${fieldClass} [color-scheme:light]`}
                        type="date"
                        aria-label={t.enquiry.launch}
                        value={form.launch}
                        onChange={set("launch")}
                      />
                    </div>
                  </FormBlock>

                  <FormBlock index={4} label={t.enquiry.more}>
                    <label className="sr-only" htmlFor="enquiry-brief">
                      {t.enquiry.brief}
                    </label>
                    <textarea
                      id="enquiry-brief"
                      className={`${fieldClass} min-h-36 resize-y py-3`}
                      placeholder={`${t.enquiry.brief}*`}
                      required
                      minLength={3}
                      value={form.brief}
                      onChange={set("brief")}
                    />
                  </FormBlock>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <p className="max-w-sm text-xs leading-relaxed text-neutral-400">
                      {t.enquiry.privacy}
                    </p>
                    <button
                      type="submit"
                      disabled={!ready || sending}
                      className="inline-flex h-12 min-w-36 items-center justify-center rounded-md bg-foreground px-8 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:bg-foreground/25"
                    >
                      {sending ? t.enquiry.sending : t.enquiry.send}
                    </button>
                  </div>
                  {error ? (
                    <p className="text-sm text-red-600" role="alert">
                      {error}
                    </p>
                  ) : null}
                </form>
              )}
            </motion.section>
          </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

function FormBlock({
  index,
  label,
  children,
}: {
  index: number;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-4 flex w-full items-baseline justify-between gap-4 border-b border-black/10 pb-3">
        <span className="font-mono text-xs tabular-nums text-neutral-400">
          {index}
        </span>
        <span className="text-[0.62rem] font-medium uppercase tracking-[0.22em] text-neutral-400">
          {label}
        </span>
      </legend>
      {children}
    </fieldset>
  );
}
