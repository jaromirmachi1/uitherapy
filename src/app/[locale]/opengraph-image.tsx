import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { isLocale } from "@/i18n/config";
import { siteName } from "@/seo/site";

export const alt = "uitherapy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ASSETS = join(process.cwd(), "src/assets/og");

/** Two-line hero for the share card — the site's own voice, not SEO copy. */
const copy = {
  cs: {
    line1: "Terapie pro weby.",
    line2: "Bohužel ne pro lidi.",
    services: "Weby · E-shopy · Branding · Motion",
  },
  en: {
    line1: "We fix websites.",
    line2: "Sadly not people.",
    services: "Websites · E-shops · Branding · Motion",
  },
} as const;

/** uitherapy mark (favicon.svg), white. */
const MARK =
  "data:image/svg+xml;base64," +
  Buffer.from(
    '<svg width="188" height="188" viewBox="0 0 188 188" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M188 94C188 145.915 145.915 188 94 188C42.085 188 0 145.915 0 94C0 42.085 42.085 0 94 0C145.915 0 188 42.085 188 94ZM86 61.5C86 65.642 89.358 69 93.5 69H144.5C148.642 69 152 65.642 152 61.5C152 57.358 148.642 54 144.5 54H93.5C89.358 54 86 57.358 86 61.5ZM49 92.5C49 96.642 52.358 100 56.5 100H133.5C137.642 100 141 96.642 141 92.5C141 88.358 137.642 85 133.5 85H56.5C52.358 85 49 88.358 49 92.5ZM39 123.5C39 127.642 42.358 131 46.5 131H97.5C101.642 131 105 127.642 105 123.5C105 119.358 101.642 116 97.5 116H46.5C42.358 116 39 119.358 39 123.5Z" fill="white"/></svg>',
  ).toString("base64");

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "cs";
  const t = copy[locale];

  const [collage, syne, syneExt, inter, interExt] = await Promise.all([
    readFile(join(ASSETS, "collage.jpg")),
    readFile(join(ASSETS, "syne-latin-700-normal.woff")),
    readFile(join(ASSETS, "syne-latin-ext-700-normal.woff")),
    readFile(join(ASSETS, "inter-tight-latin-500-normal.woff")),
    readFile(join(ASSETS, "inter-tight-latin-ext-500-normal.woff")),
  ]);
  const collageSrc = `data:image/jpeg;base64,${collage.toString("base64")}`;

  const display = { fontFamily: "Syne, SyneExt", letterSpacing: "-0.045em" };

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0c0d10",
          color: "#ffffff",
          fontFamily: "Inter Tight, InterExt",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: 600,
            padding: "64px 0 60px 72px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <img src={MARK} width={40} height={40} alt="" />
            <div style={{ ...display, fontSize: 32, letterSpacing: "-0.03em" }}>
              {siteName}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ ...display, fontSize: 56, lineHeight: 1 }}>
              {t.line1}
            </div>
            <div
              style={{
                ...display,
                fontSize: 56,
                lineHeight: 1,
                marginTop: 6,
                color: "#6f86ff",
              }}
            >
              {t.line2}
            </div>
            <div
              style={{
                marginTop: 34,
                fontSize: 24,
                letterSpacing: "-0.01em",
                color: "rgba(255,255,255,0.62)",
              }}
            >
              {t.services}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 22,
              color: "rgba(255,255,255,0.75)",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: "#1f5eff",
              }}
            />
            uitherapy.com
          </div>
        </div>

        {/* Real project captures, pre-composed (src/assets/og/collage.jpg). */}
        <img
          src={collageSrc}
          width={640}
          height={630}
          alt=""
          style={{ marginLeft: -40 }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Syne", data: syne, weight: 700, style: "normal" },
        { name: "SyneExt", data: syneExt, weight: 700, style: "normal" },
        { name: "Inter Tight", data: inter, weight: 500, style: "normal" },
        { name: "InterExt", data: interExt, weight: 500, style: "normal" },
      ],
    },
  );
}
