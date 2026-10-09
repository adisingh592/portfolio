import { motion } from "motion/react";
import { Code2, FlaskConical, Lightbulb, PenTool, Rocket, type LucideIcon } from "lucide-react";
import { processSteps } from "@/data/profile";
import { DUR, EASE, stagger, VIEWPORT } from "@/lib/motion";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/ui/SectionLabel";

const icons: Record<(typeof processSteps)[number]["key"], LucideIcon> = {
  think: Lightbulb,
  design: PenTool,
  build: Code2,
  test: FlaskConical,
  ship: Rocket,
};

/** Compact five-step timeline. The connecting line draws in (1.4s), steps follow 0.06s apart. */
export function Process() {
  return (
    <section className="gutter py-24 md:py-32">
      <SectionHeader index="06" label="Process" title="How I build" />
      <ol className="relative grid gap-8 md:grid-cols-5 md:gap-6">
        <motion.span
          aria-hidden
          className="absolute left-[21px] top-0 h-full w-px origin-top bg-line md:left-0 md:top-[21px] md:h-px md:w-full md:origin-left"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: DUR.bar, ease: EASE }}
        />
        {processSteps.map((s, i) => {
          const Icon = icons[s.key];
          return (
            <Reveal as="li" key={s.key} delay={0.2 + stagger.row(i)} className="relative flex gap-5 md:flex-col md:gap-0">
              <span className="relative z-10 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-bg text-accent">
                <Icon aria-hidden className="h-[18px] w-[18px]" strokeWidth={1.6} />
              </span>
              <div className="md:mt-6">
                <p className="label">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-1.5 max-w-[22ch] text-sm text-fg-2">{s.body}</p>
              </div>
            </Reveal>
          );
        })}
      </ol>
    </section>
  );
}
