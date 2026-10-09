import { MotionConfig, useReducedMotion } from "motion/react";
import { useEffect } from "react";
import { destroyLenis, startLenis } from "@/lib/lenis";
import { ToastProvider } from "@/components/ui/Toast";
import { CommandPaletteProvider } from "./CommandPalette";
import { Cursor } from "./Cursor";
import { FloatingContact } from "./FloatingContact";
import { Navbar } from "./Navbar";
import { AnimatedOutlet } from "./PageTransition";
import { Preloader } from "./Preloader";

/** Smooth scrolling (N03). Skipped entirely for reduced motion. */
function useSmoothScroll() {
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    startLenis();
    return destroyLenis;
  }, [reduce]);
}

export function RootLayout() {
  useSmoothScroll();
  return (
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        <CommandPaletteProvider>
          <a
            href="#main"
            className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-fg px-4 py-2 text-sm text-paper focus:translate-y-0"
          >
            Skip to content
          </a>
          <div className="relative min-h-screen">
            <Navbar />
            <AnimatedOutlet />
          </div>
          <FloatingContact />
          <Cursor />
          <Preloader />
        </CommandPaletteProvider>
      </ToastProvider>
    </MotionConfig>
  );
}
