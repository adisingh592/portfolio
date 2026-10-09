import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { useLocation, useOutlet } from "react-router";
import { PageEnterContext } from "@/components/motion/PageEnter";
import { firstPageDelay } from "@/lib/intro";
import { scrollTo } from "@/lib/lenis";
import { EASE, PAGE } from "@/lib/motion";
import { Footer } from "./Footer";

let hasNavigated = false;

const COVERED = "inset(0% 0% 0% 0%)";
const LIFTED = "inset(0% 0% 100% 0%)"; // collapsed against the top edge
const BELOW = "inset(100% 0% 0% 0%)"; // collapsed against the bottom edge

/**
 * N01 page transition. AnimatePresence (mode "wait") keeps the old page until its curtain has
 * covered the screen from the bottom (0.6s), resets scroll, mounts the new page under a full
 * curtain, then lifts the curtain off the top (0.6s). The new page fades in 0.2s after mounting
 * and its title reveal starts at the same moment (0.8s into the whole transition).
 */
export function AnimatedOutlet() {
  const location = useLocation();
  const outlet = useOutlet();
  return (
    <AnimatePresence mode="wait" onExitComplete={() => scrollTo(0, { immediate: true })}>
      <PageShell key={location.pathname}>{outlet}</PageShell>
    </AnimatePresence>
  );
}

function PageShell({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const [isFirst] = useState(() => !hasNavigated);

  useEffect(() => {
    hasNavigated = true;
  }, []);

  const enterDelay = reduce ? 0 : isFirst ? firstPageDelay : PAGE.titleDelay;

  return (
    <PageEnterContext.Provider value={enterDelay}>
      {!reduce && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[80] bg-accent"
          initial={{ clipPath: isFirst ? LIFTED : COVERED }}
          animate={{ clipPath: LIFTED }}
          exit={{ clipPath: [BELOW, COVERED] }}
          transition={{ duration: PAGE.cover, ease: EASE }}
        />
      )}
      <motion.div
        initial={{ opacity: isFirst ? 1 : 0 }}
        animate={{ opacity: 1 }}
        exit={reduce ? { opacity: 0, transition: { duration: 0.15 } } : { opacity: 1, transition: { duration: PAGE.cover } }}
        transition={{ duration: reduce ? 0.15 : PAGE.fade, delay: reduce ? 0 : PAGE.fadeDelay }}
      >
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
      </motion.div>
    </PageEnterContext.Provider>
  );
}
