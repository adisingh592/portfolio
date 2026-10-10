import type { SimpleIcon } from "simple-icons";
import { cn } from "@portfolio/ui";

const tones = { accent: "text-accent", fg: "text-fg", olive: "text-olive" } as const;

/** Brand logo from simple-icons, drawn in a muted theme tone unless `color` is given. */
export function TechIcon({ icon, tone = "fg", color, className }: { icon: SimpleIcon; tone?: keyof typeof tones; color?: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("shrink-0 fill-current", !color && tones[tone], className)} style={color ? { color } : undefined}>
      <path d={icon.path} />
    </svg>
  );
}
