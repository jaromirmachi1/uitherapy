"use client";

import Image from "next/image";
import { useState } from "react";
import { ScrollReveal } from "@/components/reactbits/ScrollReveal";
import { ProjectModal } from "@/components/projects/ProjectModal";
import { useConversation } from "@/components/conversation/ConversationProvider";
import {
  portraitImage,
  wideImage,
  type ProjectEntry,
} from "@/content/projects";
import { useI18n } from "@/i18n/provider";

type Slot = "wide" | "narrow" | "full";

type Cell =
  | { type: "project"; project: ProjectEntry; slot: Slot }
  | { type: "cta"; slot: Slot };

const span: Record<Slot, string> = {
  wide: "md:col-span-3",
  narrow: "md:col-span-1",
  full: "md:col-span-4",
};

/**
 * Pairs projects into rows that alternate wide/narrow → narrow/wide.
 * The narrow slot prefers a project with a mobile capture so phone
 * screenshots fill tall tiles instead of cropping a desktop shot.
 */
function buildRows(items: ProjectEntry[], withCta: boolean): Cell[][] {
  const rows: Cell[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    const wideFirst = (i / 2) % 2 === 0;
    const [a, b] = items.slice(i, i + 2);

    if (!b) {
      if (withCta) {
        const wide: Cell = { type: "project", project: a, slot: "wide" };
        const cta: Cell = { type: "cta", slot: "narrow" };
        rows.push(wideFirst ? [wide, cta] : [cta, wide]);
      } else {
        rows.push([{ type: "project", project: a, slot: "full" }]);
      }
      continue;
    }

    let wideProject = a;
    let narrowProject = b;
    if (!portraitImage(b) && portraitImage(a)) {
      wideProject = b;
      narrowProject = a;
    }
    const wide: Cell = { type: "project", project: wideProject, slot: "wide" };
    const narrow: Cell = {
      type: "project",
      project: narrowProject,
      slot: "narrow",
    };
    rows.push(wideFirst ? [wide, narrow] : [narrow, wide]);
  }
  if (withCta && items.length % 2 === 0) {
    rows.push([{ type: "cta", slot: "full" }]);
  }
  return rows;
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden
    >
      <path d="M4 12 12 4M6.5 4H12v5.5" />
    </svg>
  );
}

const tileBase =
  "group relative block w-full overflow-hidden rounded-[1.25rem] text-left aspect-[16/10] md:aspect-auto md:h-[clamp(22rem,36vw,35rem)]";

function ProjectTile({
  project,
  slot,
  priority,
  onOpen,
}: {
  project: ProjectEntry;
  slot: Slot;
  priority: boolean;
  onOpen: (project: ProjectEntry) => void;
}) {
  const { t } = useI18n();
  const copy = t.projects.items[project.id];
  const wide = wideImage(project);
  const portrait = portraitImage(project);
  const desktopSrc = slot === "narrow" ? (portrait ?? wide) : wide;
  const desktopSizes =
    slot === "narrow"
      ? "(max-width: 768px) 100vw, 24vw"
      : slot === "wide"
        ? "(max-width: 768px) 100vw, 72vw"
        : "100vw";

  return (
    <button
      type="button"
      onClick={() => onOpen(project)}
      className={`${tileBase} bg-[#0f1115] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent`}
    >
      {/* Mobile: always the landscape capture. */}
      <Image
        src={wide}
        alt={copy.alt}
        fill
        sizes="100vw"
        priority={priority}
        className="object-cover object-top md:hidden"
      />
      {/* Desktop: portrait capture on narrow tiles when available. */}
      <Image
        src={desktopSrc}
        alt=""
        fill
        sizes={desktopSizes}
        priority={priority}
        className={`hidden object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.03] md:block ${
          slot === "narrow" && !portrait ? "object-left-top" : "object-top"
        }`}
      />

      {/* Hover overlay + centred title (pointer devices). */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[#101218]/60 opacity-0 transition-opacity duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:opacity-100 group-focus-visible:opacity-100"
      />
      <span className="pointer-events-none absolute inset-0 hidden items-center justify-center overflow-hidden p-8 text-center [@media(hover:hover)]:flex">
        <span className="flex translate-y-8 flex-col items-center opacity-0 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          <span className="font-[family-name:var(--font-display)] text-[clamp(1.5rem,2.6vw,2.4rem)] font-medium leading-[0.95] tracking-[-0.04em] text-white">
            {project.title}
          </span>
          <span
            className={`mt-3 max-w-[34ch] text-sm leading-relaxed text-white/75 ${
              slot === "narrow" ? "hidden xl:block" : ""
            }`}
          >
            {copy.summary}
          </span>
        </span>
      </span>

      {/* Touch devices: persistent caption. */}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 hidden bg-gradient-to-t from-black/75 via-black/30 to-transparent px-4 pb-4 pt-16 [@media(hover:none)]:block">
        <span className="block font-[family-name:var(--font-display)] text-xl font-medium tracking-[-0.03em] text-white">
          {project.title}
        </span>
      </span>

      {/* Service pills. */}
      <span className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1 [@media(hover:hover)]:bottom-3 [@media(hover:hover)]:top-auto">
        {project.services.map((key) => (
          <span
            key={key}
            className="inline-flex h-6 items-center rounded-full bg-white px-2.5 text-[0.68rem] font-medium lowercase tracking-[0.01em] text-foreground"
          >
            {t.projects.services[key]}
          </span>
        ))}
      </span>

      <span
        aria-hidden
        className="pointer-events-none absolute right-3 top-3 inline-flex h-9 w-9 scale-75 items-center justify-center rounded-full bg-accent text-white opacity-0 transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-100 group-hover:opacity-100"
      >
        <ArrowIcon className="h-3.5 w-3.5" />
      </span>

      <span className="sr-only">
        {t.projects.viewProject}: {project.title}
      </span>
    </button>
  );
}

function CtaTile({ slot }: { slot: Slot }) {
  const { t } = useI18n();
  const { openConversation } = useConversation();

  return (
    <button
      type="button"
      onClick={openConversation}
      className={`${tileBase} flex flex-col justify-between bg-accent p-6 text-white transition-colors duration-300 hover:bg-accent-hover sm:p-8 ${
        slot === "full" ? "md:h-[clamp(14rem,22vw,20rem)]" : ""
      }`}
    >
      <span aria-hidden className="pointer-events-none absolute inset-0">
        <span className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/20" />
        <span className="absolute -right-10 -top-10 h-44 w-44 rounded-full border border-white/15" />
      </span>
      <span className="relative font-[family-name:var(--font-display)] text-[clamp(1.6rem,2.4vw,2.2rem)] font-medium leading-[0.98] tracking-[-0.04em] text-balance">
        {t.projects.ctaTile.title}
      </span>
      <span className="relative flex flex-col gap-4">
        <span className="text-sm leading-relaxed text-white/75">
          {t.projects.ctaTile.body}
        </span>
        <span className="inline-flex items-center gap-2 text-[0.68rem] font-medium uppercase tracking-[0.16em]">
          {t.projects.requestQuote}
          <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px" />
        </span>
      </span>
    </button>
  );
}

export function ProjectGrid({
  items,
  withCta = false,
}: {
  items: ProjectEntry[];
  withCta?: boolean;
}) {
  const [active, setActive] = useState<ProjectEntry | null>(null);
  const rows = buildRows(items, withCta);

  return (
    <>
      <div className="flex flex-col gap-2.5">
        {rows.map((row, rowIndex) => (
          <ScrollReveal
            key={row
              .map((cell) =>
                cell.type === "project" ? cell.project.id : "cta",
              )
              .join("-")}
            blur={0}
            y={24}
          >
            <div className="grid gap-2.5 md:grid-cols-4">
              {row.map((cell) => (
                <div
                  key={cell.type === "project" ? cell.project.id : "cta"}
                  className={span[cell.slot]}
                >
                  {cell.type === "project" ? (
                    <ProjectTile
                      project={cell.project}
                      slot={cell.slot}
                      priority={rowIndex === 0}
                      onOpen={setActive}
                    />
                  ) : (
                    <CtaTile slot={cell.slot} />
                  )}
                </div>
              ))}
            </div>
          </ScrollReveal>
        ))}
      </div>
      <ProjectModal project={active} onClose={() => setActive(null)} />
    </>
  );
}
