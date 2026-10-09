import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useMemo, useState } from "react";
import { cn } from "@portfolio/ui";
import { projectFilters, projects, type ProjectCategory } from "@/data/projects";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { DUR, EASE, stagger } from "@/lib/motion";
import { LineReveal } from "@/components/motion/LineReveal";
import { Reveal } from "@/components/motion/Reveal";
import { FilterChips } from "@/components/ui/Chip";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { SectionLabel } from "@/components/ui/SectionLabel";

type FilterKey = "all" | ProjectCategory;

/**
 * Rows alternate wide/narrow (7 + 5 columns, then 5 + 7). Narrow cards use a taller crop so both
 * images in a row end up the same height: 16/10 at 7 columns ≈ 8/7 at 5 columns.
 */
function layoutFor(i: number) {
  const row = Math.floor(i / 2);
  const wideFirst = row % 2 === 0;
  const wide = (i % 2 === 0) === wideFirst;
  return wide ? { span: "md:col-span-7", aspect: "16 / 10" } : { span: "md:col-span-5", aspect: "8 / 7" };
}

export default function Work() {
  useDocumentTitle("Work");
  const [filter, setFilter] = useState<FilterKey>("all");
  const visible = useMemo(() => (filter === "all" ? projects : projects.filter(p => p.categories.includes(filter))), [filter]);

  return (
    <div className="gutter pb-12 pt-32 md:pt-40">
      <header className="grid grid-cols-12 gap-x-4 gap-y-6">
        <Reveal trigger="mount" className="col-span-12 md:col-span-3 md:pt-4">
          <SectionLabel index="01">Projects</SectionLabel>
        </Reveal>
        <div className="col-span-12 md:col-span-9">
          <LineReveal
            as="h1"
            trigger="mount"
            lines={[<>My <em className="text-accent">work.</em></>]}
            className="font-display text-[clamp(3.5rem,10vw,8rem)] font-semibold leading-[0.9] tracking-[-0.045em]"
          />
          <Reveal trigger="mount" delay={0.3}>
            <p className="mt-6 max-w-xl text-lg text-fg-2">
              A collection of projects across AI/ML, computer vision, web development and creative technology.
            </p>
          </Reveal>
        </div>
      </header>

      <Reveal trigger="mount" delay={0.45} className="mt-12 flex flex-wrap items-center justify-between gap-4 border-y border-line py-5 md:mt-16">
        <FilterChips options={projectFilters} value={filter} onChange={setFilter} layoutId="work-filter" label="Filter projects" />
        <p className="label" aria-live="polite">
          {visible.length} {visible.length === 1 ? "project" : "projects"}
        </p>
      </Reveal>

      <LayoutGroup>
        <motion.ul layout className="mt-12 grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-12 md:gap-y-20">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((p, i) => {
              const { span, aspect } = layoutFor(i);
              return (
                <motion.li
                  key={p.slug}
                  layout
                  className={cn("col-span-1", span)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, transition: { duration: DUR.exit } }}
                  transition={{ duration: DUR.reveal, delay: stagger.card(i), ease: EASE, layout: { duration: DUR.base, ease: EASE } }}
                >
                  <ProjectCard project={p} aspect={aspect} size={span.includes("7") ? "lg" : "md"} priority={i < 2} />
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>
      </LayoutGroup>
    </div>
  );
}
