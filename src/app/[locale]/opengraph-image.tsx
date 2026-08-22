import { ImageResponse } from "next/og";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { siteName } from "@/seo/site";

export const alt = "uitherapy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "cs";
  const t = getDictionary(locale);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(145deg, #e8e8e8 0%, #ffffff 48%, #d7dbe6 100%)",
          color: "#2b2b2b",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "-0.04em",
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 999,
              background: "#1f5eff",
            }}
          />
          {siteName}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: "-0.05em",
              maxWidth: 900,
            }}
          >
            {t.seo.tagline}
          </div>
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.35,
              color: "#6a6a6a",
              maxWidth: 820,
            }}
          >
            {t.seo.description}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
