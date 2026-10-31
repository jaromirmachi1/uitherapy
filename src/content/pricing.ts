/**
 * Ceník — single source of truth for /cenik and /en/pricing.
 * Prices are CZK without VAT. Change numbers here; totals and the
 * subscription comparison are computed from them.
 */
import type { Locale } from "@/i18n/config";

/** Minimum subscription term, in months. */
export const SUBSCRIPTION_MONTHS = 24;

export type CareId = "basic" | "standard" | "growth";
export type PackageId = "start" | "business" | "premium" | "eshop";

export const carePrices: Record<CareId, number> = {
  basic: 990,
  standard: 2490,
  growth: 4900,
};

export const packagePrices: Record<PackageId, number> = {
  start: 35000,
  business: 50000,
  premium: 110000,
  eshop: 60000,
};

/** Example project shown on each package card. */
export const packageExample: Record<PackageId, { id: string; image: string }> = {
  start: { id: "Doktor Barber", image: "/projects/doktor-desk.webp" },
  business: { id: "Převezem", image: "/projects/prevezem-desk.webp" },
  premium: { id: "Ouren", image: "/projects/ouren-desk.webp" },
  eshop: { id: "biziboiz", image: "/projects/biziboiz-desk.webp" },
};

export const featuredPackage: PackageId = "business";

/** Web + care bundled, paid monthly over SUBSCRIPTION_MONTHS. */
export const subscriptions: {
  id: string;
  pkg: Exclude<PackageId, "eshop">;
  care: CareId;
  entry: number;
  monthly: number;
}[] = [
  { id: "start", pkg: "start", care: "basic", entry: 9900, monthly: 2290 },
  { id: "business", pkg: "business", care: "standard", entry: 14900, monthly: 4900 },
  { id: "premium", pkg: "premium", care: "growth", entry: 29900, monthly: 9200 },
];

export const redesignFrom = 20000;

export const subscriptionTotal = (s: (typeof subscriptions)[number]) =>
  s.entry + s.monthly * SUBSCRIPTION_MONTHS;

export const oneOffWithCareTotal = (s: (typeof subscriptions)[number]) =>
  packagePrices[s.pkg] + carePrices[s.care] * SUBSCRIPTION_MONTHS;

export function formatCzk(value: number, locale: Locale) {
  return locale === "cs"
    ? `${value.toLocaleString("cs-CZ").replace(/\s/g, " ")} Kč`
    : `CZK ${value.toLocaleString("en-US")}`;
}

type PackageCopy = { name: string; lead: string; includes: string[] };
type CareCopy = { name: string; includes: string[] };

const cs = {
  seoTitle: "Ceník webů a e-shopů",
  seoDescription:
    "Orientační ceny webů, Shopify e-shopů a správy webu. Jednorázově, nebo jako web v předplatném bez velké investice najednou. Ceny bez DPH.",
  kicker: "Ceník",
  title: "Kolik stojí web, za který se nebudete stydět?",
  intro:
    "Orientační ceny podle typického rozsahu. Každý web dělám na míru, přesnou nabídku pošlu po krátkém hovoru nebo osobním setkání. Ceny jsou bez DPH.",
  modes: { oneOff: "Jednorázově", subscription: "Web v předplatném" },
  from: "od",
  featured: "Nejčastěji",
  includesLabel: "V ceně",
  exampleLabel: "Ukázka",
  cta: "Chci tento web",
  packages: {
    start: {
      name: "Start",
      lead: "Landing page nebo malý web pro rychlý start.",
      includes: ["1–5 stránek", "Design na míru", "Kontaktní formulář", "Základní SEO", "Mobilní verze"],
    },
    business: {
      name: "Firma",
      lead: "Firemní web s prostorem pro růst.",
      includes: ["5–10 stránek", "Administrace (CMS)", "SEO", "Texty", "Reference a realizace"],
    },
    premium: {
      name: "Prémium",
      lead: "Individuální web, který si lidé zapamatují.",
      includes: ["Rozsah na míru", "Motion a animace", "Vícejazyčnost", "Napojení na vaše systémy", "Vše z balíčku Firma"],
    },
    eshop: {
      name: "E-shop",
      lead: "Shopify e-shop, který vypadá jako značka.",
      includes: ["Shopify na míru", "Platby a doprava", "Základní SEO", "Zaškolení do administrace"],
    },
  } satisfies Record<PackageId, PackageCopy>,
  sub: {
    title: "Web v předplatném",
    intro:
      "Nemusíte dávat celou částku najednou a o web se nestaráte. Platíte vstupní poplatek a pak měsíčně, minimálně 24 měsíců. Potom je web váš.",
    entry: "Vstupní poplatek",
    monthly: "měsíčně",
    term: "Smlouva na 24 měsíců, pak web patří vám",
    includesCare: "Včetně správy",
    total: "Celkem za 24 měsíců",
    compare: "Jednorázově se správou",
    honest:
      "Na rovinu: jednorázově vychází web zhruba o 10 % levněji. Předplatné platíte za pohodlí, že nemusíte investovat všechno najednou. Po 24 měsících můžete pokračovat jen se správou za běžnou cenu.",
  },
  care: {
    title: "Správa webu",
    intro: "K jednorázovému webu. Hosting, zálohy a úpravy, abyste nemuseli nic řešit.",
    perMonth: "/ měs.",
    tiers: {
      basic: {
        name: "Základ",
        includes: ["Hosting", "Zálohy a zabezpečení", "Hlídání výpadků", "Drobné úpravy do 30 min měsíčně"],
      },
      standard: {
        name: "Standard",
        includes: ["Vše ze Základu", "2 hodiny úprav měsíčně", "Přidávání realizací a novinek", "Měsíční report"],
      },
      growth: {
        name: "Růst",
        includes: ["Vše ze Standardu", "SEO péče", "1 článek měsíčně", "Úpravy podle výsledků"],
      },
    } satisfies Record<CareId, CareCopy>,
  },
  redesign: {
    title: "Máte web, jen vypadá staře?",
    body: "Předělám vizuál stávajícího webu bez stavby od nuly.",
    price: "Předělávka vizuálu od",
    cta: "Chci předělat web",
  },
  faqTitle: "Časté otázky",
  faq: [
    {
      q: "Který balíček je pro mě?",
      a: "Start, když potřebujete rychle představit jednu službu. Firma pro web se službami, referencemi a prostorem pro růst. Prémium pro web s vlastními funkcemi, více jazyky nebo výraznou animací. Nevíte? Napište mi a rozsah upřesníme spolu.",
    },
    {
      q: "Proč je předplatné dražší než jednorázová platba?",
      a: "Web postavím hned, ale platíte ho postupně dva roky. Rozdíl zhruba 10 % pokrývá to, že na peníze čekám. Kdo může zaplatit najednou, ušetří.",
    },
    {
      q: "Komu patří web a doména?",
      a: "Doména je vždy registrovaná na vás. Při jednorázové platbě je web váš po zaplacení, v předplatném po skončení 24měsíční smlouvy.",
    },
    {
      q: "Co když chci předplatné ukončit dřív?",
      a: "Smlouva je na minimálně 24 měsíců. Při dřívějším ukončení se doplácí zbývající měsíce a web pak přechází na vás.",
    },
    {
      q: "Jak získám přesnou nabídku?",
      a: "Vyplňte krátký formulář nebo napište e-mail. Ozvu se do dvou pracovních dnů, domluvíme hovor nebo schůzku a pošlu nabídku s rozsahem, termínem a cenou. Nezávazně.",
    },
  ],
  finalTitle: "Nevíte, co vybrat?",
  finalBody: "Popište mi projekt. Doporučím rozsah a pošlu nabídku na míru.",
  finalCta: "Domluvme se",
};

const en: typeof cs = {
  seoTitle: "Website and e-shop pricing",
  seoDescription:
    "Indicative prices for websites, Shopify stores and website care. Pay once, or get your website as a subscription with no big upfront cost. Prices exclude VAT.",
  kicker: "Pricing",
  title: "What does a website you’re proud of cost?",
  intro:
    "Indicative prices for a typical scope. Every site is made to measure, so I’ll send an exact quote after a short call or meeting. Prices exclude VAT.",
  modes: { oneOff: "One-off", subscription: "Website subscription" },
  from: "from",
  featured: "Most popular",
  includesLabel: "Included",
  exampleLabel: "Example",
  cta: "I want this",
  packages: {
    start: {
      name: "Start",
      lead: "A landing page or small site to get going fast.",
      includes: ["1–5 pages", "Custom design", "Contact form", "Basic SEO", "Mobile-ready"],
    },
    business: {
      name: "Business",
      lead: "A company website with room to grow.",
      includes: ["5–10 pages", "CMS", "SEO", "Copywriting", "Case studies"],
    },
    premium: {
      name: "Premium",
      lead: "A custom website people remember.",
      includes: ["Custom scope", "Motion and animation", "Multiple languages", "Integrations", "Everything in Business"],
    },
    eshop: {
      name: "E-shop",
      lead: "A Shopify store that looks like a brand.",
      includes: ["Custom Shopify theme", "Payments and shipping", "Basic SEO", "Admin training"],
    },
  },
  sub: {
    title: "Website subscription",
    intro:
      "No big upfront payment, and nothing to look after. An entry fee, then a monthly price for at least 24 months. After that, the website is yours.",
    entry: "Entry fee",
    monthly: "per month",
    term: "24-month contract, then the site is yours",
    includesCare: "Care included",
    total: "Total over 24 months",
    compare: "One-off plus care",
    honest:
      "To be upfront: paying once is about 10% cheaper. The subscription buys you the comfort of not investing everything at once. After 24 months you can continue with care only, at the regular price.",
  },
  care: {
    title: "Website care",
    intro: "For one-off websites. Hosting, backups and edits, so you don’t have to deal with any of it.",
    perMonth: "/ mo",
    tiers: {
      basic: {
        name: "Basic",
        includes: ["Hosting", "Backups and security", "Uptime monitoring", "Small edits up to 30 min a month"],
      },
      standard: {
        name: "Standard",
        includes: ["Everything in Basic", "2 hours of edits a month", "Adding projects and news", "Monthly report"],
      },
      growth: {
        name: "Growth",
        includes: ["Everything in Standard", "SEO care", "1 article a month", "Changes based on results"],
      },
    },
  },
  redesign: {
    title: "Have a website that just looks dated?",
    body: "I’ll redesign the look of your current site without rebuilding it from scratch.",
    price: "Visual redesign from",
    cta: "Redesign my site",
  },
  faqTitle: "FAQ",
  faq: [
    {
      q: "Which package is right for me?",
      a: "Start if you need to present one service quickly. Business for a site with services, case studies and room to grow. Premium for custom features, several languages or strong motion. Not sure? Write to me and we’ll scope it together.",
    },
    {
      q: "Why does the subscription cost more than paying once?",
      a: "I build the site right away, but you pay over two years. The roughly 10% difference covers that wait. If you can pay at once, you save.",
    },
    {
      q: "Who owns the website and the domain?",
      a: "The domain is always registered to you. Paid once, the site is yours on payment; on a subscription, at the end of the 24-month contract.",
    },
    {
      q: "What if I want to end the subscription early?",
      a: "The contract runs for at least 24 months. Ending early means paying the remaining months, after which the site passes to you.",
    },
    {
      q: "How do I get an exact quote?",
      a: "Fill in the short form or send an email. I’ll reply within two business days, we’ll set up a call or meeting, and I’ll send a proposal with scope, timeline and price. No obligation.",
    },
  ],
  finalTitle: "Not sure what to pick?",
  finalBody: "Tell me about the project. I’ll suggest a scope and send a tailored quote.",
  finalCta: "Let’s talk",
};

export const pricingCopy: Record<Locale, typeof cs> = { cs, en };
