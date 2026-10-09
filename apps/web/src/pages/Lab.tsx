import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { labFilters, labItems, type LabCategory, type LabItem } from "@/data/lab";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { DUR, EASE, stagger } from "@/lib/motion";
import { LineReveal } from "@/components/motion/LineReveal";
import { Reveal } from "@/components/motion/Reveal";
import { FilterChips, Tag } from "@/components/ui/Chip";
import { SectionLabel } from "@/components/ui/SectionLabel";

const categoryLabel = Object.fromEntries(labFilters.map(f => [f.key, f.label]));

function LabCard({ item, tall }: { item: LabItem; tall: boolean }) {
  const body = (
    <>
      <div className="overflow-hidden rounded-[6px] bg-surface-alt">
        <img
          src={item.image.src}
          alt={item.image.alt}
          width={item.image.width}
          height={item.image.height}
          loading="lazy"
          decoding="async"
          className={`w-full object-cover transition-transform duration-[1.6s] ease-house group-hover:scale-[1.04] ${tall ? "aspect-[4/5]" : "aspect-[4/3]"}`}
        />
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="label">{categoryLabel[item.category]}</p>
          <h2 className="mt-2 font-display text-2xl font-medium tracking-tight transition-transform duration-500 ease-house group-hover:translate-x-1.5">{item.title}</h2>
          <p className="mt-1.5 text-sm text-fg-2">{item.body}</p>
        </div>
        {item.href && <ArrowUpRight aria-hidden className="mt-1 h-5 w-5 shrink-0 text-fg-2 transition-transform duration-500 ease-house group-hover:rotate-45 group-hover:text-accent" />}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {item.tags.map(t => <Tag key={t}>{t}</Tag>)}
      </div>
    </>
  );
  // Only experiments with a real destination become links.
  return item.href ? (
    <a href={item.href} target="_blank" rel="noreferrer" className="group block" data-cursor="view">{body}</a>
  ) : (
    <div className="group">{body}</div>
  );
}

export default function Lab() {
  useDocumentTitle("Lab");
  const [filter, setFilter] = useState<"all" | LabCategory>("all");
  const visible = useMemo(() => (filter === "all" ? labItems : labItems.filter(i => i.category === filter)), [filter]);

  return (
    <div className="gutter pb-12 pt-32 md:pt-40">
      <header className="grid grid-cols-12 gap-x-4 gap-y-6">
        <Reveal trigger="mount" className="col-span-12 md:col-span-3 md:pt-4">
          <SectionLabel index="01">Lab</SectionLabel>
        </Reveal>
        <div className="col-span-12 md:col-span-9">
          <LineReveal
            as="h1"
            trigger="mount"
            lines={["Experimental", <em key="p" className="text-accent">playground.</em>]}
            className="font-display text-[clamp(3.25rem,9vw,7.5rem)] font-medium leading-[0.9] tracking-[-0.035em]"
          />
          <Reveal trigger="mount" delay={0.3}>
            <p className="mt-6 max-w-xl text-lg text-fg-2">Small experiments, research and random ideas I'm working on.</p>
          </Reveal>
        </div>
      </header>

      <Reveal trigger="mount" delay={0.45} className="mt-12 flex flex-wrap items-center justify-between gap-4 border-y border-line py-5 md:mt-16">
        <FilterChips options={labFilters} value={filter} onChange={setFilter} layoutId="lab-filter" label="Filter experiments" />
        <p className="label" aria-live="polite">{visible.length} {visible.length === 1 ? "experiment" : "experiments"}</p>
      </Reveal>

      <LayoutGroup>
        <motion.ul layout className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((item, i) => (
              <motion.li
                key={item.slug}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, transition: { duration: DUR.exit } }}
                transition={{ duration: DUR.reveal, delay: stagger.card(i), ease: EASE, layout: { duration: DUR.base, ease: EASE } }}
              >
                <LabCard item={item} tall={i % 3 === 1} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </LayoutGroup>
    </div>
  );
}
