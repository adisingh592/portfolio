import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { EASE, STAGGER, VIEWPORT } from "@/lib/motion";
import { usePageEnterDelay } from "./PageEnter";

type Props = {
  lines: ReactNode[];
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  lineClassName?: string;
  delay?: number;
  trigger?: "inView" | "mount";
};

const line: Variants = {
  hidden: { y: "110%" },
  visible: (d: number) => ({ y: "0%", transition: { duration: 0.9, delay: d, ease: EASE } }),
};

/**
 * N02 masked line reveal: each line slides up from behind its own mask (y 110% → 0, 0.9s).
 * The in-view check runs on the heading itself: the hidden lines sit outside their masks, so the
 * browser would report them as never visible.
 */
export function LineReveal({ lines, as = "h2", className, lineClassName = "", delay = 0, trigger = "inView" }: Props) {
  const pageDelay = usePageEnterDelay();
  const Tag = motion[as];
  const base = trigger === "mount" ? pageDelay + delay : delay;
  const play = trigger === "mount" ? { animate: "visible" } : { whileInView: "visible", viewport: VIEWPORT };
  return (
    <Tag className={className} initial="hidden" {...play}>
      {lines.map((content, i) => (
        <span key={i} className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
          <motion.span className={`block ${lineClassName}`} variants={line} custom={base + i * STAGGER.row}>
            {content}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
