import { CardSwap } from "@/components/reactbits/CardSwap";
import { ScrollReveal } from "@/components/reactbits/ScrollReveal";

const ecommerceCards = [
  {
    title: "Shopify",
    eyebrow: "Hosted commerce",
    description:
      "Fast storefronts for brands that want polished product pages, conversion-focused landing flows, and a reliable checkout foundation.",
    points: ["Theme build", "Custom sections", "SEO setup"],
    image: {
      src: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=1200&q=80",
      alt: "Mock ecommerce storefront displayed on a laptop",
    },
  },
  {
    title: "Shoptet",
    eyebrow: "Czech ecommerce",
    description:
      "Premium Shoptet fronts for local businesses that need better hierarchy, stronger visuals, and cleaner product storytelling.",
    points: ["Template polish", "UX cleanup", "Performance pass"],
    image: {
      src: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80",
      alt: "Mock retail product shelves for an ecommerce catalog",
    },
  },
  {
    title: "Custom CMS",
    eyebrow: "Tailored stack",
    description:
      "Custom ecommerce systems when the product model, editorial workflow, or brand experience needs more control than a preset platform.",
    points: ["Next.js build", "CMS modeling", "Structured data"],
    image: {
      src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
      alt: "Mock custom CMS dashboard interface on a laptop",
    },
  },
] as const;

export function EcommerceSection() {
  return (
    <section
      id="ecommerce"
      aria-labelledby="ecommerce-heading"
      className="relative overflow-hidden border-b border-accent/12 bg-[#020202]"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden
        style={{
          background:
            "radial-gradient(circle at 80% 24%, rgba(82, 38, 255, 0.2), transparent 34%), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "auto, 72px 72px",
        }}
      />

      <div className="relative mx-auto grid max-w-[90rem] gap-16 px-4 py-24 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:items-center lg:px-10 lg:py-36">
        <ScrollReveal>
          <div>
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.35em] text-accent/75">
              Ecommerce
            </p>
            <h2
              id="ecommerce-heading"
              className="mt-5 max-w-4xl font-[family-name:var(--font-display)] text-[clamp(2.5rem,7vw,5.5rem)] font-bold leading-[0.94] tracking-[-0.05em] text-white"
            >
              E-shops that feel premium and sell clearly.
            </h2>
            <p className="mt-8 max-w-lg border-l border-accent/40 pl-6 text-sm leading-relaxed text-neutral-400 sm:text-base">
              I build ecommerce experiences for Shopify, Shoptet, and custom CMS
              stacks: clean product architecture, crawlable content, fast pages, and
              brand-forward interaction.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.12} className="flex justify-center lg:justify-end">
          <CardSwap cards={ecommerceCards} />
        </ScrollReveal>
      </div>
    </section>
  );
}
