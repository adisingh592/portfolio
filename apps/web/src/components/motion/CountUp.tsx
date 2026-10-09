import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { DUR, EASE } from "@/lib/motion";

type Props = { value: number; suffix?: string; className?: string };

/** E09: counts 0 → value over 1.6s when scrolled into view. Shows the final value with reduced motion. */
export function CountUp({ value, suffix = "", className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    const format = (n: number) => `${Math.round(n).toLocaleString("en-IN")}${suffix}`;
    if (reduce) {
      el.textContent = format(value);
      return;
    }
    const controls = animate(0, value, { duration: DUR.count, ease: EASE, onUpdate: v => (el.textContent = format(v)) });
    return () => controls.stop();
  }, [inView, value, suffix, reduce]);

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`} aria-label={`${value}${suffix}`}>
      0{suffix}
    </span>
  );
}
