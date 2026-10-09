import { motion } from "motion/react";
import { DUR, EASE, STAGGER, VIEWPORT } from "@/lib/motion";
import { usePageEnterDelay } from "./PageEnter";

type Props = {
  text: string;
  className?: string;
  /** Adds the site's signature terracotta dot after the last word. */
  mark?: boolean;
  delay?: number;
  trigger?: "inView" | "mount";
};

/** E01/E05: words rise in one by one, 0.6s each, 0.08s apart. */
export function WordReveal({ text, className = "", mark = false, delay = 0, trigger = "inView" }: Props) {
  const pageDelay = usePageEnterDelay();
  const words = text.split(" ");
  const base = trigger === "mount" ? pageDelay + delay : delay;
  return (
    <span className={`inline-flex flex-wrap ${className}`} aria-label={text}>
      {words.map((word, i) => {
        const last = i === words.length - 1;
        return (
          <motion.span
            key={i}
            aria-hidden="true"
            className="text-gradient relative inline-block"
            style={{ marginRight: last ? 0 : "0.25em" }}
            initial={{ y: 20, opacity: 0 }}
            {...(trigger === "mount"
              ? { animate: { y: 0, opacity: 1 } }
              : { whileInView: { y: 0, opacity: 1 }, viewport: VIEWPORT })}
            transition={{ duration: DUR.base, delay: base + i * STAGGER.word, ease: EASE }}
          >
            {word}
            {mark && last && <span className="text-accent">.</span>}
          </motion.span>
        );
      })}
    </span>
  );
}
