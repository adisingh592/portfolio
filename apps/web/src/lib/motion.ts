// Motion system for the web app. Tokens live in @portfolio/ui; this file adds the shared
// variants and transitions that components use, so no component hard-codes its own values.
import type { Transition } from "motion/react";
import { DUR, EASE, SPRING, STAGGER, VIEWPORT } from "@portfolio/ui";

export { DUR, EASE, SPRING, STAGGER, VIEWPORT };

/** Standard block reveal (E04): y 20 → 0, opacity 0 → 1, 0.8s. */
export const reveal = {
  initial: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
} as const;

export const revealTransition = (delay = 0): Transition => ({
  duration: DUR.reveal,
  delay,
  ease: EASE,
});

/** Delay helpers for staggered groups. */
export const stagger = {
  word: (i: number) => i * STAGGER.word,
  card: (i: number) => (i % 3) * STAGGER.card,
  row: (i: number) => i * STAGGER.row,
};

/** Page transition timings (N01, plan section 8). */
export const PAGE = {
  cover: 0.6,
  lift: 0.6,
  fade: 0.5,
  fadeDelay: 0.2,
  /** Title reveal starts 0.2s after the new page mounts (0.8s into the transition). */
  titleDelay: 0.2,
} as const;

/** Preloader (N11). */
export const PRELOADER = { count: 1.2, lift: 0.6 } as const;
