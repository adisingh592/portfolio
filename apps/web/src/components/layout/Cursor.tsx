import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { useFinePointer } from "@/hooks/useMediaQuery";
import { SPRING } from "@/lib/motion";

/**
 * N09 custom cursor. Desktop mouse/trackpad only, off with reduced motion.
 * The system cursor is never hidden: this is a soft follower that grows into a "View" label
 * over anything marked data-cursor="view".
 */
export function Cursor() {
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  if (!fine || reduce) return null;
  return <Follower />;
}

function Follower() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { ...SPRING, mass: 0.3 });
  const sy = useSpring(y, { ...SPRING, mass: 0.3 });
  const [view, setView] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const over = (e: PointerEvent) => setView(!!(e.target as Element | null)?.closest?.('[data-cursor="view"]'));
    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[75]"
      style={{ x: sx, y: sy }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-paper"
        animate={{ width: view ? 80 : 10, height: view ? 80 : 10, opacity: view ? 0.95 : 0.6 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.span className="text-xs font-medium" animate={{ opacity: view ? 1 : 0, scale: view ? 1 : 0.6 }} transition={{ duration: 0.3 }}>
          View
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
