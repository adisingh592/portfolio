import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, type CSSProperties } from "react";
import { ROUTES } from "@portfolio/shared";
import { ButtonLink } from "@/components/ui/Button";

/*
 * "With me, you can …": the lead-in sticks at mid-screen while a list of verbs scrolls through
 * it, lighting up whichever line crosses the middle. A light panel then rises over the list and
 * grows to full width. Adapted from "progressive scroll tricks" by Jhey (MIT,
 * https://codepen.io/jh3y/pen/EaavNVr), with JS doing the highlight so it also works in Safari.
 */

// One line per "What I do" area, plus the ends of the process.
const lines = [
  "train models.", // AI / ML
  "ship web apps.", // Full Stack
  "see with AI.", // Computer Vision
  "go to the edge.", // Edge AI
  "craft in 3D.", // Creative Tech
  "prototype.",
  "launch.",
];

export function BuildWithMe() {
  const reduce = useReducedMotion();
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  // Light each line by how close it is to the middle of the screen.
  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight / 2;
      for (const li of itemRefs.current) {
        if (!li) continue;
        const r = li.getBoundingClientRect();
        const on = Math.max(0, 1 - Math.abs(r.top + r.height / 2 - mid) / (r.height * 0.9));
        li.style.setProperty("--on", on.toFixed(3));
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduce]);

  // Panel grows from 90% with rounded top corners to full width as it enters.
  const { scrollYProgress } = useScroll({ target: panelRef, offset: ["start end", "start center"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const radius = useTransform(scrollYProgress, [0, 1], [24, 0]);
  const textOpacity = useTransform(scrollYProgress, [0.4, 1], [0, 1]);

  return (
    <section aria-label="Build with me" className="build-with-me relative">
      <header
        className="build-header sticky flex w-full justify-center font-display font-semibold tracking-[-0.03em]"
        style={{ "--count": lines.length } as CSSProperties}
      >
        <div className="build-row flex items-start justify-center gap-[0.3em]">
          <h2 className="build-lead whitespace-nowrap">
            <span aria-hidden>With me, you can</span>
            <span className="sr-only">With me, you can {lines.join(" ")}</span>
          </h2>
          <ul aria-hidden className="m-0 list-none p-0">
            {lines.map((l, i) => (
              <li
                key={l}
                ref={el => void (itemRefs.current[i] = el)}
                className="build-line whitespace-nowrap"
                style={reduce ? ({ "--on": 1 } as CSSProperties) : undefined}
              >
                {l}
              </li>
            ))}
          </ul>
        </div>
      </header>

      <div ref={panelRef} className="relative z-[2] grid h-screen place-items-center">
        <motion.div
          aria-hidden
          className="absolute inset-0 origin-bottom bg-fg"
          style={reduce ? undefined : { scale, borderTopLeftRadius: radius, borderTopRightRadius: radius }}
        />
        <motion.div
          className="relative flex flex-col items-center gap-8 px-6 text-center text-paper"
          style={reduce ? undefined : { opacity: textOpacity }}
        >
          <p className="font-display text-[clamp(2rem,4.5vw,4rem)] font-semibold leading-tight tracking-[-0.03em]">
            Let's build it together.
          </p>
          <ButtonLink to={ROUTES.contact} variant="primary" className="bg-paper! text-fg! hover:bg-surface-alt!">
            Start a project
          </ButtonLink>
        </motion.div>
      </div>
    </section>
  );
}
