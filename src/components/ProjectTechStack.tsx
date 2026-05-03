import type { IconType } from "react-icons";
import {
  SiFramer,
  SiGsap,
  SiNextdotjs,
  SiReact,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
} from "react-icons/si";

export type ProjectTechKey =
  | "nextjs"
  | "react"
  | "typescript"
  | "tailwind"
  | "threedotjs"
  | "gsap"
  | "framer";

const TECH: Record<ProjectTechKey, { Icon: IconType; label: string }> = {
  nextjs: { Icon: SiNextdotjs, label: "Next.js" },
  react: { Icon: SiReact, label: "React" },
  typescript: { Icon: SiTypescript, label: "TypeScript" },
  tailwind: { Icon: SiTailwindcss, label: "Tailwind CSS" },
  threedotjs: { Icon: SiThreedotjs, label: "Three.js" },
  gsap: { Icon: SiGsap, label: "GSAP" },
  framer: { Icon: SiFramer, label: "Motion" },
};

type Props = {
  stack: readonly ProjectTechKey[];
};

export function ProjectTechStack({ stack }: Props) {
  if (stack.length === 0) return null;

  return (
    <ul
      className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3"
      aria-label="Technologies used"
    >
      {stack.map((key) => {
        const { Icon, label } = TECH[key];
        return (
          <li key={key}>
            <Icon
              className="size-6 text-accent drop-shadow-[0_0_12px_rgba(82,38,255,0.35)] sm:size-7"
              aria-label={label}
              title={label}
              role="img"
            />
          </li>
        );
      })}
    </ul>
  );
}
