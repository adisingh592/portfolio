import { motion, useReducedMotion, useSpring } from "motion/react";
import { useRef, type PointerEvent, type ReactNode } from "react";
import { SPRING } from "@/lib/motion";
import { useFinePointer } from "@/hooks/useMediaQuery";

type Props = { children: ReactNode; strength?: number; className?: string };

/** N08: pulls its child toward the pointer (up to 30% of its size). Off for touch and reduced motion. */
export function MagneticButton({ children, strength = 0.3, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);
  const active = fine && !reduce;

  const move = (e: PointerEvent) => {
    if (!active || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * strength);
    y.set((e.clientY - r.top - r.height / 2) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      style={active ? { x, y } : undefined}
      onPointerMove={move}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  );
}
