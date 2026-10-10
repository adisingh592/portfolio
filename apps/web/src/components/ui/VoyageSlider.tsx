import { useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { Link } from "react-router";
import { ROUTES } from "@portfolio/shared";
import type { Project } from "@/data/projects";
import { useFinePointer } from "@/hooks/useMediaQuery";
import { ParticleImage, particlePresets } from "@/components/motion/ParticleImage";

/*
 * 3D card slider: the current project sits forward, its neighbours angle away on either side,
 * and the page behind takes on a blurred copy of the current cover. Hovering the front card tilts it.
 * Adapted from "Voyage Slider" by Sikriti Dakua (MIT, https://codepen.io/dev_loop/pen/MWKbJmO).
 */

type Role = "current" | "next" | "previous" | "hidden";

const wrap = (n: number, max: number) => ((n % max) + max) % max;

function roleOf(i: number, index: number, n: number): Role {
  if (i === index) return "current";
  if (i === wrap(index + 1, n)) return "next";
  if (i === wrap(index - 1, n)) return "previous";
  return "hidden";
}

/** Eased mouse tilt for the front card; writes CSS variables, never re-renders. */
function useTilt(disabled: boolean) {
  const targets = useRef<HTMLElement[]>([]);
  const state = useRef({ rx: 0, ry: 0, tx: 0, ty: 0, k: 0.06, raf: 0 });

  const tick = () => {
    const s = state.current;
    s.rx += (s.tx - s.rx) * s.k;
    s.ry += (s.ty - s.ry) * s.k;
    for (const el of targets.current) {
      el.style.setProperty("--rotX", `${s.ry.toFixed(2)}deg`);
      el.style.setProperty("--rotY", `${s.rx.toFixed(2)}deg`);
      el.style.setProperty("--bgPosX", `${(-s.rx * 0.3).toFixed(2)}%`);
      el.style.setProperty("--bgPosY", `${(s.ry * 0.3).toFixed(2)}%`);
    }
    s.raf = Math.abs(s.tx - s.rx) + Math.abs(s.ty - s.ry) > 0.01 ? requestAnimationFrame(tick) : 0;
  };
  const kick = () => {
    if (!state.current.raf) state.current.raf = requestAnimationFrame(tick);
  };

  useEffect(() => () => cancelAnimationFrame(state.current.raf), []);

  return {
    bind(els: HTMLElement[]) {
      targets.current = els;
    },
    onMove(e: ReactPointerEvent<HTMLElement>) {
      if (disabled || e.pointerType !== "mouse") return;
      const r = e.currentTarget.getBoundingClientRect();
      const s = state.current;
      s.k = 0.1;
      s.tx = (e.clientX - r.left - r.width / 2) / (Math.PI * 3);
      s.ty = -(e.clientY - r.top - r.height / 2) / (Math.PI * 4);
      kick();
    },
    onLeave() {
      const s = state.current;
      s.k = 0.06;
      s.tx = s.ty = 0;
      kick();
    },
  };
}

export function VoyageSlider({ projects }: { projects: readonly Project[] }) {
  const n = projects.length;
  const reduce = useReducedMotion() ?? false;
  const finePointer = useFinePointer();
  const rootRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [intro, setIntro] = useState(false);

  // Cards wipe in the first time the slider scrolls into view.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setRevealed(true);
          setIntro(true);
          window.setTimeout(() => setIntro(false), 2600);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const tilt = useTilt(reduce);
  const innerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const infoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const swipe = useRef({ x: 0, moved: false });

  const go = (d: 1 | -1) => {
    setDir(d);
    setIndex((i) => wrap(i + d, n));
  };

  // Only the front card (and its caption) tilt.
  useEffect(() => {
    tilt.bind([innerRefs.current[index], infoRefs.current[index]].filter((el): el is HTMLDivElement => !!el));
    tilt.onLeave();
  }, [index]);

  const onPointerDown = (e: ReactPointerEvent) => {
    swipe.current = { x: e.clientX, moved: false };
  };
  const onPointerUp = (e: ReactPointerEvent) => {
    const dx = e.clientX - swipe.current.x;
    if (Math.abs(dx) > 50) {
      swipe.current.moved = true;
      go(dx < 0 ? 1 : -1);
    }
  };

  const zIndex = (role: Role) =>
    role === "current" ? 20 : role === "hidden" ? 0 : (role === "previous") === (dir === 1) ? 30 : 10;

  return (
    <div
      ref={rootRef}
      className="voyage relative isolate overflow-hidden"
      data-revealed={revealed || undefined}
      data-intro={intro || undefined}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onClickCapture={(e) => {
        // A swipe that ends on a card shouldn't also open it.
        if (swipe.current.moved) {
          e.preventDefault();
          e.stopPropagation();
          swipe.current.moved = false;
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        else if (e.key === "ArrowLeft") go(-1);
      }}
    >
      {/* Blurred cover of the current project fills the section */}
      {projects.map((p, i) => (
        <div
          key={p.slug}
          aria-hidden
          className="voyage-bg"
          data-role={roleOf(i, index, n)}
          style={{ "--bg": `url(${p.cover.src})` } as CSSProperties}
        />
      ))}

      <div className="voyage-stage">
        <button type="button" onClick={() => go(-1)} className="voyage-btn" aria-label="Previous project">
          <ChevronLeft strokeWidth={1.5} />
        </button>

        <div className="voyage-slides" aria-live="polite">
          {projects.map((p, i) => {
            const role = roleOf(i, index, n);
            const current = role === "current";
            // Same element in every role so CSS transitions carry across a change.
            return (
              <div key={p.slug} className="voyage-slide" data-role={role} style={{ zIndex: zIndex(role) }}>
                <Link
                  to={ROUTES.caseStudy(p.slug)}
                  className="voyage-card"
                  tabIndex={role === "hidden" ? -1 : 0}
                  onPointerMove={current ? tilt.onMove : undefined}
                  onPointerLeave={current ? tilt.onLeave : undefined}
                  onClick={(e) => {
                    if (current) return;
                    e.preventDefault();
                    go(role === "previous" ? -1 : 1);
                  }}
                  aria-label={current ? `${p.title}: ${p.summary} Open case study` : `Show ${p.title}`}
                >
                  <div ref={(el) => void (innerRefs.current[i] = el)} className="voyage-inner">
                    <div className="voyage-image">
                      {/* Outer slides down while inner slides up: a wipe that leaves the image still */}
                      <div className="voyage-wipe" style={{ "--order": role === "previous" ? 0 : role === "current" ? 1 : 2 } as CSSProperties}>
                        <div className="voyage-wipe-inner">
                          <ParticleImage
                            src={p.cover.src}
                            preset={particlePresets[i % particlePresets.length]}
                            forceColor={current && !finePointer}
                            reduce={reduce}
                            className="voyage-canvas"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}

          {/* Captions sit on their own layer above every card, as in the original */}
          {projects.map((p, i) => (
            <div
              key={`${p.slug}-info`}
              ref={(el) => void (infoRefs.current[i] = el)}
              className="voyage-info"
              data-role={roleOf(i, index, n)}
              aria-hidden
            >
              <div className="voyage-text-wrap">
                <div className="voyage-text">
                  <p data-title><span>{p.title}</span></p>
                  <p data-subtitle><span>{[p.year, p.tags[0]].filter(Boolean).join(" · ")}</span></p>
                  <p data-description><span>{p.summary}</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button type="button" onClick={() => go(1)} className="voyage-btn" aria-label="Next project">
          <ChevronRight strokeWidth={1.5} />
        </button>
      </div>

      <p className="label relative z-10 pb-10 text-center">
        <span className="text-fg">{String(index + 1).padStart(2, "0")}</span> / {String(n).padStart(2, "0")}
      </p>
    </div>
  );
}
