import type { ReactNode } from "react";
import { cn } from "@portfolio/ui";
import { Reveal } from "@/components/motion/Reveal";
import { WordReveal } from "@/components/motion/WordReveal";

/** "[01] Projects" style label. */
export function SectionLabel({ index, children, className }: { index?: string; children: ReactNode; className?: string }) {
  return (
    <p className={cn("label", className)}>
      {index && <span className="text-accent">[{index}]</span>} {children}
    </p>
  );
}

type HeaderProps = {
  index?: string;
  label: string;
  title: string;
  sub?: string;
  action?: ReactNode;
  className?: string;
};

/** Section header: label on the left, large serif title on the right (E05 word reveal, E06 subtitle). */
export function SectionHeader({ index, label, title, sub, action, className }: HeaderProps) {
  return (
    <header className={cn("mb-10 grid grid-cols-12 items-end gap-x-4 gap-y-4 md:mb-14", className)}>
      <Reveal className="col-span-12 md:col-span-3 md:pb-2">
        <SectionLabel index={index}>{label}</SectionLabel>
      </Reveal>
      <div className="col-span-12 flex flex-wrap items-end justify-between gap-6 md:col-span-9">
        <div className="min-w-0">
          <h2 className="font-display-tight text-[clamp(2.4rem,6vw,4.5rem)]">
            <WordReveal text={title} mark />
          </h2>
          {sub && (
            <Reveal delay={0.3}>
              <p className="mt-4 max-w-xl text-fg-2">{sub}</p>
            </Reveal>
          )}
        </div>
        {action && <Reveal delay={0.2}>{action}</Reveal>}
      </div>
    </header>
  );
}
