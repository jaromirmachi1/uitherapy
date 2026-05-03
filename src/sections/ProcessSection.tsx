import { SpotlightCard } from "@/components/reactbits/SpotlightCard";

const steps = [
  {
    title: "Align",
    label: "Strategy",
    text: "Goals, audience, and what “premium” means in motion and type.",
  },
  {
    title: "Architect",
    label: "Structure",
    text: "Routes, content model, component API—SEO and a11y in the blueprint.",
  },
  {
    title: "Craft",
    label: "Interface",
    text: "UI systems, responsive behavior, animation language in real code.",
  },
  {
    title: "Harden",
    label: "Launch",
    text: "Perf budgets, a11y passes, analytics—ship with confidence.",
  },
] as const;

export function ProcessSection() {
  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      data-gsap="horizontal-section"
      className="relative overflow-hidden border-b border-accent/12 bg-black"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden
        style={{
          background:
            "radial-gradient(circle at 12% 30%, rgba(82, 38, 255, 0.18), transparent 34%), radial-gradient(circle at 82% 62%, rgba(255, 255, 255, 0.055), transparent 32%)",
        }}
      />

      <div
        data-gsap-horizontal-viewport
        className="relative overflow-x-auto [scrollbar-width:none] lg:overflow-hidden [&::-webkit-scrollbar]:hidden"
      >
        <div
          data-gsap-horizontal-track
          className="flex min-h-dvh w-max snap-x snap-mandatory px-4 py-24 sm:px-6 lg:px-10 lg:py-0"
        >
          <div className="flex min-h-[calc(100dvh-8rem)] w-[86vw] max-w-[50rem] shrink-0 snap-start flex-col justify-between pr-8 sm:w-[74vw] lg:min-h-dvh lg:w-[52vw] lg:py-32 lg:pr-16">
            <div data-gsap="reveal">
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.35em] text-accent/75">
                Process
              </p>
              <h2
                id="process-heading"
                className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-[clamp(2.5rem,7vw,5.8rem)] font-bold leading-[0.94] tracking-[-0.045em] text-white"
              >
                From brief to launch, no black box.
              </h2>
              <p className="mt-8 max-w-md border-l border-accent/40 pl-6 text-sm leading-relaxed text-neutral-400 sm:text-base">
                A focused build sequence designed for polished interfaces, fast
                pages, and content that search engines can understand.
              </p>
            </div>
            <div className="mt-14 flex items-center gap-4 text-[0.62rem] uppercase tracking-[0.3em] text-neutral-600">
              <span>Side scroll</span>
              <span className="h-px w-20 bg-accent/40" aria-hidden />
            </div>
          </div>

          <ol className="flex min-h-[calc(100dvh-8rem)] w-max snap-x snap-mandatory gap-5 lg:min-h-dvh lg:gap-8 lg:py-32">
            {steps.map((step, i) => {
              const n = String(i + 1).padStart(2, "0");
              return (
                <li
                  key={step.title}
                  className="group w-[82vw] max-w-[28rem] shrink-0 snap-center sm:w-[58vw] lg:w-[38rem]"
                >
                  <SpotlightCard
                    spotlightHex="A855F7"
                    className="group flex min-h-[min(72vh,640px)] flex-col justify-between rounded-2xl border border-white/[0.1] bg-neutral-950/80 p-6 shadow-[0_16px_48px_rgba(0,0,0,0.35)] transition-[border-color,background-color] duration-300 hover:border-[#A855F7]/45 hover:bg-neutral-950/90 sm:min-h-[min(76vh,680px)] sm:p-8"
                  >
                    <div
                      className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-px bg-gradient-to-r from-transparent via-[#A855F7]/55 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      aria-hidden
                    />
                    <div className="flex items-start justify-between gap-8">
                      <span className="font-mono text-xs tracking-[0.32em] text-[#A855F7]">
                        {n}
                      </span>
                      <span className="text-right text-[0.6rem] uppercase tracking-[0.3em] text-neutral-600">
                        {step.label}
                      </span>
                    </div>

                    <div className="mt-20 sm:mt-28">
                      <h3 className="max-w-full font-[family-name:var(--font-display)] text-[clamp(2.1rem,6.2vw,3.85rem)] font-bold leading-[0.96] tracking-[-0.055em] text-white">
                        {step.title}
                      </h3>
                      <p className="mt-7 max-w-sm text-sm leading-[1.75] text-neutral-400 sm:text-base">
                        {step.text}
                      </p>
                    </div>

                    <div className="mt-14 flex items-center justify-between border-t border-white/[0.08] pt-5">
                      <span className="text-[0.62rem] uppercase tracking-[0.28em] text-neutral-600">
                        0{i + 1} / 04
                      </span>
                      <span
                        className="h-2 w-2 rounded-full bg-[#A855F7] shadow-[0_0_20px_rgba(168,85,247,0.85)]"
                        aria-hidden
                      />
                    </div>
                  </SpotlightCard>
                </li>
              );
            })}
          </ol>

          <div
            className="sticky right-0 top-0 hidden h-dvh w-32 shrink-0 bg-gradient-to-l from-black via-black/80 to-transparent lg:block"
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}
