import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";

/*
 * Card beam: a row of cards drifts through a glowing vertical beam and turns into code
 * as it crosses. Adapted from "Card Beam Animation" by BL/S Studio (MIT,
 * https://codepen.io/blacklead-studio/pen/xbwaqxE), itself inspired by evervault.com.
 * Rewritten for React: scoped to its container, one rAF loop, paused off-screen,
 * and the three.js background layer is replaced with a plain 2D canvas.
 */

export type BeamItem = {
  key: string;
  /** Lines of code the card's "scanned" side is filled with. */
  code: readonly string[];
  /** The card's front face. */
  face: ReactNode;
};

type Layout = { width: number; cardW: number; cardH: number; gap: number; count: number };

const BASE_SPEED = 70; // px/s
const BEAM_HALF = 4; // half-width of the zone where a card is "being scanned"
const CHAR_W = 6.6; // Geist Mono at 11px
const LINE_H = 13;

function measure(width: number, itemCount: number): Layout {
  const small = width < 640;
  const cardW = small ? 250 : 340;
  const cardH = Math.round(cardW * 0.62);
  const gap = small ? 28 : 48;
  const step = cardW + gap;
  // Enough cards to cover the row plus one off each edge, and a whole number of item cycles
  // so the sequence stays in order when a card wraps around.
  const needed = Math.ceil((width + 2 * step) / step);
  const count = Math.ceil(needed / itemCount) * itemCount;
  return { width, cardW, cardH, gap, count };
}

function generateCode(lines: readonly string[], cols: number, rows: number) {
  let flow = "";
  while (flow.length < cols * rows) flow += lines[Math.floor(Math.random() * lines.length)] + " ";
  let out = "";
  for (let r = 0; r < rows; r++) out += flow.slice(r * cols, (r + 1) * cols) + (r < rows - 1 ? "\n" : "");
  return out;
}

type Spark = { x: number; y: number; vx: number; vy: number; r: number; a: number; life: number; decay: number; t: number; tw: number };
type Mote = { x: number; y: number; v: number; a: number; r: number };

export function CardBeam({ items, className }: { items: readonly BeamItem[]; className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLCanvasElement>(null);
  const beamRef = useRef<HTMLCanvasElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const faceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const codeRefs = useRef<(HTMLPreElement | null)[]>([]);
  const [layout, setLayout] = useState<Layout | null>(null);

  // Motion state lives in a ref so the loop never re-renders React.
  const motion = useRef({ offset: 0, velocity: BASE_SPEED, direction: -1, dragging: false, lastX: 0, dragV: 0 });

  // Size the row to its container.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver(([entry]) => {
      const next = measure(Math.round(entry.contentRect.width), items.length);
      setLayout((prev) =>
        prev && prev.width === next.width && prev.count === next.count && prev.cardW === next.cardW ? prev : next,
      );
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, [items.length]);

  // Animation loop, rebuilt whenever the layout changes.
  useEffect(() => {
    const root = rootRef.current;
    const back = backRef.current;
    const beam = beamRef.current;
    if (!layout || !root || !back || !beam) return;
    const backCtx = back.getContext("2d");
    const ctx = beam.getContext("2d");
    if (!backCtx || !ctx) return;

    const { width: W, cardW, cardH, gap, count } = layout;
    const step = cardW + gap;
    const span = count * step;
    const H = cardH + 90;
    const beamX = W / 2;
    const cols = Math.ceil(cardW / CHAR_W) + 2;
    const rows = Math.ceil(cardH / LINE_H);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    for (const [c, g] of [[back, backCtx], [beam, ctx]] as const) {
      c.width = W * dpr;
      c.height = H * dpr;
      c.style.width = `${W}px`;
      c.style.height = `${H}px`;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    for (let i = 0; i < count; i++) {
      const el = codeRefs.current[i];
      if (el) el.textContent = generateCode(items[i % items.length].code, cols, rows);
    }

    // Soft dot used for every particle.
    const dot = document.createElement("canvas");
    dot.width = dot.height = 16;
    const dctx = dot.getContext("2d")!;
    const grad = dctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.3, "rgba(229,229,229,0.8)");
    grad.addColorStop(0.7, "rgba(163,163,163,0.35)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    dctx.fillStyle = grad;
    dctx.fillRect(0, 0, 16, 16);

    // Background motes drifting right (stands in for the original three.js layer).
    const motes: Mote[] = Array.from({ length: Math.round(W / 6) }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      v: 20 + Math.random() * 40,
      a: 0.15 + Math.random() * 0.45,
      r: 2 + Math.random() * 5,
    }));

    // Sparks thrown off the beam.
    const sparks: Spark[] = [];
    const makeSpark = (boost: number): Spark => ({
      x: beamX + (Math.random() - 0.5) * 3,
      y: Math.random() * H,
      vx: (0.2 + Math.random() * 0.8) * boost,
      vy: (Math.random() - 0.5) * 0.3 * boost,
      r: (0.5 + Math.random() * 0.7) * (1 + (boost - 1) * 0.6),
      a: 0.6 + Math.random() * 0.4,
      life: 1,
      decay: 0.005 + Math.random() * 0.02,
      t: 0,
      tw: 0.02 + Math.random() * 0.06,
    });

    let scanning = false;
    let glow = 1;
    let intensity = 1;
    let fade = 50;

    const placeCards = () => {
      const m = motion.current;
      let active = false;
      const scanL = beamX - BEAM_HALF;
      const scanR = beamX + BEAM_HALF;
      for (let i = 0; i < count; i++) {
        const card = cardRefs.current[i];
        const face = faceRefs.current[i];
        const code = codeRefs.current[i];
        if (!card || !face || !code) continue;
        const x = ((((m.offset + i * step) % span) + span) % span) - step;
        card.style.transform = `translate3d(${x}px,0,0)`;
        let faceCut: number; // % of the face hidden from the left
        let codeShow: number; // % of the code shown from the left
        if (x < scanR && x + cardW > scanL) {
          active = true;
          faceCut = (Math.max(scanL - x, 0) / cardW) * 100;
          codeShow = (Math.min(scanR - x, cardW) / cardW) * 100;
        } else if (x + cardW <= scanL) {
          faceCut = 100;
          codeShow = 100;
        } else {
          faceCut = 0;
          codeShow = 0;
        }
        face.style.clipPath = `inset(0 0 0 ${faceCut}%)`;
        code.style.clipPath = `inset(0 ${100 - codeShow}% 0 0)`;
      }
      scanning = active;
    };

    const drawBack = (dt: number) => {
      backCtx.clearRect(0, 0, W, H);
      backCtx.globalCompositeOperation = "lighter";
      for (const p of motes) {
        p.x += p.v * dt;
        if (p.x > W + 10) {
          p.x = -10;
          p.y = Math.random() * H;
        }
        const r = Math.random();
        if (r < 0.1) p.a = Math.max(0.05, p.a - 0.05);
        else if (r < 0.2) p.a = Math.min(0.6, p.a + 0.05);
        backCtx.globalAlpha = p.a;
        backCtx.drawImage(dot, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
      }
    };

    const drawBeam = () => {
      const k = 0.05;
      glow += ((scanning ? 3.2 : 1) - glow) * k;
      intensity += ((scanning ? 1.8 : 0.8) - intensity) * k;
      fade += ((scanning ? 35 : 55) - fade) * k;

      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";

      const lw = 3;
      const bar = (half: number, alpha: number, mid: string, edge: string, radius: number) => {
        const g = ctx.createLinearGradient(beamX - half, 0, beamX + half, 0);
        g.addColorStop(0, edge);
        g.addColorStop(0.5, mid);
        g.addColorStop(1, edge);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.roundRect(beamX - half, 0, half * 2, H, radius);
        ctx.fill();
      };
      bar(lw / 2, 1, `rgba(255,255,255,${Math.min(1, glow)})`, "rgba(255,255,255,0)", 15);
      bar(lw * 2, scanning ? 1 : 0.8, `rgba(229,229,229,${0.8 * glow})`, "rgba(229,229,229,0)", 25);
      bar(lw * 4, scanning ? 0.8 : 0.6, `rgba(163,163,163,${0.4 * glow})`, "rgba(163,163,163,0)", 35);
      if (scanning) bar(lw * 8, 0.6, "rgba(163,163,163,0.2)", "rgba(163,163,163,0)", 45);

      // Sparks
      const boost = intensity / 0.8;
      const cap = Math.round((scanning ? 1400 : 450) * (H / 300));
      let spawn = intensity * 1.5 + (boost > 1.1 ? (boost - 1) * 4 : 0);
      while (spawn > 0 && sparks.length < cap) {
        if (spawn >= 1 || Math.random() < spawn) sparks.push(makeSpark(boost));
        spawn -= 1;
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.t++;
        s.life -= s.decay;
        if (s.life <= 0 || s.x > W + 10) {
          sparks[i] = sparks[sparks.length - 1];
          sparks.pop();
          continue;
        }
        const edge = s.y < fade ? s.y / fade : s.y > H - fade ? (H - s.y) / fade : 1;
        const a = (s.a * s.life + Math.sin(s.t * s.tw) * 0.2) * Math.max(0, Math.min(1, edge));
        if (a <= 0) continue;
        ctx.globalAlpha = Math.min(1, a);
        ctx.drawImage(dot, s.x - s.r, s.y - s.r, s.r * 2, s.r * 2);
      }

      // Fade the top and bottom of the beam out.
      const v = ctx.createLinearGradient(0, 0, 0, H);
      v.addColorStop(0, "rgba(255,255,255,0)");
      v.addColorStop(fade / H, "rgba(255,255,255,1)");
      v.addColorStop(1 - fade / H, "rgba(255,255,255,1)");
      v.addColorStop(1, "rgba(255,255,255,0)");
      ctx.globalCompositeOperation = "destination-in";
      ctx.globalAlpha = 1;
      ctx.fillStyle = v;
      ctx.fillRect(0, 0, W, H);
    };

    let raf = 0;
    let last = 0;
    let running = false;

    const frame = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      const m = motion.current;
      if (!m.dragging) {
        // Ease a flick back down to the cruising speed.
        m.velocity = BASE_SPEED + (m.velocity - BASE_SPEED) * Math.pow(0.95, dt * 60);
        m.offset += m.velocity * m.direction * dt;
      }
      placeCards();
      drawBack(dt);
      drawBeam();
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // Rewrite a few cards' code now and then so the scanned side shimmers.
    const shimmer = window.setInterval(() => {
      if (!running) return;
      for (let i = 0; i < count; i++) {
        const el = codeRefs.current[i];
        if (el && Math.random() < 0.15) el.textContent = generateCode(items[i % items.length].code, cols, rows);
      }
    }, 200);

    placeCards();
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting && !document.hidden ? start() : stop()), {
      rootMargin: "100px",
    });
    io.observe(root);
    const onVisibility = () => {
      if (document.hidden) stop();
      else if (root.getBoundingClientRect().top < window.innerHeight) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      window.clearInterval(shimmer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [layout, items]);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const m = motion.current;
    m.dragging = true;
    m.lastX = e.clientX;
    m.dragV = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const m = motion.current;
    if (!m.dragging) return;
    const dx = e.clientX - m.lastX;
    m.offset += dx;
    m.dragV = dx * 60;
    m.lastX = e.clientX;
  };
  const onPointerUp = () => {
    const m = motion.current;
    if (!m.dragging) return;
    m.dragging = false;
    if (Math.abs(m.dragV) > 30) {
      m.velocity = Math.abs(m.dragV);
      m.direction = m.dragV > 0 ? 1 : -1;
    }
  };

  const H = layout ? layout.cardH + 90 : 300;

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={className}
      style={{
        position: "relative",
        height: H,
        overflow: "hidden",
        maskImage: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
      }}
    >
      <canvas ref={backRef} className="pointer-events-none absolute inset-0" />
      <div
        className="absolute inset-0 cursor-grab touch-pan-y select-none active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {layout &&
          Array.from({ length: layout.count }, (_, i) => (
            <div
              key={i}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="absolute left-0 will-change-transform"
              style={{ top: (H - layout.cardH) / 2, width: layout.cardW, height: layout.cardH }}
            >
              <pre
                ref={(el) => {
                  codeRefs.current[i] = el;
                }}
                className="beam-code absolute inset-0 m-0 overflow-hidden rounded-2xl font-mono text-[11px] leading-[13px] whitespace-pre text-fg-2"
                style={{ clipPath: "inset(0 100% 0 0)" }}
              />
              <div
                ref={(el) => {
                  faceRefs.current[i] = el;
                }}
                className="absolute inset-0"
              >
                {items[i % items.length].face}
              </div>
            </div>
          ))}
      </div>
      <canvas ref={beamRef} className="pointer-events-none absolute inset-0" />
    </div>
  );
}
