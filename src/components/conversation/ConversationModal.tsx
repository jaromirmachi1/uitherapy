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
  "h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-[0.95rem] text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-foreground/35 hover:border-black/25 focus:border-accent focus:shadow-[0_0_0_3px_rgba(31,94,255,0.18)] aria-[invalid=true]:border-red-500";

type FormState = {
  services: string[];
  budget: string;
  timeline: string;
  name: string;
  email: string;
  company: string;
  brief: string;
};

type FieldKey = "name" | "email" | "budget" | "brief";

const empty: FormState = {
  services: [],
  budget: "",
  timeline: "",
  name: "",
  email: "",
  company: "",
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
  const [attempted, setAttempted] = useState(false);

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
      setAttempted(false);
      setForm(empty);
    }
  }, [isOpen]);

  useEffect(() => {
    setForm((current) => ({ ...current, budget: "" }));
  }, [locale]);

  // Keys in on-screen order, so the first error gets focus.
  const invalid: Record<FieldKey, boolean> = {
    budget: form.budget.length === 0,
    name: form.name.trim().length < 2,
    email: !/\S+@\S+\.\S+/.test(form.email),
    brief: form.brief.trim().length < 3,
  };
  const showError = (key: FieldKey) => attempted && invalid[key];

  const setText =
    (key: "name" | "email" | "company" | "brief") =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((current) => ({ ...current, [key]: event.target.value }));
    };

  const toggleService = (value: string) =>
    setForm((current) => ({
      ...current,
      services: current.services.includes(value)
        ? current.services.filter((item) => item !== value)
        : [...current.services, value],
    }));

  const labelFor = (
    list: readonly { value: string; label: string }[],
    value: string,
  ) => list.find((item) => item.value === value)?.label ?? value;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (sending) return;

    const firstInvalid = (Object.keys(invalid) as FieldKey[]).find(
      (key) => invalid[key],
    );
    if (firstInvalid) {
      setAttempted(true);
      panelRef.current
        ?.querySelector<HTMLElement>(`[data-field="${firstInvalid}"]`)
        ?.focus();
      return;
    }

    setSending(true);
    setError(null);

    try {
      const budget =
        form.budget === "unknown"
          ? t.enquiry.budgetUnknown
          : labelFor(t.enquiry.budgets, form.budget);

      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          brief: form.brief,
          budget,
          services: form.services
            .map((value) => labelFor(t.enquiry.services, value))
            .join(", "),
          timeline: form.timeline
            ? labelFor(t.enquiry.timelines, form.timeline)
            : "",
          locale,
        }),
      });

      if (!response.ok) {
        setError(t.enquiry.error);
        return;
      }

      setSent(true);
      setForm(empty);
      setAttempted(false);
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
            className="pointer-events-none fixed inset-0 z-0 min-h-[100lvh] overflow-hidden bg-[#d7dbe6]"
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

              <div className="mt-8 flex items-center gap-4">
                <span
                  aria-hidden
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent font-[family-name:var(--font-display)] text-sm font-semibold text-white"
                >
                  {t.enquiry.person
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">
                    {t.enquiry.person}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {t.enquiry.role}
                  </span>
                </span>
              </div>

              <div className="mt-8 hidden border-t border-black/10 pt-6 sm:block">
                <p className="text-[0.62rem] font-medium uppercase tracking-[0.22em] text-neutral-400">
                  {t.enquiry.nextTitle}
                </p>
                <ol className="mt-4 flex flex-col gap-3">
                  {t.enquiry.nextSteps.map((step, index) => (
                    <li key={step} className="flex gap-3 text-sm leading-relaxed text-neutral-700">
                      <span className="mt-[0.1rem] font-mono text-xs tabular-nums text-accent">
                        0{index + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <p className="mt-8 text-sm leading-relaxed text-neutral-600">
                {t.enquiry.emailLead}{" "}
                <a
                  href={`mailto:${siteEmail}`}
                  className="text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                >
                  {siteEmail}
                </a>
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
                <form
                  onSubmit={submit}
                  noValidate
                  className="flex flex-col gap-9"
                >
                  <FormBlock label={t.enquiry.servicesLabel} hint={t.enquiry.servicesHint}>
                    <div className="flex flex-wrap gap-2">
                      {t.enquiry.services.map((item) => (
                        <Chip
                          key={item.value}
                          type="checkbox"
                          name="services"
                          label={item.label}
                          checked={form.services.includes(item.value)}
                          onChange={() => toggleService(item.value)}
                        />
                      ))}
                    </div>
                  </FormBlock>

                  <FormBlock
                    label={`${t.enquiry.budget}*`}
                    error={showError("budget") ? t.enquiry.errors.budget : undefined}
                  >
                    <div className="flex flex-wrap gap-2">
                      {[
                        ...t.enquiry.budgets,
                        { value: "unknown", label: t.enquiry.budgetUnknown },
                      ].map((item, index) => (
                        <Chip
                          key={item.value}
                          type="radio"
                          name="budget"
                          label={item.label}
                          checked={form.budget === item.value}
                          onChange={() =>
                            setForm((current) => ({ ...current, budget: item.value }))
                          }
                          dataField={index === 0 ? "budget" : undefined}
                          invalid={showError("budget")}
                        />
                      ))}
                    </div>
                  </FormBlock>

                  <FormBlock label={t.enquiry.timelineLabel} hint={t.enquiry.optional}>
                    <div className="flex flex-wrap gap-2">
                      {t.enquiry.timelines.map((item) => (
                        <Chip
                          key={item.value}
                          type="radio"
                          name="timeline"
                          label={item.label}
                          checked={form.timeline === item.value}
                          onChange={() =>
                            setForm((current) => ({
                              ...current,
                              timeline: current.timeline === item.value ? "" : item.value,
                            }))
                          }
                        />
                      ))}
                    </div>
                  </FormBlock>

                  <FormBlock label={t.enquiry.contactLabel}>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field
                        id="enquiry-name"
                        label={`${t.enquiry.name}*`}
                        error={showError("name") ? t.enquiry.errors.name : undefined}
                      >
                        <input
                          id="enquiry-name"
                          data-field="name"
                          className={fieldClass}
                          autoComplete="name"
                          aria-invalid={showError("name")}
                          value={form.name}
                          onChange={setText("name")}
                        />
                      </Field>
                      <Field
                        id="enquiry-email"
                        label={`${t.enquiry.email}*`}
                        error={showError("email") ? t.enquiry.errors.email : undefined}
                      >
                        <input
                          id="enquiry-email"
                          data-field="email"
                          className={fieldClass}
                          type="email"
                          autoComplete="email"
                          aria-invalid={showError("email")}
                          value={form.email}
                          onChange={setText("email")}
                        />
                      </Field>
                      <Field
                        id="enquiry-company"
                        label={t.enquiry.companyName}
                        hint={t.enquiry.optional}
                        className="sm:col-span-2"
                      >
                        <input
                          id="enquiry-company"
                          className={fieldClass}
                          autoComplete="organization"
                          value={form.company}
                          onChange={setText("company")}
                        />
                      </Field>
                      <Field
                        id="enquiry-brief"
                        label={`${t.enquiry.brief}*`}
                        error={showError("brief") ? t.enquiry.errors.brief : undefined}
                        className="sm:col-span-2"
                      >
                        <textarea
                          id="enquiry-brief"
                          data-field="brief"
                          className={`${fieldClass} h-auto min-h-36 resize-y py-3 leading-relaxed`}
                          placeholder={t.enquiry.briefPlaceholder}
                          aria-invalid={showError("brief")}
                          value={form.brief}
                          onChange={setText("brief")}
                        />
                      </Field>
                    </div>
                  </FormBlock>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-sm text-xs leading-relaxed text-neutral-400">
                      {t.enquiry.privacy}
                    </p>
                    <button
                      type="submit"
                      disabled={sending}
                      className="inline-flex h-12 min-w-44 items-center justify-center rounded-full bg-foreground px-8 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-white transition-colors hover:bg-accent disabled:cursor-wait disabled:opacity-60"
                    >
                      {sending ? t.enquiry.sending : t.enquiry.send}
                    </button>
                  </div>
                  {attempted && Object.values(invalid).some(Boolean) ? (
                    <p className="-mt-4 text-sm text-red-600" role="alert">
                      {t.enquiry.required}
                    </p>
                  ) : null}
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
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-3 flex w-full items-baseline justify-between gap-4">
        <span className="font-[family-name:var(--font-display)] text-lg font-medium tracking-[-0.025em] text-foreground">
          {label}
        </span>
        {hint ? (
          <span className="text-xs text-neutral-400">{hint}</span>
        ) : null}
      </legend>
      {children}
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </fieldset>
  );
}

function Chip({
  type,
  name,
  label,
  checked,
  onChange,
  dataField,
  invalid,
}: {
  type: "checkbox" | "radio";
  name: string;
  label: string;
  checked: boolean;
  onChange: () => void;
  dataField?: string;
  invalid?: boolean;
}) {
  return (
    <label className="relative cursor-pointer">
      <input
        type={type}
        name={name}
        checked={checked}
        onChange={onChange}
        onClick={type === "radio" && checked ? onChange : undefined}
        data-field={dataField}
        className="peer sr-only"
      />
      <span
        className={`inline-flex h-11 items-center rounded-full border px-5 text-sm transition-[background-color,border-color,color] duration-200 peer-focus-visible:shadow-[0_0_0_3px_rgba(31,94,255,0.25)] ${
          checked
            ? "border-foreground bg-foreground text-white"
            : invalid
              ? "border-red-400 bg-white text-foreground hover:border-foreground/40"
              : "border-black/12 bg-white text-foreground hover:border-foreground/40"
        }`}
      >
        {label}
      </span>
    </label>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  className = "",
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label
        htmlFor={id}
        className="flex items-baseline justify-between gap-3 text-sm font-medium text-foreground/80"
      >
        {label}
        {hint ? (
          <span className="text-xs font-normal text-neutral-400">{hint}</span>
        ) : null}
      </label>
      {children}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
