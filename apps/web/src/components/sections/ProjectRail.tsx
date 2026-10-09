import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { useIsDesktop } from "@/hooks/useMediaQuery";

type Props = {
  header: ReactNode;
  items: ReactNode[];
  /** Footer under the vertical list (phones, reduced motion). */
  footer?: ReactNode;
};

/**
 * N05 sticky horizontal rail. On desktop the section is as tall as the horizontal distance to
 * travel; its inner panel sticks to the viewport and slides sideways as you scroll down.
 * Phones, tablets and reduced-motion visitors get a normal vertical list instead.
 */
export function ProjectRail(props: Props) {
  const desktop = useIsDesktop();
  const reduce = useReducedMotion();
  return desktop && !reduce ? <Rail {...props} /> : <List {...props} />;
}

function Rail({ header, items }: Props) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => setDistance(Math.max(0, el.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  return (
    <section ref={section} className="relative" style={{ height: `calc(100vh + ${distance}px)` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-16">
        <div className="gutter">{header}</div>
        <motion.div ref={track} style={{ x }} className="flex w-max gap-8 pl-4 pr-10 sm:pl-6 md:pl-10">
          {items.map((item, i) => (
            <div key={i} className="w-[min(38vw,calc((100vh-380px)*1.333),560px)] shrink-0">
              {item}
            </div>
          ))}
        </motion.div>
        <div className="gutter mt-8 flex items-center gap-4">
          <div className="h-px w-48 overflow-hidden bg-line">
            <motion.div className="h-full origin-left bg-fg" style={{ scaleX: scrollYProgress }} />
          </div>
          <p className="label">Scroll to explore →</p>
        </div>
      </div>
    </section>
  );
}

function List({ header, items, footer }: Props) {
  return (
    <section className="gutter py-24">
      {header}
      <div className="grid gap-12 sm:grid-cols-2 sm:gap-x-6">
        {items.map((item, i) => (
          <div key={i}>{item}</div>
        ))}
      </div>
      {footer}
    </section>
  );
}
