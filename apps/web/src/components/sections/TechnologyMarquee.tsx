import { useReducedMotion } from "motion/react";
import { cn } from "@portfolio/ui";
import { brandColor, technologies } from "@/data/technologies";
import { Reveal } from "@/components/motion/Reveal";
import { WordReveal } from "@/components/motion/WordReveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TechIcon } from "@/components/ui/TechIcon";

/**
 * S01 marquee. The list is rendered twice in one row and the row slides by exactly half its
 * width over 40s, linear, forever, so the loop has no seam. Items are spaced with padding (never
 * `gap`) so both halves are identical in width. Hover pauses it. Screen readers get a real list;
 * reduced-motion visitors get the same logos as a static, wrapped list.
 */
export function TechnologyMarquee() {
  const reduce = useReducedMotion();

  const row = (copy: number) =>
    technologies.map(t => (
      <span key={`${copy}-${t.name}`} className="flex shrink-0 items-center px-[0.45em]">
        <TechIcon icon={t.icon} color={brandColor(t.icon)} className="mr-[0.35em] h-[0.62em] w-[0.62em]" />
        <span className={cn("whitespace-nowrap", t.italic ? "font-normal italic" : "font-medium")} style={{ color: brandColor(t.icon) }}>
          {t.name}
        </span>
        <span aria-hidden className="ml-[0.9em] text-[0.4em] text-accent/60">✶</span>
      </span>
    ));

  return (
    <section aria-label="Tools I reach for" className="overflow-hidden py-24 md:py-32">
      {/* Centred header, unlike the other sections */}
      <header className="gutter mb-10 flex flex-col items-center gap-4 text-center md:mb-14">
        <Reveal>
          <SectionLabel index="06">Stack</SectionLabel>
        </Reveal>
        <h2 className="font-display-tight text-[clamp(2.4rem,6vw,4.5rem)]">
          <WordReveal text="Tools I reach for" mark />
        </h2>
      </header>
      <ul className="sr-only" aria-label="Technologies I use">
        {technologies.map(t => (
          <li key={t.name}>{t.name}</li>
        ))}
      </ul>

      {reduce ? (
        <Reveal className="gutter">
          <ul aria-hidden className="flex flex-wrap justify-center gap-x-8 gap-y-4 border-y border-line py-8 font-display text-3xl tracking-tight">
            {technologies.map(t => (
              <li key={t.name} className="flex items-center gap-2.5">
                <TechIcon icon={t.icon} color={brandColor(t.icon)} className="h-6 w-6" />
                <span className={t.italic ? "italic" : ""} style={{ color: brandColor(t.icon) }}>{t.name}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      ) : (
        <Reveal>
          <div aria-hidden className="marquee overflow-hidden border-y border-line py-[1.35rem] md:py-[1.8rem]">
            <div className="marquee-track flex w-max font-display text-[clamp(2.475rem,6.3vw,5.4rem)] leading-none tracking-[-0.04em]">
              {row(0)}
              {row(1)}
            </div>
          </div>
        </Reveal>
      )}
    </section>
  );
}
