import { motion } from "motion/react";
import type { ReactNode } from "react";
import { reveal, revealTransition, VIEWPORT } from "@/lib/motion";
import { usePageEnterDelay } from "./PageEnter";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** "inView" (default) reveals on scroll; "mount" plays with the page entrance. */
  trigger?: "inView" | "mount";
  as?: "div" | "li" | "section" | "header" | "p" | "article";
};

/** E04 block reveal: y 20 → 0, opacity 0 → 1, 0.8s, once. */
export function Reveal({ children, className, delay = 0, trigger = "inView", as = "div" }: Props) {
  const pageDelay = usePageEnterDelay();
  const Tag = motion[as];
  const play = trigger === "mount"
    ? { animate: reveal.visible, transition: revealTransition(pageDelay + delay) }
    : { whileInView: reveal.visible, viewport: VIEWPORT, transition: revealTransition(delay) };
  return (
    <Tag className={className} initial={reveal.initial} {...play}>
      {children}
    </Tag>
  );
}
