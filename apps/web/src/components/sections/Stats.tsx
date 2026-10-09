import { Code2, Infinity as InfinityIcon, Layers, Trophy, type LucideIcon } from "lucide-react";
import { cn } from "@portfolio/ui";
import { stats } from "@/data/profile";
import { stagger } from "@/lib/motion";
import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";

const icons: LucideIcon[] = [Code2, Trophy, Layers, InfinityIcon];

// 2×2 on phones, one row of four from md up.
const cell = [
  "border-r border-b md:border-b-0",
  "border-b pl-5 md:border-b-0 md:border-r md:pl-8",
  "border-r md:pl-8",
  "pl-5 md:pl-8",
];

/** Four-column stats strip with E09 count-up. */
export function Stats() {
  return (
    <section id="overview" aria-label="At a glance" className="gutter">
      <ul className="grid grid-cols-2 border-y border-line md:grid-cols-4">
        {stats.map((s, i) => {
          const Icon = icons[i];
          return (
            <Reveal as="li" key={s.label} delay={stagger.row(i)} className={cn("flex flex-col gap-3 border-line py-7 md:py-9", cell[i])}>
              <Icon aria-hidden className="h-5 w-5 text-accent" strokeWidth={1.6} />
              <span className="font-display text-[clamp(2.5rem,5vw,3.75rem)] font-semibold leading-none tracking-[-0.04em]">
                {Number.isFinite(s.value) ? <CountUp value={s.value} suffix={s.suffix} /> : <span aria-label="Infinite">∞</span>}
              </span>
              <span className="text-sm text-fg-2">{s.label}</span>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
