// Motion tokens. See docs/Portfolio_Motion_and_Build_Plan.docx, section 3.
export const EASE = [0.16, 1, 0.3, 1] as const;

export const DUR = {
  instant: 0.15,
  exit: 0.2,
  quick: 0.4,
  fast: 0.5,
  base: 0.6,
  draw: 0.7,
  reveal: 0.8,
  bar: 1.4,
  count: 1.6,
} as const;

export const STAGGER = {
  word: 0.08,
  card: 0.08,
  row: 0.06,
} as const;

export const VIEWPORT = { once: true, margin: "0px 0px -60px 0px" } as const;

/** Spring used by magnetic buttons and the cursor follower (N08, N09). */
export const SPRING = { stiffness: 150, damping: 15, mass: 0.1 } as const;
