import { animate, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";
import { lockScroll } from "@/lib/lenis";
import { markPreloaderSeen, showPreloader } from "@/lib/intro";
import { EASE, PRELOADER } from "@/lib/motion";

/** N11: counter 0 → 100 over 1.2s on the first visit of a session, then the panel lifts away. */
export function Preloader() {
  const [done, setDone] = useState(!showPreloader);
  const [lifting, setLifting] = useState(false);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (done) return;
    lockScroll(true);
    const controls = animate(0, 100, {
      duration: PRELOADER.count,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: v => {
        if (countRef.current) countRef.current.textContent = String(Math.round(v)).padStart(3, "0");
      },
      onComplete: () => setLifting(true),
    });
    return () => controls.stop();
  }, [done]);

  if (done) return null;

  return (
    <motion.div
      aria-hidden
      className="gutter fixed inset-0 z-[95] flex flex-col justify-between bg-bg py-6"
      initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
      animate={lifting ? { clipPath: "inset(0% 0% 100% 0%)" } : undefined}
      transition={{ duration: PRELOADER.lift, ease: EASE }}
      onAnimationComplete={() => {
        if (!lifting) return;
        markPreloaderSeen();
        lockScroll(false);
        setDone(true);
      }}
    >
      <p className="label">{profile.roles}</p>
      <div className="flex items-end justify-between gap-6">
        <p className="font-display-tight text-[clamp(2rem,5vw,3.5rem)]">
          {profile.name.split(" ")[0]} <em className="text-accent">Pratap Singh</em>
        </p>
        <span ref={countRef} className="font-display-tight tabular-nums text-[clamp(4rem,14vw,11rem)] leading-none text-fg">
          000
        </span>
      </div>
    </motion.div>
  );
}
