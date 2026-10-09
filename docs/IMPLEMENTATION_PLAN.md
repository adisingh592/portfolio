# Portfolio Build Plan: Motion & Scroll System

Reverse-engineered from `utkarsh-awasthi.vercel.app` (production JS/CSS bundles, 2026-10-09).
This plan copies the **motion system and layout language**, not the content. Use your own name, projects, copy and photos.

---

## 1. What the reference site actually uses

| Layer | Reference uses | Notes |
|---|---|---|
| Build | **Vite + React** (SPA, single `#root`) | |
| Styling | **Tailwind CSS v4** (`@property --tw-*`, `@layer base`) | |
| Animation | **Framer Motion** (`whileInView`, `layoutId`, `AnimatePresence`, `animate()`) | Today the package is published as `motion`, imported from `motion/react` |
| Smooth scroll | **None.** Only native `html { scroll-behavior: smooth }` | No Lenis, no GSAP, no ScrollTrigger |
| Marquee | **Pure CSS keyframe**, 40s linear infinite | No JS |
| Fonts | Inter 400/500/600 · **Instrument Serif** (regular + italic) · JetBrains Mono | Google Fonts |

The "premium" feel comes from **one easing curve used everywhere**, giant tight-tracked type, and small staggered reveals. It doesn't rely on heavy scroll-jacking.

---

## 2. Design tokens

```css
/* src/index.css */
@import "tailwindcss";

@theme {
  --color-background: #000;
  --color-primary: #e1e0cc;          /* warm off-white: all text */
  --color-card: #0c0c0b;
  --color-muted: #161614;
  --color-border: #e1e0cc1f;         /* primary @ 12% */
  --color-ember: #f0a36b;            /* single accent */
  --font-sans: "Inter", sans-serif;
  --font-serif: "Instrument Serif", serif;
  --font-mono: "JetBrains Mono", monospace;
  --ease-prisma: cubic-bezier(.16, 1, .3, 1);   /* THE easing */
}

html { scroll-behavior: smooth; background: #000; color: var(--color-primary); }
```

Text hierarchy is done with **opacity of the primary color**, not separate grays:
`text-primary` (100%) → `/80` taglines → `/70` nav and body → `/60` sub copy → `/50` labels → `/40` decorative asterisks.

Page gutter: `px-4 sm:px-6 md:px-10`.

---

## 3. Motion settings (copy exactly)

```ts
// src/lib/motion.ts
export const EASE = [0.16, 1, 0.3, 1] as const;   // easeOutExpo-like, used for everything

export const DUR = {
  exit: 0.2,        // list item exit
  fast: 0.5,        // nav pill dot, hover transitions
  nav: 0.6,         // nav slide-in, per-word heading reveal, layout shifts
  reveal: 0.8,      // standard block reveal
  bar: 1.2,         // progress bars
  barLong: 1.4,
  count: 1.6,       // number count-up
};

export const STAGGER = {
  word: 0.08,       // per word in headings
  card: 0.08,       // grid cards: (index % 3) * 0.08
  heroSub: 0.5,     // hero paragraph delay
  heroCta: 0.7,     // hero button delay
  headerSub: 0.3,   // section subtitle delay
};

export const VIEWPORT = { once: true, margin: "0px 0px -60px 0px" };
```

**Reveal recipe (used on almost every element):** `y: 20 → 0`, `opacity: 0 → 1`, 0.8s, `EASE`, fires once when the element is 60px inside the viewport.

---

## 4. Components to build

### 4.1 `<Reveal>`: fade-up on scroll
```tsx
import { motion } from "motion/react";
import { EASE, VIEWPORT } from "@/lib/motion";

export function Reveal({ children, delay = 0, className }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
```

### 4.2 `<WordReveal>`: heading split by word, staggered, with superscript asterisk
```tsx
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { EASE } from "@/lib/motion";

export function WordReveal({ text, showAsterisk = false, className = "" }: {
  text: string; showAsterisk?: boolean; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const words = text.split(" ");
  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {words.map((w, i) => {
        const last = i === words.length - 1;
        return (
          <motion.span
            key={i}
            className="relative inline-block"
            style={{ marginRight: last ? 0 : "0.25em" }}
            initial={{ y: 20, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
          >
            {w}
            {showAsterisk && last && (
              <span className="absolute -right-[0.3em] top-[0.65em] text-[0.31em]">*</span>
            )}
          </motion.span>
        );
      })}
    </div>
  );
}
```
> Optional upgrade the reference skips: wrap each word in `overflow-hidden` and animate `y: "100%" → 0` for a masked "slide up from a line" reveal.

### 4.3 `<SectionHeader>`: the "(04) Stack / Tools of the trade*" layout from the screenshot
```tsx
export function SectionHeader({ index, label, title, sub }: {
  index: string; label: string; title: string; sub?: string;
}) {
  return (
    <header className="mb-14 grid grid-cols-12 items-end gap-4 md:mb-24">
      <Reveal className="col-span-12 md:col-span-3 md:pb-[0.6vw]">
        <p className="text-sm text-primary/50">({index}) {label}</p>
      </Reveal>
      <div className="col-span-12 md:col-span-9">
        <h2 className="font-medium leading-[0.85] tracking-[-0.065em]
                       text-[15vw] sm:text-[12vw] md:text-[8vw] lg:text-[7vw]">
          <WordReveal text={title} showAsterisk />
        </h2>
        {sub && (
          <Reveal delay={0.3}>
            <p className="mt-6 max-w-xl text-sm text-primary/60 md:text-base" style={{ lineHeight: 1.3 }}>
              {sub}
            </p>
          </Reveal>
        )}
      </div>
    </header>
  );
}
```
Key detail: the label is bottom-aligned with the giant heading (`items-end` + `md:pb-[0.6vw]`), and sizes use **`vw`** so the type scales with the viewport.

### 4.4 `<Marquee>`: the sliding horizontal bar
How it works: render the item list **twice** in one `w-max` flex row, then translate the row by **-50%**. When the first copy has fully scrolled out, the second copy sits exactly where the first started, so the loop has no visible seam.

```css
/* index.css */
@keyframes marquee { to { transform: translateX(-50%); } }
.marquee-track { animation: marquee 40s linear infinite; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .marquee-track { animation: none; }
}
```

```tsx
import { Fragment } from "react";

export function Marquee({ items }: { items: string[] }) {
  const row = (copy: number) =>
    items.map((t, i) => (
      <span key={`${copy}-${t}`} className="flex shrink-0 items-start">
        <span className={`px-[0.25em] ${i % 2 ? "font-serif font-normal italic tracking-[-0.02em]" : ""}`}>
          {t}
        </span>
        <span className="mt-[0.2em] text-[0.35em] text-primary/40">*</span>
      </span>
    ));

  return (
    <Reveal>
      <div className="overflow-hidden border-y border-border py-6 md:py-8" aria-hidden="true">
        <div className="marquee-track flex w-max whitespace-nowrap font-medium leading-none
                        tracking-[-0.06em] text-[13vw] md:text-[7vw]">
          {row(0)}{row(1)}
        </div>
      </div>
    </Reveal>
  );
}
```
Style rules from the screenshot:
- **Alternate** sans (Inter 500, tracking -0.06em) and serif italic (Instrument Serif, tracking -0.02em) on odd items.
- Small raised `*` separators at 35% size and 40% opacity.
- Thin `border-y` hairlines at 12% opacity, with the section full-bleed (no gutter on this row).
- `aria-hidden` on the marquee. Show the same skills as a real list or cards below it for screen readers.

**Optional upgrades (not on the reference):**
- *Pause on hover:* `.group:hover .marquee-track { animation-play-state: paused; }`
- *Scroll-velocity marquee* (speeds up or reverses with scroll): replace the CSS animation with `useScroll` + `useVelocity` + `useAnimationFrame` from `motion/react`, and wrap x with `wrap(-50, 0, v)`.
- *Second row in reverse:* add `animation-direction: reverse` on a second track.

### 4.5 `<CountUp>`: stat numbers
```tsx
import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { EASE } from "@/lib/motion";

export function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    if (reduce) { el.textContent = value.toLocaleString(); return; }
    const c = animate(0, value, { duration: 1.6, ease: EASE,
      onUpdate: v => (el.textContent = Math.round(v).toLocaleString()) });
    return () => c.stop();
  }, [inView, value, reduce]);
  return <span ref={ref} className="tabular-nums">0</span>;
}
```
Stats display: `tracking-[-0.07em] text-[19vw] md:text-[7.5vw]` with a `text-sm text-primary/50` label under it.

### 4.6 `<FloatingNav>`: appears after the hero, with a sliding active dot
- Show the nav when `window.scrollY > innerHeight * 0.8` (passive scroll listener).
- It enters from the top: `initial={{ y: "-110%" }} animate={{ y: 0 }} exit={{ y: "-110%" }}`, 0.6s, `EASE`, inside `<AnimatePresence>`.
- **Active section** comes from an `IntersectionObserver` with `rootMargin: "-45% 0px -50% 0px"`. This makes a thin band near the middle of the screen, and whichever section crosses it becomes active.
- The active indicator is a 4px dot `<motion.span layoutId="nav-dot" transition={{ duration: 0.5, ease: EASE }} />`. Because of `layoutId`, it glides between links instead of jumping.
- Shape: `fixed left-1/2 top-0 -translate-x-1/2 rounded-b-2xl md:rounded-b-3xl border border-t-0 border-border bg-black`, like a tab hanging from the top edge.

### 4.7 Progress bars (education and language split)
`initial={{ width: 0 }} whileInView={{ width: "72%" }} viewport={{ once: true }}`, duration 1.2–1.4s, delay 0.2–0.3s (+0.08 per segment), `EASE`.

### 4.8 Project list rows
- `<motion.li layout>` with the standard reveal, plus `exit={{ opacity: 0, transition: { duration: 0.2 } }}` and `layout: { duration: 0.6, ease: EASE }`, so filtering reflows smoothly.
- Rows are `border-t border-border` with hover `bg-primary/[0.03]` (`transition-colors duration-500`).
- Make the whole row clickable: put `after:absolute after:inset-0` on the title link.
- Title in large sans, tagline in `font-serif italic text-primary/80`, plus a circular 48px arrow button that animates on hover.

### 4.9 Hero load sequence (no scroll trigger, runs on mount)
| t (s) | Element | Motion |
|---|---|---|
| 0 → 0.08·n | Name / headline words | `WordReveal`, y20→0, 0.6s each |
| 0.5 | Sub paragraph | y20→0 + fade, 0.8s |
| 0.7 | CTA pill | y20→0 + fade, 0.8s |

CTA pill: `rounded-full bg-primary text-black py-1 pl-5 pr-1`, with an icon circle on the right. On hover, `gap-2 → gap-3` (`transition-all`) so the arrow nudges outward.

### 4.10 "Liquid metal" button (optional flourish)
- Conic-gradient rim rotating via `@property --liquid-angle`, `5s linear infinite`.
- Metallic linear gradient, `background-size: 220%`, `background-position` drift, `9s ease-in-out infinite`.
- Hover: a skewed white sheen sweeps across (`translateX(520%)`, 1.1s, `--ease-prisma`), and the glow shadow grows (`transition: box-shadow .5s var(--ease-prisma)`).
- Turn all of it off under `prefers-reduced-motion`.

---

## 5. Page structure

```
<Hero/>                      full viewport, on-mount sequence
<FloatingNav/>               fixed, appears after 80vh
<section id="about">         (01) About   + CountUp stats
<section id="work">          (02) Work    + project rows
<section id="experience">    (03) Experience + progress bars
<section id="stack">         (04) Stack   + MARQUEE + skill card grid (stagger (i%3)*0.08)
<section id="contact">       (05) Contact
```
Section spacing: `py-24 md:py-36`. The stack section omits the gutter so the marquee can run edge to edge. Put the gutter back on the header and grid inside it.

---

## 6. Build steps

1. **Scaffold**
   ```bash
   npm create vite@latest . -- --template react-ts
   npm i motion clsx
   npm i -D tailwindcss @tailwindcss/vite
   ```
   Add `tailwindcss()` to `vite.config.ts` plugins, and a `@` path alias.
2. **Fonts:** add the Google Fonts `<link>` for Inter, Instrument Serif (ital 0,1) and JetBrains Mono in `index.html`, with `display=swap`. Set `<meta name="theme-color" content="#000">`.
3. **Tokens:** add the CSS from §2, the marquee keyframes, and the reduced-motion block.
4. **Motion lib:** create `src/lib/motion.ts` (§3).
5. **Primitives:** build `Reveal`, `WordReveal`, `SectionHeader`, `CountUp`, then `Marquee`.
6. **Stack section first.** It matches the screenshot, so you can check the look early.
7. **Hero**, then **FloatingNav**, then the remaining sections.
8. **Content:** keep it in `src/data/profile.ts` so the components stay presentational.
9. **QA pass:** see §7.
10. **Deploy:** push to GitHub and import in Vercel (it detects Vite with zero config).

---

## 7. QA checklist

- [ ] OS "reduce motion" on: marquee stops, counters jump to the final value, no smooth scroll.
- [ ] The marquee loop has no visible jump. If it does, the two copies aren't identical, or there's a `gap` on the track. Use per-item padding instead of `gap`.
- [ ] Every `whileInView` uses `once: true`, so nothing re-animates on scroll-up.
- [ ] No horizontal page scroll at 375px. Check the `vw` headings and keep `overflow-hidden` on the marquee wrapper.
- [ ] Nav active dot tracks the correct section at the top and bottom of the page.
- [ ] Only `transform` and `opacity` are animated. The width-based progress bars are the one acceptable exception.
- [ ] Lighthouse: performance ≥ 90 and CLS ≈ 0. Reserve hero image dimensions.

---

## 8. Optional: go beyond the reference

- **Lenis** smooth scroll (`npm i lenis`): adds inertia. Remove `scroll-behavior: smooth` if you use it, because they conflict.
- **Scroll-linked parallax:** `useScroll({ target, offset: ["start end", "end start"] })` → `useTransform(scrollYProgress, [0, 1], ["-10%", "10%"])` on images.
- **Sticky horizontal scroll** for projects: a tall section (`h-[300vh]`) with a `sticky top-0` inner track, and x mapped from `scrollYProgress` to `-(trackWidth - vw)`.
- **Masked line reveals** on headings (see the note in §4.2).
