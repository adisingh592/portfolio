import { Boxes, BrainCircuit, Layers, ScanEye, type LucideIcon } from "lucide-react";
import { capabilities } from "@/data/profile";
import { stagger } from "@/lib/motion";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/ui/SectionLabel";

const icons: Record<(typeof capabilities)[number]["key"], LucideIcon> = {
  ai: BrainCircuit,
  fullstack: Layers,
  vision: ScanEye,
  creative: Boxes,
};

export function Capabilities() {
  return (
    <section className="gutter py-24 md:py-32">
      <SectionHeader index="02" label="What I do" title="What I do" />
      <ul className="grid grid-cols-1 border-t border-line sm:grid-cols-2 lg:grid-cols-4">
        {capabilities.map((c, i) => {
          const Icon = icons[c.key];
          return (
            <Reveal
              as="li"
              key={c.key}
              delay={stagger.row(i)}
              className="group border-b border-line py-8 sm:odd:border-r sm:odd:pr-6 sm:even:pl-6 lg:border-b-0 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-surface-alt text-accent transition-transform duration-500 ease-house group-hover:-rotate-6 group-hover:scale-105">
                <Icon aria-hidden className="h-5 w-5" strokeWidth={1.6} />
              </span>
              <h3 className="mt-6 font-display text-2xl font-medium tracking-tight">{c.title}</h3>
              <p className="mt-2 text-sm text-fg-2">{c.body}</p>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
