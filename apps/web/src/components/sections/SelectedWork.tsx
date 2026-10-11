import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { ROUTES } from "@portfolio/shared";
import { featuredProjects } from "@/data/projects";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionLabel";
import { VoyageSlider } from "@/components/ui/VoyageSlider";

/**
 * Pins its child for a stretch of scrolling. On the way in it grows from an inset, rounded frame
 * to the full viewport, stays full screen for a while, then shrinks back to the frame before
 * the page moves on. Scrolling up plays it in reverse.
 */
function FullscreenStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // 1 = framed, 0 = full screen
  const framed = useTransform(scrollYProgress, [0, 0.28, 0.72, 1], [1, 0, 0, 1]);
  const clipPath = useTransform(framed, v => `inset(${v * 9}% ${v * 7}% round ${v * 28}px)`);
  const scale = useTransform(framed, v => 1 - v * 0.08);

  return (
    <div ref={ref} className="relative h-[260vh]">
      <motion.div style={{ clipPath }} className="sticky top-0 h-screen overflow-hidden">
        <motion.div style={{ scale }} className="h-full">
          {children}
        </motion.div>
      </motion.div>
    </div>
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
