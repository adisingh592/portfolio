// Education, experience, skills and achievements. Shared by the About and Resume pages.
import { motion } from "motion/react";
import { education, experience, stats } from "@/data/profile";
import { skillGroups, technologies } from "@/data/technologies";
import { DUR, EASE, stagger, VIEWPORT } from "@/lib/motion";
import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import { TechIcon } from "@/components/ui/TechIcon";

function progressBetween(start: string, end: string) {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  return Math.round(Math.min(1, Math.max(0, (Date.now() - s) / (e - s))) * 100);
}

/** Education with E10 progress bar (width 0 → n%, 1.4s, delay 0.3s). */
export function EducationList() {
  return (
    <ul className="space-y-6">
      {education.map(ed => {
        const pct = progressBetween(ed.startDate, ed.endDate);
        return (
          <Reveal as="li" key={ed.school} className="rounded-[6px] border border-line bg-surface p-6 md:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="font-display text-2xl font-medium tracking-tight">{ed.school}</h3>
              <p className="label">{ed.start} – {ed.end}</p>
            </div>
            <p className="mt-1.5 text-fg-2">{ed.degree}</p>
            <div className="mt-6">
              <div className="h-1 overflow-hidden rounded-full bg-fg/10" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Degree progress">
                <motion.span
                  className="block h-full rounded-full bg-accent"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: DUR.bar, delay: 0.3, ease: EASE }}
                />
              </div>
              <div className="mt-2 flex justify-between text-xs text-fg-2">
                <span>{ed.start}</span>
                <span>{pct}% complete</span>
                <span>{ed.end}</span>
              </div>
            </div>
          </Reveal>
        );
      })}
    </ul>
  );
}

/** Vertical timeline. Rows reveal 0.06s apart; the current role pulses (A01). */
export function ExperienceTimeline() {
  return (
    <ol className="relative">
      <motion.span
        aria-hidden
        className="absolute bottom-2 left-[5px] top-2 w-px origin-top bg-line"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: DUR.bar, ease: EASE }}
      />
      {experience.map((x, i) => (
        <Reveal as="li" key={x.org} delay={stagger.row(i)} className="relative grid grid-cols-12 gap-x-4 gap-y-1 pb-9 pl-8 last:pb-0">
          <span aria-hidden className="absolute left-0 top-2 flex h-[11px] w-[11px]">
            {x.current && <span className="ping-soft absolute inset-0 rounded-full bg-accent" />}
            <span className={`relative h-[11px] w-[11px] rounded-full border-2 ${x.current ? "border-accent bg-accent" : "border-fg/40 bg-bg"}`} />
          </span>
          <div className="col-span-12 md:col-span-8">
            <h3 className="font-display text-xl font-medium tracking-tight">{x.org}</h3>
            <p className="mt-1 text-sm text-fg-2">{x.role}{x.note ? ` · ${x.note}` : ""}</p>
          </div>
          <p className="label col-span-12 pt-1.5 md:col-span-4 md:text-right">
            {x.period}
            {x.current && <span className="sr-only"> (current)</span>}
          </p>
        </Reveal>
      ))}
    </ol>
  );
}

/** Logos plus grouped skills. */
export function SkillsGrid() {
  return (
    <div className="space-y-10">
      <ul className="grid grid-cols-3 gap-px overflow-hidden rounded-[6px] border border-line bg-line sm:grid-cols-4 lg:grid-cols-6">
        {technologies.map((t, i) => (
          <Reveal as="li" key={t.name} delay={stagger.card(i)} className="group flex flex-col items-center gap-3 bg-bg px-2 py-6 text-center">
            <TechIcon icon={t.icon} tone={t.tone} className="h-7 w-7 transition-transform duration-500 ease-house group-hover:-translate-y-1" />
            <span className="text-xs text-fg-2">{t.name}</span>
          </Reveal>
        ))}
      </ul>
      <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((g, i) => (
          <Reveal key={g.title} delay={stagger.card(i)} className="border-t border-line pt-4">
            <dt className="label">{g.title}</dt>
            <dd className="mt-2 text-sm leading-relaxed">{g.items.join(" · ")}</dd>
          </Reveal>
        ))}
      </dl>
    </div>
  );
}

/** E09 count-up stats. */
export function Achievements() {
  return (
    <ul className="grid grid-cols-2 gap-6 md:grid-cols-4">
      {stats.map((s, i) => (
        <Reveal as="li" key={s.label} delay={stagger.row(i)} className="border-t border-line pt-5">
          <span className="font-display text-[clamp(2.5rem,5vw,3.5rem)] font-medium leading-none tracking-[-0.04em]">
            {Number.isFinite(s.value) ? <CountUp value={s.value} suffix={s.suffix} /> : <span aria-label="Infinite">∞</span>}
          </span>
          <p className="mt-2 text-sm text-fg-2">{s.label}</p>
        </Reveal>
      ))}
    </ul>
  );
}
