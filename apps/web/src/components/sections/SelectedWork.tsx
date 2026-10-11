import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { ROUTES } from "@portfolio/shared";
import { featuredProjects } from "@/data/projects";
import { getLenis, lockScroll } from "@/lib/lenis";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionLabel";
import { VoyageSlider } from "@/components/ui/VoyageSlider";

const SNAP_S = 0.9; // seconds for the zoom and the scroll that goes with it
const EASE = [0.76, 0, 0.24, 1] as const;

/** Smooth-scroll the window to `y`, then call `done`. Uses Lenis when it's running. */
function glideTo(y: number, done: () => void) {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(y, { duration: SNAP_S, lock: true, force: true, onComplete: done });
    return;
  }
  window.scrollTo({ top: y, behavior: "smooth" });
  window.setTimeout(done, SNAP_S * 1000);
}

/**
 * Snap-to-fullscreen stage. The child scrolls in as an inset, rounded frame. One scroll as it
 * arrives zooms it to fill the screen and holds the page there; the next scroll (either way)
 * zooms it back to the frame and carries on in that direction.
 */
function FullscreenStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const framed = useMotionValue(1); // 1 = framed, 0 = full screen
  const clipPath = useTransform(framed, v => `inset(${v * 9}% ${v * 7}% round ${v * 28}px)`);
  const scale = useTransform(framed, v => 1 - v * 0.08);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let mode: "framed" | "busy" | "full" = "framed";
    let lastY = window.scrollY;
    let enteredAt = 0;
    let lastWheel = 0;
    let touchY = 0;

    const stageTop = () => el.getBoundingClientRect().top + window.scrollY;

    const enter = () => {
      mode = "busy";
      animate(framed, 0, { duration: SNAP_S, ease: EASE });
      glideTo(stageTop(), () => {
        lockScroll(true);
        mode = "full";
        enteredAt = performance.now();
      });
    };

    const exit = (dir: 1 | -1) => {
      if (mode !== "full") return;
      mode = "busy";
      lockScroll(false);
      animate(framed, 1, { duration: SNAP_S, ease: EASE });
      // Land just outside the trigger zone so it doesn't re-snap straight away.
      glideTo(stageTop() + dir * window.innerHeight * 0.6, () => {
        mode = "framed";
        lastY = window.scrollY;
      });
    };

    const onScroll = () => {
      const y = window.scrollY;
      const dir = y - lastY;
      lastY = y;
      if (mode !== "framed" || dir === 0) return;
      const top = el.getBoundingClientRect().top;
      const zone = window.innerHeight * 0.5;
      if ((dir > 0 && top > 0 && top <= zone) || (dir < 0 && top < 0 && top >= -zone)) enter();
    };

    const onWheel = (e: WheelEvent) => {
      if (mode !== "full") return;
      const now = performance.now();
      // A trackpad keeps firing after the swipe that snapped us in: only a fresh gesture exits.
      const fresh = now - lastWheel > 250;
      lastWheel = now;
      if (fresh && now - enteredAt > 400 && Math.abs(e.deltaY) > 2) exit(e.deltaY > 0 ? 1 : -1);
    };
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (mode !== "full") return;
      const dy = touchY - e.touches[0].clientY;
      if (Math.abs(dy) > 40) exit(dy > 0 ? 1 : -1);
    };
    const onKey = (e: KeyboardEvent) => {
      if (mode !== "full") return;
      if (["ArrowDown", "PageDown", " "].includes(e.key)) exit(1);
      else if (["ArrowUp", "PageUp"].includes(e.key)) exit(-1);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
      if (mode === "full") lockScroll(false);
    };
  }, [framed]);

  return (
    <motion.div ref={ref} style={{ clipPath }} className="relative h-screen overflow-hidden">
      <motion.div style={{ scale }} className="h-full">
        {children}
      </motion.div>
    </motion.div>
  );
}

export function SelectedWork() {
  const reduce = useReducedMotion();
  return (
    <section className="pt-24 md:pt-32">
      <div className="gutter">
        <SectionHeader
          index="03"
          label="Selected work"
          title="Selected work"
          sub="A few projects across computer vision, edge AI and the web."
          action={
            <ButtonLink to={ROUTES.work} variant="ghost" className="px-0!">
              View all work
            </ButtonLink>
          }
        />
      </div>
      {reduce ? (
        <Reveal>
          <VoyageSlider projects={featuredProjects} />
        </Reveal>
      ) : (
        <FullscreenStage>
          <VoyageSlider projects={featuredProjects} className="h-full" />
        </FullscreenStage>
      )}
    </section>
  );
}
