import type { Locale } from "@/i18n/config";

export type ArticleSection = {
  heading?: string;
  paragraphs: string[];
};

export type ArticleCopy = {
  title: string;
  excerpt: string;
  category: string;
  dateLabel: string;
  author: string;
  authorRole: string;
  sections: ArticleSection[];
};

export type Article = {
  id: string;
  slugs: Record<Locale, string>;
  publishedAt: string;
  featured: boolean;
  copy: Record<Locale, ArticleCopy>;
};

export const articles: Article[] = [
  {
    id: "ai-mediocrity",
    slugs: {
      cs: "ai-je-past-prumernosti",
      en: "ai-is-a-trap-of-mediocrity",
    },
    publishedAt: "2026-03-26",
    featured: true,
    copy: {
      cs: {
        title: "AI je past průměrnosti firem, které je dobré se vyhnout",
        excerpt:
          "Generický AI obsah vypadá jako výsledek jednoho promptu. Značka tím ztrácí body — a prémiový klient to pozná.",
        category: "AI",
        dateLabel: "26. 3. 2026",
        author: "uitherapy",
        authorRole: "Frontend studio",
        sections: [
          {
            heading: "Past průměrnosti",
            paragraphs: [
              "LinkedIn, weby i kampaně vypadají dnes čím dál generičtěji. Objem a pravidelnost, které algoritmy odměňují, často zabíjí důmyslnost. Lidé obsah podvědomě ignorují — nebo jím opovrhují.",
              "Pokud AI obsah nedrží vizuální identitu a netlačí konkrétní myšlenky značky, firma postupně ztrácí profesionalitu. Vypadá-li prezentace jako výsledek jednoho promptu, značka právě ztratila body ze své hodnoty.",
            ],
          },
          {
            heading: "Proč generická AI ničí hodnotu značky",
            paragraphs: [
              "Značka je slib kvality. Když používáte stejné nástroje a reference jako konkurence — bez vkusu a kontextu — utápíte se v průměru. AI skvěle kopíruje formy, ale nerozumí vašemu byznysu.",
              "Prémiový klient pozná zkratku. Jakmile vycítí, že jste na prezentaci šetřili časem skrze AI, přestane věřit, že nebudete šetřit i na jeho projektu.",
            ],
          },
          {
            heading: "Síla AI pod kontrolou",
            paragraphs: [
              "V uitherapy AI používáme jako součást procesu — iterujeme, mažeme chyby a držíme artdirekci. Rozhoduje kvalita kontroly: schopnost říct „ne“ průměrnému výstupu a „ano“ detailům, které značku posouvají nad dav.",
              "Nespokojte se s prvním výsledkem. Kombinujte vlastní materiály. Řešte jeden až dva detaily, které by jinak zmizely. Udržujte konzistenci napříč kanály.",
            ],
          },
          {
            paragraphs: [
              "AI firmu nezabije. Posune laťku. Budoucnost patří těm, kdo umí držet vkus nad průměrem — a postavit prezentaci, které se dá věřit.",
            ],
          },
        ],
      },
      en: {
        title: "AI is a trap of mediocrity brands should avoid",
        excerpt:
          "Generic AI content reads like a single prompt. Brands lose trust — and premium clients notice.",
        category: "AI",
        dateLabel: "26 Mar 2026",
        author: "uitherapy",
        authorRole: "Frontend studio",
        sections: [
          {
            heading: "The mediocrity trap",
            paragraphs: [
              "LinkedIn posts, marketing sites, and campaigns look more generic every quarter. Volume rewarded by algorithms often kills craft. People ignore the content — or resent it.",
              "When AI output drifts from visual identity and fails to push a brand’s real ideas, professionalism erodes. If your presence looks like one ChatGPT pass, the brand just lost points.",
            ],
          },
          {
            heading: "Why generic AI drains brand value",
            paragraphs: [
              "A brand is a quality promise. Same tools and references as everyone else — without taste or context — sinks you into the average. AI copies form; it does not understand your business.",
              "Premium clients spot shortcuts. Once they feel you saved time with unguided AI, they assume you will cut corners on their work too.",
            ],
          },
          {
            heading: "AI under direction",
            paragraphs: [
              "At uitherapy we use AI inside the process — iterate, delete the weak passes, keep art direction in charge. Quality control decides: the ability to reject average output and protect the details that lift a brand above the feed.",
              "Do not accept the first result. Mix in your own assets. Fix one or two details that would otherwise vanish. Keep consistency across channels.",
            ],
          },
          {
            paragraphs: [
              "AI will not kill your company. It raises the bar. The future belongs to teams that keep taste above the average — and ship a presence people can trust.",
            ],
          },
        ],
      },
    },
  },
  {
    id: "next-over-templates",
    slugs: {
      cs: "proc-custom-next-js-porazi-sablony",
      en: "why-custom-next-beats-templates",
    },
    publishedAt: "2025-12-12",
    featured: true,
    copy: {
      cs: {
        title: "Proč custom Next.js porazí šablony ve vyhledávání",
        excerpt:
          "Šablona vypadá hotově. Search Console a Core Web Vitals pak ukážou, že struktura a výkon nebyly součástí briefu.",
        category: "SEO",
        dateLabel: "12. 12. 2025",
        author: "uitherapy",
        authorRole: "Frontend studio",
        sections: [
          {
            heading: "Hotový vzhled ≠ připravený web",
            paragraphs: [
              "Šablony slibují rychlý start. Často ale přinášejí těžký JS, slabé heading hierarchy, generické meta tagy a layout shift, který bolí LCP i důvěru.",
              "Custom Next.js build vám umožní řídit HTML, metadata, sitemapu, schema a loading priority — tedy věci, které Google skutečně čte.",
            ],
          },
          {
            heading: "Co měříme od prvního dne",
            paragraphs: [
              "Jedno H1, smysluplné H2, crawlovatelný text v DOM, lokalizované URL, Open Graph a JSON-LD, když dává smysl. Motion přes transform a opacity — ne přes layout thrashing.",
              "Výsledek není „hezčí šablona“. Je to rozhraní, které se dá škálovat, měřit a ladit bez přepisování třetí strany.",
            ],
          },
        ],
      },
      en: {
        title: "Why custom Next.js beats templates in search",
        excerpt:
          "Templates look finished. Search Console and Core Web Vitals then show structure and performance were never in the brief.",
        category: "SEO",
        dateLabel: "12 Dec 2025",
        author: "uitherapy",
        authorRole: "Frontend studio",
        sections: [
          {
            heading: "Finished look ≠ ready site",
            paragraphs: [
              "Templates promise speed. They often ship heavy JS, weak heading hierarchy, generic meta, and layout shift that hurts LCP and trust.",
              "A custom Next.js build lets you own HTML, metadata, sitemap, schema, and loading priority — what crawlers actually read.",
            ],
          },
          {
            heading: "What we measure from day one",
            paragraphs: [
              "One H1, meaningful H2s, crawlable DOM text, localized URLs, Open Graph and JSON-LD when useful. Motion via transform and opacity — not layout thrashing.",
              "The outcome is not a prettier template. It is an interface you can scale, measure, and tune without rewriting a third-party theme.",
            ],
          },
        ],
      },
    },
  },
  {
    id: "motion-vitals",
    slugs: {
      cs: "motion-ktery-nezabiji-core-web-vitals",
      en: "motion-that-does-not-kill-vitals",
    },
    publishedAt: "2025-11-04",
    featured: true,
    copy: {
      cs: {
        title: "Motion, který nezabíjí Core Web Vitals",
        excerpt:
          "Animace má dát přítomnost a hierarchii — ne scroll jank a skrytý obsah. Jak to držíme pod 300 ms a v transformu.",
        category: "Frontend",
        dateLabel: "4. 11. 2025",
        author: "uitherapy",
        authorRole: "Frontend studio",
        sections: [
          {
            heading: "Účel dřív než efekt",
            paragraphs: [
              "Každá animace musí mít důvod: hierarchy, feedback, přechod. Pokud ji uživatel uvidí stokrát denně, raději ji smažte. Klávesnicí spouštěné akce neonanimujeme.",
              "Preferujeme transform a opacity, krátké ease-out křivky a respekt k prefers-reduced-motion. Obsah zůstává v DOM — crawlovatelný a přístupný.",
            ],
          },
          {
            heading: "Přítomnost bez hluku",
            paragraphs: [
              "Dva až tři záměrné momenty na landing page stačí. Více efektů obvykle znamená méně důvěry. Motion má podpořit značku, ne soutěžit s copy.",
            ],
          },
        ],
      },
      en: {
        title: "Motion that does not kill Core Web Vitals",
        excerpt:
          "Animation should create presence and hierarchy — not scroll jank or hidden content. How we keep it under 300ms and on the transform path.",
        category: "Frontend",
        dateLabel: "4 Nov 2025",
        author: "uitherapy",
        authorRole: "Frontend studio",
        sections: [
          {
            heading: "Purpose before effect",
            paragraphs: [
              "Every animation needs a reason: hierarchy, feedback, transition. If users see it a hundred times a day, delete it. We never animate keyboard-initiated actions.",
              "We prefer transform and opacity, short ease-out curves, and prefers-reduced-motion. Content stays in the DOM — crawlable and accessible.",
            ],
          },
          {
            heading: "Presence without noise",
            paragraphs: [
              "Two or three intentional moments on a landing page are enough. More effects usually mean less trust. Motion should support the brand, not compete with the copy.",
            ],
          },
        ],
      },
    },
  },
];

export function getArticles(locale: Locale): Array<Article & { slug: string; local: ArticleCopy }> {
  return [...articles]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .map((article) => ({
      ...article,
      slug: article.slugs[locale],
      local: article.copy[locale],
    }));
}

export function getFeaturedArticles(locale: Locale, limit = 3) {
  return getArticles(locale)
    .filter((article) => article.featured)
    .slice(0, limit);
}

export function getArticleBySlug(locale: Locale, slug: string) {
  const article = articles.find((entry) => entry.slugs[locale] === slug);
  if (!article) return null;
  return {
    ...article,
    slug: article.slugs[locale],
    local: article.copy[locale],
  };
}

export function getArticleSlugs(locale: Locale) {
  return articles.map((article) => article.slugs[locale]);
}
