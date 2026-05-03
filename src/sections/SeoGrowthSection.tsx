import { MetaBalls } from "@/components/reactbits/MetaBalls";
import { ScrollReveal } from "@/components/reactbits/ScrollReveal";

const services = [
  {
    title: "SEO",
    body: "Basic SEO is included with every website: metadata, semantic structure, sitemap, robots, alt text, performance basics, and crawlable content. Full SEO is available when you want deeper growth.",
  },
  {
    title: "Marketing",
    body: "We help shape landing page direction, campaign messaging, offer clarity, analytics foundations, and the conversion path around the website.",
  },
  {
    title: "Branding",
    body: "We refine the visual tone, brand feel, typography direction, and digital presence so your site looks intentional before a visitor reads a word.",
  },
] as const;

export function SeoGrowthSection() {
  return (
    <section
      id="seo-growth"
      aria-labelledby="seo-growth-heading"
      className="relative isolate overflow-hidden border-b border-accent/12 bg-black"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden
        style={{
          background:
            "radial-gradient(circle at 18% 22%, rgba(82, 38, 255, 0.22), transparent 32%), radial-gradient(circle at 76% 78%, rgba(168, 85, 247, 0.12), transparent 34%)",
        }}
      />
      <MetaBalls />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/35 via-transparent to-black/55"
        aria-hidden
      />

      <div className="relative z-10 mx-auto grid max-w-[90rem] gap-16 px-4 py-24 sm:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] lg:items-center lg:px-10 lg:py-36">
        <ScrollReveal>
          <div>
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.35em] text-accent/75">
              SEO · Marketing · Branding
            </p>
            <h2
              id="seo-growth-heading"
              className="mt-5 max-w-4xl font-[family-name:var(--font-display)] text-[clamp(2.5rem,7vw,5.5rem)] font-bold leading-[0.94] tracking-[-0.05em] text-white"
            >
              Built to look premium and be understood.
            </h2>
            <p className="mt-8 max-w-lg border-l border-accent/40 pl-6 text-sm leading-relaxed text-neutral-400 sm:text-base">
              We do basic SEO for every website by default. When you need a full
              growth layer, we can extend the work into full SEO, marketing, and
              branding so the experience has strategy behind the visuals.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.12}>
          <div className="relative z-10 grid gap-5">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-accent">
              Move your cursor through the background.
            </p>
            <div className="grid gap-4">
              {services.map((service, index) => (
                <article
                  key={service.title}
                  className="rounded-2xl border border-white/10 bg-black/55 p-6 backdrop-blur-md transition-colors duration-300 hover:border-accent/45 hover:bg-black/70"
                >
                  <div className="flex items-start justify-between gap-6">
                    <h3 className="text-lg font-semibold text-white">{service.title}</h3>
                    <span className="font-mono text-xs tracking-[0.24em] text-accent/80">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-neutral-500">
                    {service.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
