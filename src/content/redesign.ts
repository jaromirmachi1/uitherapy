/**
 * Landing page for "redesign webu" searches: /redesign-webu (cs) · /en/website-redesign (en).
 * Copy lives here; prices come from content/pricing.ts so they never drift.
 */
import type { Locale } from "@/i18n/config";
import { formatCzk, packagePrices, redesignFrom } from "@/content/pricing";

/** Fills {redesign} / {start} with current prices from the price list. */
export function withPrices(text: string, locale: Locale) {
  return text
    .replaceAll("{redesign}", formatCzk(redesignFrom, locale))
    .replaceAll("{start}", formatCzk(packagePrices.start, locale));
}

const cs = {
  seoTitle: "Redesign webu pro firmy — nový vzhled od {redesign}",
  seoDescription:
    "Redesign a modernizace firemního webu. Nový vzhled, rychlost a lepší výsledky na Googlu bez ztráty pozic. Předělávka vizuálu od {redesign}, nový web od {start}. Brno a celá ČR.",
  kicker: "Redesign webu",
  title: "Nový vzhled webu pro firmy, kterým web stárne rychleji než značka",
  intro:
    "Váš web funguje, ale vypadá na rok 2015. Udělám redesign, po kterém bude web moderní, rychlý na mobilu a srozumitelný pro zákazníky, a to bez ztráty pozic na Googlu.",
  priceLead: "Předělávka vizuálu od",
  newSiteLead: "Nový web od",
  cta: "Chci nový vzhled webu",
  signsTitle: "Kdy web potřebuje redesign",
  signs: [
    "Na mobilu se špatně čte nebo rozpadá.",
    "Vypadá zastarale vedle konkurence a stydíte se ho poslat klientům.",
    "Načítá se pomalu a lidé odcházejí dřív, než se ozvou.",
    "Neodpovídá tomu, kde je vaše firma dnes: služby, ceny, reference.",
    "Úpravy jsou drahé nebo je umí jen jeden člověk.",
  ],
  pathsTitle: "Dvě cesty k novému webu",
  paths: [
    {
      name: "Předělávka vizuálu",
      body: "Nový design na stávajícím webu. Zůstává obsah, systém i adresy stránek, mění se vzhled, typografie a mobilní verze.",
      priceKey: "redesign" as const,
    },
    {
      name: "Nový web",
      body: "Když stará technika brzdí. Postavím web znovu na míru, převedu obsah a nastavím přesměrování, aby se neztratilo SEO.",
      priceKey: "start" as const,
    },
  ],
  processTitle: "Jak redesign probíhá",
  process: [
    { title: "Audit", body: "Projdu současný web, rychlost, mobil a to, co už na Googlu funguje." },
    { title: "Návrh", body: "Navrhnu nový vzhled a strukturu. Uvidíte ho dřív, než se cokoli programuje." },
    { title: "Vývoj", body: "Web postavím rychlý, přístupný a připravený na vyhledávače." },
    { title: "Spuštění bez ztráty pozic", body: "Přesměruji staré adresy, zkontroluji indexaci a hlídám, že návštěvnost nespadne." },
  ],
  workTitle: "Ukázky práce",
  workLink: "Všechny projekty",
  faqTitle: "Časté otázky k redesignu",
  faq: [
    {
      q: "Přijdu po redesignu o pozice na Googlu?",
      a: "Nemusíte. Zachovám adresy stránek, nebo staré adresy přesměruji na nové (301), přenesu titulky a popisy a po spuštění zkontroluji indexaci v Google Search Console.",
    },
    {
      q: "Kolik stojí redesign webu?",
      a: "Předělávka vizuálu stávajícího webu začíná na {redesign}, nový web na {start}. Přesnou cenu pošlu po krátkém hovoru, podle rozsahu a stavu současného webu. Ceny jsou orientační.",
    },
    {
      q: "Jaký je rozdíl mezi redesignem a novým webem?",
      a: "Redesign mění vzhled a uživatelský zážitek a technika zůstává. Nový web dává smysl, když je stará technika pomalá, nebezpečná nebo nejde rozumně upravovat.",
    },
    {
      q: "Pracujete jen v Brně?",
      a: "Sídlím v Brně, ale pracuji pro firmy z celé České republiky. Většinu věcí vyřešíme online, osobní schůzka je samozřejmě možná.",
    },
  ],
  finalTitle: "Pošlete mi odkaz na současný web",
  finalBody: "Podívám se na něj a navrhnu, jestli stačí předělávka vizuálu, nebo se vyplatí nový web.",
  finalCta: "Domluvme se",
};

const en: typeof cs = {
  seoTitle: "Website redesign for companies — new look from {redesign}",
  seoDescription:
    "Website redesign and modernisation for companies. A new look, speed and better Google results without losing rankings. Visual redesign from {redesign}, new website from {start}.",
  kicker: "Website redesign",
  title: "A new look for companies whose website ages faster than their brand",
  intro:
    "Your website works, but it looks like 2015. I’ll redesign it so it’s modern, fast on mobile and clear for customers, without losing your Google rankings.",
  priceLead: "Visual redesign from",
  newSiteLead: "New website from",
  cta: "I want a new look",
  signsTitle: "When a website needs a redesign",
  signs: [
    "It’s hard to read or breaks on mobile.",
    "It looks dated next to competitors and you hesitate to send it to clients.",
    "It loads slowly and people leave before they get in touch.",
    "It no longer reflects your company: services, prices, case studies.",
    "Edits are expensive or only one person can make them.",
  ],
  pathsTitle: "Two ways to a new website",
  paths: [
    {
      name: "Visual redesign",
      body: "A new design on your current site. Content, platform and page addresses stay; the look, typography and mobile version change.",
      priceKey: "redesign",
    },
    {
      name: "New website",
      body: "When old tech holds you back. I rebuild the site, move the content and set up redirects so SEO isn’t lost.",
      priceKey: "start",
    },
  ],
  processTitle: "How a redesign works",
  process: [
    { title: "Audit", body: "I review your current site, speed, mobile and what already works on Google." },
    { title: "Design", body: "I design the new look and structure. You see it before anything is built." },
    { title: "Build", body: "A fast, accessible site that’s ready for search engines." },
    { title: "Launch without losing rankings", body: "I redirect old addresses, check indexing and make sure traffic doesn’t drop." },
  ],
  workTitle: "Selected work",
  workLink: "All projects",
  faqTitle: "Website redesign FAQ",
  faq: [
    {
      q: "Will I lose my Google rankings after a redesign?",
      a: "You shouldn’t. I keep page addresses or redirect old ones (301), carry over titles and descriptions, and check indexing in Google Search Console after launch.",
    },
    {
      q: "How much does a website redesign cost?",
      a: "A visual redesign of your current site starts at {redesign}, a new website at {start}. I’ll send an exact quote after a short call, based on scope and the state of your current site. Prices are indicative.",
    },
    {
      q: "What’s the difference between a redesign and a new website?",
      a: "A redesign changes the look and user experience while the tech stays. A new website makes sense when the old tech is slow, insecure or hard to edit.",
    },
    {
      q: "Do you only work in Brno?",
      a: "I’m based in Brno but work with companies across the Czech Republic. Most things happen online, and meeting in person is always possible.",
    },
  ],
  finalTitle: "Send me a link to your current site",
  finalBody: "I’ll take a look and tell you whether a visual redesign is enough or a new website pays off.",
  finalCta: "Let’s talk",
};

export const redesignCopy: Record<Locale, typeof cs> = { cs, en };

/** Projects shown on the page (screens from public/projects). */
export const redesignWork = [
  { name: "Převezem", image: "/projects/prevezem-desk.webp" },
  { name: "Doktor Barber", image: "/projects/doktor-desk.webp" },
  { name: "Ouren", image: "/projects/ouren-desk.webp" },
];
