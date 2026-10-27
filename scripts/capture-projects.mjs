/**
 * Captures every project in scripts/capture.config.json and writes
 * portfolio-ready images to public/projects:
 *
 *   <id>-showcase.webp     tall desktop capture in a rounded frame (vojta.webp style)
 *   <id>-mobile-frame.webp phone capture in a rounded frame
 *   <id>-desk.webp         raw desktop viewport @2x   (project modal)
 *   <id>-desk-2.webp       raw desktop, one screen down
 *   <id>-mobile.webp       raw phone viewport @3x
 *
 * and records what it produced in src/content/project-captures.json,
 * which the site reads automatically.
 *
 * Usage:
 *   npm run capture              # all projects
 *   npm run capture -- sadia dvd # only these ids
 *
 * First run only: npx playwright install chromium
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, devices } from "playwright";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "public/projects");
const MANIFEST = path.join(ROOT, "src/content/project-captures.json");
const CONFIG = process.env.CAPTURE_CONFIG
  ? path.resolve(process.env.CAPTURE_CONFIG)
  : path.join(ROOT, "scripts/capture.config.json");

const DESKTOP = { width: 1440, height: 900, scale: 2 };
/** Height of the tall capture, in CSS px. 1470/1440 ≈ the vojta.webp ratio. */
const SHOWCASE_HEIGHT = 1470;

const CONSENT_TEXT =
  /^(přijmout( vše)?|přijmout všechny|souhlasím|rozumím|povolit vše|povolit všechny|uložit volbu|accept( all)?( cookies)?|allow all|i agree|agree|got it|ok)$/i;

const HIDE_CSS = `
  #CybotCookiebotDialog, #onetrust-banner-sdk, #onetrust-consent-sdk,
  .cc-window, .cc-banner, #cookiescript_injected, #cookie-law-info-bar,
  [id*="cookie" i][class*="banner" i], [class*="cookie-banner" i],
  [class*="CookieBanner" i], [class*="cookie-consent" i], [id*="cookie-consent" i],
  [class*="consent-banner" i], [aria-label*="cookie" i][role="dialog"],
  [data-nextjs-toast], nextjs-portal { display: none !important; }
  html { scroll-behavior: auto !important; }
`;

const log = (...args) => console.log("  ", ...args);

async function dismissConsent(page) {
  // One evaluate per frame instead of one locator call per button: per-element
  // calls into a busy cross-origin iframe (Google Maps on doktorbarber.cz)
  // could each wait out a 30 s timeout, which looked like a frozen run.
  const withTimeout = (promise, ms) =>
    Promise.race([promise, new Promise((r) => setTimeout(() => r(false), ms))]);
  for (const frame of page.frames()) {
    if (/google\.[^/]+\/maps|youtube|vimeo/.test(frame.url())) continue;
    const clicked = await withTimeout(
      frame
        .evaluate((source) => {
          const re = new RegExp(source, "i");
          const els = document.querySelectorAll("button, a, [role=button]");
          for (const el of els) {
            const text = (el.innerText || "").trim();
            const visible = el.offsetParent !== null || el.getClientRects().length > 0;
            if (text && text.length < 40 && re.test(text) && visible) {
              el.click();
              return true;
            }
          }
          return false;
        }, CONSENT_TEXT.source)
        .catch(() => false),
      3000,
    );
    if (clicked) {
      await page.waitForTimeout(500);
      return true;
    }
  }
  return false;
}

async function prepare(page, project) {
  // Wait for "load", then give the network a short chance to settle.
  // Never block on full network idle: embeds like Google Maps keep
  // requesting forever, which used to stall a site for 45 s per pass.
  await page.goto(project.url, { waitUntil: "load", timeout: 60000 });
  await page
    .waitForLoadState("networkidle", { timeout: project.idleMs ?? 8000 })
    .catch(() => {});
  await page.evaluate(() => document.fonts?.ready).catch(() => {});
  await page.waitForTimeout(1500);

  // Guard: never save a capture of a different site (redirect, error page,
  // proxy/localhost substitution) — how every tile once showed uitherapy.com.
  const host = (u) => new URL(u).hostname.replace(/^www\./, "");
  if (host(page.url()) !== host(project.url)) {
    throw new Error(`landed on ${host(page.url())}, expected ${host(project.url)} — not saving`);
  }

  for (const selector of project.click ?? []) {
    await page.locator(selector).first().click({ timeout: 4000 }).catch(() => {});
    await page.waitForTimeout(1200);
  }
  await dismissConsent(page);
  const extra = (project.hide ?? []).join(",");
  await page.addStyleTag({
    content: HIDE_CSS + (extra ? `${extra}{display:none!important}` : ""),
  });
  // Walk the page so lazy images load and scroll-reveal animations fire.
  await page.evaluate(async () => {
    const max = Math.min(document.documentElement.scrollHeight, 7000);
    for (let y = 0; y <= max; y += 300) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(project.waitMs ?? 1800);
  await dismissConsent(page);
}

/** Rounded frame with a hairline border — matches the hand-made vojta.webp. */
async function frame(buffer, { width, radius, border, pad, background }) {
  const resized = await sharp(buffer).resize({ width: width - pad * 2 }).toBuffer();
  const { width: w, height: h } = await sharp(resized).metadata();
  const mask = Buffer.from(
    `<svg width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${radius}" ry="${radius}"/></svg>`,
  );
  const stroke = Buffer.from(
    `<svg width="${w}" height="${h}"><rect x="${border / 2}" y="${border / 2}" width="${w - border}" height="${h - border}" rx="${radius}" ry="${radius}" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="${border}"/></svg>`,
  );
  const rounded = await sharp(resized)
    .ensureAlpha()
    .composite([
      { input: mask, blend: "dest-in" },
      { input: stroke, blend: "over" },
    ])
    .png()
    .toBuffer();
  return sharp(rounded)
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background })
    .webp({ quality: 86, alphaQuality: 100 })
    .toBuffer();
}

/** Dominant colour of a capture — used to tint the tile behind it. */
async function tint(buffer) {
  const { dominant } = await sharp(buffer).resize(64).stats();
  return `#${[dominant.r, dominant.g, dominant.b]
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("")}`;
}

const webp = (buffer) => sharp(buffer).webp({ quality: 84 }).toBuffer();

async function save(name, buffer) {
  await fs.writeFile(path.join(OUT_DIR, name), buffer);
  return `/projects/${name}`;
}

async function captureProject(browser, project) {
  const entry = {};

  // Desktop
  const desk = await browser.newContext({
    viewport: { width: DESKTOP.width, height: DESKTOP.height },
    deviceScaleFactor: DESKTOP.scale,
    locale: "cs-CZ",
    colorScheme: "light",
  });
  const page = await desk.newPage();
  await prepare(page, project);

  const deskShot = await page.screenshot();
  entry.desk = await save(`${project.id}-desk.webp`, await webp(deskShot));
  entry.tint = await tint(deskShot);

  if (!project.skipShowcase) {
    let tall;
    if (project.showcaseMode === "viewport") {
      // Render the tall frame as a real viewport so everything in it is
      // actually revealed, then restore the normal size.
      await page.setViewportSize({ width: DESKTOP.width, height: SHOWCASE_HEIGHT });
      await page.waitForTimeout(1500);
      tall = await page.screenshot();
      await page.setViewportSize({ width: DESKTOP.width, height: DESKTOP.height });
      await page.waitForTimeout(800);
    } else {
      const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
      tall = await page.screenshot({
        fullPage: true,
        clip: { x: 0, y: 0, width: DESKTOP.width, height: Math.min(SHOWCASE_HEIGHT, pageHeight) },
      });
    }
    entry.showcase = await save(
      `${project.id}-showcase.webp`,
      await frame(tall, {
        width: 1800,
        radius: 34,
        border: 3,
        pad: 6,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      }),
    );
  }

  for (const selector of project.desk2Click ?? []) {
    await page.locator(selector).first().click({ timeout: 4000 }).catch(() => {});
    await page.waitForTimeout(1500);
  }
  if (project.desk2Click) {
    // Second shot is a different state of the same screen; stay put.
  } else if (project.desk2Selector) {
    await page
      .locator(project.desk2Selector)
      .first()
      .evaluate((el) => el.scrollIntoView({ block: "start" }))
      .catch(() => page.evaluate((y) => window.scrollTo(0, y), 900));
  } else {
    await page.evaluate((y) => window.scrollTo(0, y), DESKTOP.height);
  }
  await page.waitForTimeout(1400);
  entry.desk2 = await save(`${project.id}-desk-2.webp`, await webp(await page.screenshot()));
  await desk.close();

  // Mobile
  const phone = await browser.newContext({
    ...devices["iPhone 13"],
    viewport: { width: 390, height: 844 },
    locale: "cs-CZ",
  });
  const mobilePage = await phone.newPage();
  await prepare(mobilePage, project);
  const mobileShot = await mobilePage.screenshot();
  entry.mobile = await save(`${project.id}-mobile.webp`, await webp(mobileShot));
  entry.mobileFrame = await save(
    `${project.id}-mobile-frame.webp`,
    await frame(mobileShot, {
      width: 900,
      radius: 86,
      border: 4,
      pad: 6,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    }),
  );
  await phone.close();

  entry.capturedAt = new Date().toISOString().slice(0, 10);
  return entry;
}

async function main() {
  const { projects } = JSON.parse(await fs.readFile(CONFIG, "utf8"));
  const only = new Set(process.argv.slice(2));
  const queue = only.size ? projects.filter((p) => only.has(p.id)) : projects;
  if (queue.length === 0) {
    console.error("No matching projects. Known ids:", projects.map((p) => p.id).join(", "));
    process.exit(1);
  }

  let manifest = {};
  try {
    manifest = JSON.parse(await fs.readFile(MANIFEST, "utf8"));
  } catch {}

  await fs.mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const failed = [];

  for (const project of queue) {
    console.log(`→ ${project.id}  ${project.url}`);
    try {
      manifest[project.id] = await captureProject(browser, project);
      await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
      log("done");
    } catch (error) {
      failed.push(project.id);
      log("FAILED:", error.message.split("\n")[0]);
    }
  }

  await browser.close();
  await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`\nWrote ${path.relative(ROOT, MANIFEST)}`);
  if (failed.length) {
    console.log(`Failed: ${failed.join(", ")} — rerun with: npm run capture -- ${failed.join(" ")}`);
    process.exitCode = 1;
  }
}

main();
