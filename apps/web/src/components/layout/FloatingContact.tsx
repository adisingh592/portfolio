import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { ROUTES } from "@portfolio/shared";
import { DUR, EASE } from "@/lib/motion";

const MotionLink = motion.create(Link);

/** Floating "Let's talk" pill (H01, P01). Appears after the first screen; hidden on /contact. */
export function FloatingContact() {
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const check = () => setShown(window.scrollY > window.innerHeight * 0.8);
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [pathname]);

  return (
    <AnimatePresence>
      {shown && pathname !== ROUTES.contact && (
        <MotionLink
          to={ROUTES.contact}
          className="group fixed bottom-4 right-4 z-40 inline-flex min-h-11 items-center gap-2 rounded-full bg-fg py-1.5 pl-1.5 pr-4 text-sm font-medium text-paper shadow-[0_12px_32px_-12px_rgb(33_26_21/0.6)] transition-[gap] duration-150 hover:gap-3 md:bottom-6 md:right-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          whileTap={reduce ? undefined : { scale: 0.96 }}
          transition={{ duration: DUR.fast, ease: EASE }}
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent transition-transform duration-500 ease-house group-hover:rotate-45">
            <ArrowUpRight aria-hidden className="h-4 w-4" />
          </span>
          Let's talk
        </MotionLink>
      )}
    </AnimatePresence>
  );
}
