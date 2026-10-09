import type { SimpleIcon } from "simple-icons";
import { cn } from "@portfolio/ui";

const tones = { accent: "text-accent", fg: "text-fg", olive: "text-olive" } as const;

/** Monochrome brand logo from simple-icons, drawn in a muted theme tone. */
export function TechIcon({ icon, tone = "fg", className }: { icon: SimpleIcon; tone?: keyof typeof tones; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("shrink-0 fill-current", tones[tone], className)}>
      <path d={icon.path} />
    </svg>
  );
}
