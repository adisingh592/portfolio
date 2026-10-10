import { useEffect, useRef } from "react";

/*
 * Paints an image with moving particles that each take the colour of the pixel under them.
 * At rest they sample a greyscale copy; on hover they sample the full-colour image, either
 * everywhere or only near the cursor (`mouseRange`). The canvas is never cleared, so the
 * particles leave a painterly trail. Adapted from "Canvas Image Hover Interaction" by
 * Sikriti Dakua (MIT, https://codepen.io/dev_loop/pen/Bajvged).
 */

export type ParticlePreset = {
  /** Particles per 100,000 CSS px² of canvas. */
  density: number;
  shape: "circle" | "square" | "hexagon";
  fill: boolean;
  radius: number | [min: number, max: number];
  jump?: boolean;
  bounce?: boolean;
  /** Only particles within this many CSS px of the cursor switch to colour. */
  mouseRange?: number;
};

export const particlePresets: ParticlePreset[] = [
  { density: 1600, shape: "circle", fill: true, radius: [1, 2], mouseRange: 140, bounce: true },
  { density: 2700, shape: "square", fill: true, radius: 2, jump: true },
  { density: 2700, shape: "hexagon", fill: false, radius: 1, bounce: false },
];

type P = { x: number; y: number; vx: number; vy: number; r: number; rot: number; spin: number };

const MAX_V = 8;

/** Draw `img` into a w×h buffer like object-fit: cover and return its pixels. */
function coverPixels(img: HTMLImageElement, w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d", { willReadFrequently: true })!;
  const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * s;
  const dh = img.naturalHeight * s;
  g.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  return g.getImageData(0, 0, w, h).data;
}

function toGrey(src: Uint8ClampedArray) {
  const out = new Uint8ClampedArray(src.length);
  for (let i = 0; i < src.length; i += 4) {
    const l = (src[i] * 0.299 + src[i + 1] * 0.587 + src[i + 2] * 0.114) * 0.85;
    out[i] = out[i + 1] = out[i + 2] = l;
    out[i + 3] = 255;
  }
  return out;
}

type Props = {
  src: string;
  preset: ParticlePreset;
  /** Show the colour image without hovering (touch screens: the front card). */
  forceColor?: boolean;
  reduce?: boolean;
  className?: string;
};

export function ParticleImage({ src, preset, forceColor = false, reduce = false, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lensRef = useRef<HTMLImageElement>(null);
  const forceRef = useRef(forceColor);
  forceRef.current = forceColor;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let disposed = false;
    let raf = 0;
    let running = false;
    let visible = false;
    let hovered = false;
    const mouse = { x: -1e4, y: -1e4 };
    let cleanupEvents = () => {};

    const img = new Image();
    img.src = src;
    img
      .decode()
      .then(() => {
        if (disposed) return;
        const cssW = canvas.clientWidth;
        const cssH = canvas.clientHeight;
        if (!cssW || !cssH) return;
        // The card is drawn enlarged (~1.5x), so render above CSS size to keep particles crisp.
        const k = Math.min((window.devicePixelRatio || 1) * 1.5, 2.5);
        const W = Math.round(cssW * k);
        const H = Math.round(cssH * k);
        canvas.width = W;
        canvas.height = H;

        const colour = coverPixels(img, W, H);
        const grey = toGrey(colour);

        // Start from the greyscale image so a card is never blank.
        ctx.putImageData(new ImageData(grey, W, H), 0, 0);

        const paintStill = () =>
          ctx.putImageData(new ImageData(hovered || forceRef.current ? colour : grey, W, H), 0, 0);

        // Spotlight lens: the real colour image shown through a soft circle that eases after the cursor.
        const lens = lensRef.current;
        const lensState = { x: 0, y: 0, r: 0, tx: 0, ty: 0, tr: 0, raf: 0 };
        const lensTick = () => {
          const l = lensState;
          const e = reduce ? 1 : 0.18;
          l.x += (l.tx - l.x) * e;
          l.y += (l.ty - l.y) * e;
          l.r += (l.tr - l.r) * (reduce ? 1 : 0.12);
          lens?.style.setProperty("--lx", `${l.x.toFixed(1)}px`);
          lens?.style.setProperty("--ly", `${l.y.toFixed(1)}px`);
          lens?.style.setProperty("--lr", `${l.r.toFixed(1)}px`);
          const settled = Math.abs(l.tx - l.x) + Math.abs(l.ty - l.y) + Math.abs(l.tr - l.r) < 0.5;
          l.raf = settled ? 0 : requestAnimationFrame(lensTick);
        };
        const moveLens = (e: PointerEvent, r: number) => {
          if (!lens || !preset.mouseRange) return;
          lensState.tx = e.offsetX;
          lensState.ty = e.offsetY;
          lensState.tr = r;
          if (lensState.r < 1) {
            lensState.x = lensState.tx;
            lensState.y = lensState.ty;
          }
          if (!lensState.raf) lensState.raf = requestAnimationFrame(lensTick);
        };

        const onEnter = (e: PointerEvent) => {
          hovered = true;
          moveLens(e, preset.mouseRange ?? 0);
          if (reduce) paintStill();
        };
        const onLeave = (e: PointerEvent) => {
          hovered = false;
          moveLens(e, 0);
          mouse.x = mouse.y = -1e4;
          if (reduce) paintStill();
        };
        const onMove = (e: PointerEvent) => {
          mouse.x = e.offsetX * (W / canvas.clientWidth);
          mouse.y = e.offsetY * (H / canvas.clientHeight);
          if (hovered) moveLens(e, preset.mouseRange ?? 0);
        };
        canvas.addEventListener("pointerenter", onEnter);
        canvas.addEventListener("pointerleave", onLeave);
        canvas.addEventListener("pointermove", onMove);
        cleanupEvents = () => {
          canvas.removeEventListener("pointerenter", onEnter);
          canvas.removeEventListener("pointerleave", onLeave);
          canvas.removeEventListener("pointermove", onMove);
          cancelAnimationFrame(lensState.raf);
        };

        if (reduce) {
          paintStill();
          return;
        }

        const count = Math.round((preset.density * cssW * cssH) / 100_000);
        const rand = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1) + a);
        const ps: P[] = Array.from({ length: count }, () => {
          const r = (Array.isArray(preset.radius) ? rand(preset.radius[0], preset.radius[1]) : preset.radius) * k;
          return {
            x: rand(r, W - r),
            y: rand(r, H - r),
            vx: (0.5 - Math.random()) * MAX_V * k,
            vy: (0.5 - Math.random()) * MAX_V * k,
            r,
            rot: 0,
            spin: rand(2, 5),
          };
        });
        const range = (preset.mouseRange ?? 0) * k;
        ctx.lineWidth = k;

        const frame = () => {
          const force = forceRef.current;
          for (const p of ps) {
            let data: Uint8ClampedArray;
            if (force) data = colour;
            else if (range) {
              const near = hovered && Math.hypot(p.x - mouse.x, p.y - mouse.y) < range + p.r;
              data = near ? colour : grey;
            } else data = hovered ? colour : grey;

            const px = Math.min(W - 1, Math.max(0, p.x | 0));
            const py = Math.min(H - 1, Math.max(0, p.y | 0));
            const i = (px + py * W) * 4;
            const c = `rgb(${data[i]},${data[i + 1]},${data[i + 2]})`;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((Math.PI / 180) * p.rot);
            ctx.beginPath();
            if (preset.shape === "square") ctx.rect(-p.r / 2, -p.r / 2, p.r, p.r);
            else if (preset.shape === "circle") ctx.arc(0, 0, p.r, 0, Math.PI * 2);
            else {
              ctx.moveTo(p.r, 0);
              for (let s = 1; s < 7; s++) ctx.lineTo(p.r * Math.cos((s * Math.PI) / 3), p.r * Math.sin((s * Math.PI) / 3));
            }
            ctx.restore();
            if (preset.fill) {
              ctx.fillStyle = c;
              ctx.fill();
            } else {
              ctx.strokeStyle = c;
              ctx.stroke();
            }

            if (preset.bounce ?? true) {
              if (p.x + p.r > W || p.x - p.r < 0) p.vx *= -1;
              if (p.y + p.r > H || p.y - p.r < 0) p.vy *= -1;
            } else {
              if (p.x > W) p.x = 0;
              else if (p.x < 0) p.x = W;
              if (p.y > H) p.y = 0;
              else if (p.y < 0) p.y = H;
            }
            p.rot += p.spin;

            if (preset.jump) {
              p.x = Math.random() * W;
              p.y = Math.random() * H;
            } else {
              p.x += p.vx;
              p.y += p.vy;
            }
          }
          raf = requestAnimationFrame(frame);
        };

        const sync = () => {
          const should = visible && !document.hidden;
          if (should && !running) {
            running = true;
            raf = requestAnimationFrame(frame);
          } else if (!should && running) {
            running = false;
            cancelAnimationFrame(raf);
          }
        };
        const io = new IntersectionObserver(([e]) => {
          visible = e.isIntersecting;
          sync();
        });
        io.observe(canvas);
        document.addEventListener("visibilitychange", sync);
        const prev = cleanupEvents;
        cleanupEvents = () => {
          prev();
          io.disconnect();
          document.removeEventListener("visibilitychange", sync);
        };
      })
      .catch(() => {});

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      cleanupEvents();
    };
  }, [src, preset, reduce]);

  return (
    <div className={className}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {preset.mouseRange && (
        <img ref={lensRef} src={src} alt="" aria-hidden draggable={false} className="particle-lens" />
      )}
    </div>
  );
}
