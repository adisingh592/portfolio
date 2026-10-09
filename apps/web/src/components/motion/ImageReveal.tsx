import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { EASE, VIEWPORT } from "@/lib/motion";
import { usePageEnterDelay } from "./PageEnter";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  imgClassName?: string;
  /** N07: drift the image ±8% as it passes through the viewport. */
  parallax?: boolean;
  trigger?: "inView" | "mount";
  delay?: number;
  /** Above-the-fold images load eagerly. */
  priority?: boolean;
};

/** N06 image clip reveal: clip-path wipes up while the image settles from 1.2× to 1×, 1.2s. */
export function ImageReveal({
  src, alt, width, height, className = "", imgClassName = "", parallax = false, trigger = "inView", delay = 0, priority = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const pageDelay = usePageEnterDelay();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const useParallax = parallax && !reduce;

  const shown = { clipPath: "inset(0% 0% 0% 0%)" };
  const play = trigger === "mount" ? { animate: shown } : { whileInView: shown, viewport: VIEWPORT };

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      {...play}
      transition={{ duration: 1.2, delay: (trigger === "mount" ? pageDelay : 0) + delay, ease: EASE }}
    >
      <motion.div className="h-full w-full" style={useParallax ? { y, scale: 1.16 } : undefined}>
        <motion.img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className={`h-full w-full object-cover ${imgClassName}`}
          initial={{ scale: 1.2 }}
          {...(trigger === "mount" ? { animate: { scale: 1 } } : { whileInView: { scale: 1 }, viewport: VIEWPORT })}
          transition={{ duration: 1.2, delay: (trigger === "mount" ? pageDelay : 0) + delay, ease: EASE }}
        />
      </motion.div>
    </motion.div>
  );
}
