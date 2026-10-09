import { motion } from "motion/react";
import { cn } from "@portfolio/ui";
import { DUR, EASE } from "@/lib/motion";

/** Static tag. */
export function Tag({ children, className }: { children: string; className?: string }) {
  return <span className={cn("inline-flex items-center rounded-full border border-line px-2.5 py-1 text-xs text-fg-2", className)}>{children}</span>;
}

type FilterProps<K extends string> = {
  options: { key: K; label: string }[];
  value: K;
  onChange: (key: K) => void;
  /** Unique per filter group so the sliding background doesn't jump between groups. */
  layoutId: string;
  label: string;
};

/** Filter chips (H09). The active background glides between chips with a shared layoutId. */
export function FilterChips<K extends string>({ options, value, onChange, layoutId, label }: FilterProps<K>) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map(o => {
        const active = o.key === value;
        return (
          <button
            key={o.key}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.key)}
            className={cn(
              "relative min-h-10 rounded-full border px-4 text-sm transition-colors duration-150",
              active ? "border-accent text-paper" : "border-line text-fg-2 hover:border-fg/40 hover:text-fg",
            )}
          >
            {active && (
              <motion.span layoutId={layoutId} className="absolute inset-0 -z-0 rounded-full bg-accent" transition={{ duration: DUR.fast, ease: EASE }} />
            )}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
