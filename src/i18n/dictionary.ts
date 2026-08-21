import { defaultLocale, type Locale } from "./config";

const en = {
  skip: "Skip to main content",
  nav: {
    projects: "Projects",
    contact: "Start a conversation",
    language: "Language",
  },
  hero: {
    proof: ["SEO-ready", "Next.js", "Ecommerce", "Motion"] as const,
    proofLabel: "uitherapy focus",
    heading: "Creative web therapy for brands that can't afford to miss",
    body: "A senior frontend studio building premium marketing sites, ecommerce fronts, and search-ready interfaces.",
  },
  process: {
    kicker: "Process",
    heading: "From brief to launch, no black box.",
    body: "A focused build sequence designed for polished interfaces, fast pages, and content that search engines can understand.",
    steps: [
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
    ],
  },
  projects: {
    kicker: "Selected",
    heading: "See for yourself",
    intro:
      "Interfaces in the wild—swap for your own captures when we ship together.",
    spine: "Strategy · UI · build · ship",
    latestHeading: "Selected work",
    latestBody: "New projects typically start within two weeks.",
    viewProject: "View project",
    requestQuote: "Start a conversation",
    techLabel: "Technologies used",
    newTab: "(opens in a new tab)",
    items: {
      panorama: {
        category: "Web design and development",
        subcategory: "Design systems · Next.js",
        summary: "Residential launch site for a Brno developer.",
        location: "Brno",
        story:
          "A residential developer in Brno needed a site that could sell apartments before they existed as a physical experience. Built a fully animated Next.js site with unit browsing, availability states, and a visual language that matched the architectural identity of the project.",
        quote:
          "We started getting more clients coming to view the apartments. The site made everything feel prestigious — and we could run it as a Google Ad straight away.",
        attribution: "Panorama Žabiny, residential developer, Brno",
        alt: "Panorama Žabiny website showcase on a screen",
      },
      golden: {
        category: "Culture",
        subcategory: "Creative direction · Motion",
        summary: "Motion-forward site for a barber shop in Ostrava.",
        location: "Ostrava",
        story:
          "A barber shop in Ostrava with a sharp identity and zero digital presence to match it. Built a motion-forward experience using Next.js and Framer Motion — atmosphere over information, with a dark editorial visual language that put personality first.",
        quote:
          "People find us online now. It's like a business card — but with style. It's totally us.",
        attribution: "Golden Touch, barber shop, Ostrava",
        alt: "Golden Touch barber shop site on a phone",
      },
      dvd: {
        category: "Product",
        subcategory: "Product UI · Creative direction",
        summary: "Studio portfolio with Three.js motion and GSAP craft.",
        location: "Czechia",
        story:
          "A video production and creative direction studio whose work was sharper than their digital presence. Built a high-performance interface using Three.js and GSAP — motion language tuned so the work speaks, not the wrapper around it.",
        quote:
          "The site reflects our signature style — all our work in one place, under one roof. Clients can see the full picture.",
        attribution: "DVD Culture™, video production & creative direction",
        alt: "DVD Culture studio portfolio site preview",
      },
    },
  },
  contact: {
    kicker: "Contact",
    heading: "Let's ship something unforgettable.",
    body: "Product, timeline, references—we reply within two business days.",
    back: "Back to projects",
    mailSubject: "Project inquiry — uitherapy",
    openForm: "Start a conversation",
  },
  enquiry: {
    title: "Project enquiry",
    intro:
      "Share your project details and timeline, and we’ll get back to you shortly.",
    emailLead: "You can also",
    emailCta: "send us an email",
    emailTrail: "— we generally respond within 48h.",
    timezone: "Czechia, CET timezone",
    close: "Close",
    you: "You",
    company: "Your company",
    project: "Your project",
    more: "Tell us more",
    name: "Name",
    email: "Email",
    companyName: "Company name",
    website: "Website",
    budget: "Budget range",
    start: "Estimated start date",
    launch: "Expected launch date",
    brief: "My project is ...",
    send: "Send",
    sending: "Sending",
    privacy:
      "By sending this form you agree we may use these details to reply about your project.",
    successTitle: "Received.",
    successBody:
      "We’ll read this through and write back within two business days.",
    error:
      "Something went wrong sending this. Try again, or email us directly.",
    budgets: [
      { value: "5-10k", label: "€5k – €10k" },
      { value: "10-15k", label: "€10k – €15k" },
      { value: "15-25k", label: "€15k – €25k" },
      { value: "25k+", label: "€25k+" },
    ],
  },
  footer: {
    blurb: "Frontend craft—layout, motion, performance, accessibility.",
  },
  seo: {
    title: "uitherapy — Premium interfaces & technical SEO",
    description:
      "uitherapy is a frontend studio crafting luxury-grade web experiences—motion, typography, accessibility, and technical SEO baked in from day one.",
    tagline:
      "Premium interfaces, performance-first builds, and search-ready experiences.",
  },
};

const cs: typeof en = {
  skip: "Přeskočit na hlavní obsah",
  nav: {
    projects: "Projekty",
    contact: "Domluvme se",
    language: "Jazyk",
  },
  hero: {
    proof: ["SEO-ready", "Next.js", "Ecommerce", "Motion"] as const,
    proofLabel: "Zaměření uitherapy",
    heading:
      "Kreativní webová terapie pro značky, které si nemohou dovolit chybu",
    body: "Senior frontend studio pro prémiové marketingové weby, e-commerce a rozhraní připravená pro vyhledávače.",
  },
  process: {
    kicker: "Proces",
    heading: "Od briefu po spuštění — transparentně, žádná tajemství.",
    body: "Přehledný proces od briefu po launch — bez zbytečných kroků. Uhlazená rozhraní, rychlé stránky a obsah, kterému vyhledávače rozumí.",
    steps: [
      {
        title: "Sladit",
        label: "Strategie",
        text: "Cíle, publikum a co znamená „premium“ v pohybu a typografii.",
      },
      {
        title: "Navrhnout",
        label: "Struktura",
        text: "Routy, model obsahu, API komponent — SEO a přístupnost už v plánu.",
      },
      {
        title: "Vytvořit",
        label: "Rozhraní",
        text: "UI systémy, responzivní chování, styl animací v reálném kódu.",
      },
      {
        title: "Zpevnit",
        label: "Spuštění",
        text: "Výkonnostní rozpočty, a11y kontroly, analytika — spouštíme s jistotou.",
      },
    ],
  },
  projects: {
    kicker: "Vybrané",
    heading: "Podívejte se sami",
    intro:
      "Rozhraní venku ve světě — až budeme tvořit spolu, nahradíme je vašimi záběry.",
    spine: "Strategie · UI · stavba · spuštění",
    latestHeading: "Vybraná práce",
    latestBody: "Nové projekty obvykle začínají do dvou týdnů.",
    viewProject: "Zobrazit projekt",
    requestQuote: "Domluvme se",
    techLabel: "Použité technologie",
    newTab: "(otevře se v novém okně)",
    items: {
      panorama: {
        category: "Webdesign a vývoj",
        subcategory: "Design systémy · Next.js",
        summary: "Web pro rezidenčního developera v Brně.",
        location: "Brno",
        story:
          "Rezidenční developer v Brně potřeboval web, který prodá byty dřív, než existují jako fyzický zážitek. Postavili jsme plně animovaný Next.js web s výběrem jednotek, stavy dostupnosti a vizuálním jazykem, který sedí architektuře projektu.",
        quote:
          "Začali k nám chodit další klienti na prohlídky. Web působil prestižně — a hned jsme z něj mohli spustit Google reklamu.",
        attribution: "Panorama Žabiny, rezidenční developer, Brno",
        alt: "Web Panorama Žabiny na obrazovce",
      },
      golden: {
        category: "Kultura",
        subcategory: "Creative direction · Motion",
        summary: "Motion-first web pro barbershop v Ostravě.",
        location: "Ostrava",
        story:
          "Barbershop v Ostravě se ostrou identitou a nulovou digitální stopou, která by jí odpovídala. Postavili jsme motion-first zážitek na Next.js a Framer Motion — atmosféra před informacemi, tmavý editorial, který dává osobnost na první místo.",
        quote:
          "Lidi nás teď najdou online. Je to jako vizitka — ale se stylem. Jsme to přesně my.",
        attribution: "Golden Touch, barbershop, Ostrava",
        alt: "Web Golden Touch na telefonu",
      },
      dvd: {
        category: "Produkt",
        subcategory: "Product UI · Creative direction",
        summary: "Studiové portfolio s Three.js a GSAP.",
        location: "Česko",
        story:
          "Video produkce a creative direction studio, jehož práce byla ostřejší než digitální přítomnost. Postavili jsme výkonné rozhraní na Three.js a GSAP — pohyb naladěný tak, aby mluvila práce, ne obal kolem ní.",
        quote:
          "Web odráží náš rukopis — všechna práce na jednom místě, pod jednou střechou. Klienti vidí celý obraz.",
        attribution: "DVD Culture™, video produkce a creative direction",
        alt: "Náhled portfolia studia DVD Culture",
      },
    },
  },
  contact: {
    kicker: "Kontakt",
    heading: "Pojďme spustit něco, na co se nezapomíná.",
    body: "Produkt, termín, reference — odpovíme do dvou pracovních dnů.",
    back: "Zpět k projektům",
    mailSubject: "Poptávka projektu — uitherapy",
    openForm: "Domluvme se",
  },
  enquiry: {
    title: "Poptávka projektu",
    intro: "Napište detaily a termín projektu — ozveme se vám v krátkém čase.",
    emailLead: "Můžete také",
    emailCta: "poslat e-mail",
    emailTrail: "— obvykle odpovídáme do 48 hodin.",
    timezone: "Česko, časové pásmo CET",
    close: "Zavřít",
    you: "Vy",
    company: "Vaše firma",
    project: "Váš projekt",
    more: "Řekněte víc",
    name: "Jméno",
    email: "E-mail",
    companyName: "Název firmy",
    website: "Web",
    budget: "Rozpočet",
    start: "Předpokládaný start",
    launch: "Očekávané spuštění",
    brief: "Můj projekt je ...",
    send: "Odeslat",
    sending: "Odesílám",
    privacy:
      "Odesláním souhlasíte, že tyto údaje použijeme k odpovědi na poptávku.",
    successTitle: "Máme to.",
    successBody: "Přečteme to a ozveme se do dvou pracovních dnů.",
    error:
      "Odeslání se nepovedlo. Zkuste to znovu, nebo nám napište e-mailem.",
    budgets: [
      { value: "50-100k", label: "50–100 tis. Kč" },
      { value: "100-200k", label: "100–200 tis. Kč" },
      { value: "200-400k", label: "200–400 tis. Kč" },
      { value: "400k+", label: "400 tis. Kč+" },
    ],
  },
  footer: {
    blurb: "Frontend řemeslo — layout, pohyb, výkon, přístupnost.",
  },
  seo: {
    title: "uitherapy — Prémiová rozhraní a technické SEO",
    description:
      "uitherapy je frontend studio pro luxusní webové zážitky — pohyb, typografie, přístupnost a technické SEO od prvního dne.",
    tagline:
      "Prémiová rozhraní, výkon na prvním místě a zážitky připravené pro vyhledávače.",
  },
};

const dictionaries = { en, cs } as const;

export type Dictionary = typeof en;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}
