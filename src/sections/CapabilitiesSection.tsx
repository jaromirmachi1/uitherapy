import { ScrollReveal } from "@/components/reactbits/ScrollReveal";

const items = [
  {
    title: "Performance",
    body: "LCP-first, CLS under control, INP that survives real devices and throttled CPUs.",
  },
  {
    title: "Technical SEO",
    body: "Semantic landmarks, metadata, OG, sitemap, JSON-LD—content machines can read.",
  },
  {
    title: "Motion",
    body: "Scroll choreography and micro-interactions that sell the story without noise.",
  },
  {
    title: "Accessibility",
    body: "Keyboard, contrast, focus—not a checklist bolt-on, part of the craft.",
  },
] as const;

export function CapabilitiesSection() {
  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-heading"
      className="border-b border-accent/12 bg-[#030303]"
    >
      <div className="mx-auto max-w-[90rem] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-24">
          <ScrollReveal className="lg:sticky lg:top-32 lg:self-start">
            <div>
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.35em] text-accent/75">
                Lab
              </p>
              <h2
                id="capabilities-heading"
                className="mt-4 font-[family-name:var(--font-display)] text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-[-0.03em] text-white"
              >
                Frontend focus
              </h2>
              <p className="mt-6 text-neutral-400">
                One discipline, end to end: systems thinking, implementation detail, and
                discoverability as a single surface.
              </p>
            </div>
          </ScrollReveal>
          <ul className="grid gap-px bg-white/[0.08] sm:grid-cols-2">
            {items.map((item, i) => (
              <li key={item.title}>
                <ScrollReveal delay={i * 0.05} className="h-full">
                  <div className="h-full bg-black p-8 transition-colors hover:bg-white/[0.03] sm:p-10">
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-neutral-500">{item.body}</p>
                  </div>
                </ScrollReveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
