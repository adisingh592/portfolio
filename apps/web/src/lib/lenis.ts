// Single Lenis instance for the whole site (N03). Lenis scrolls the real window, so Motion's
// useScroll, sticky positioning and IntersectionObserver all keep working unchanged.
import Lenis from "lenis";

let lenis: Lenis | null = null;

export function startLenis() {
  if (lenis) return lenis;
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, autoRaf: true });
  return lenis;
}

export function destroyLenis() {
  lenis?.destroy();
  lenis = null;
}

/** Scroll to an element, selector or offset. Falls back to native scrolling when Lenis is off. */
export function scrollTo(target: number | string | HTMLElement, opts: { immediate?: boolean; offset?: number } = {}) {
  if (lenis) {
    lenis.scrollTo(target, { immediate: opts.immediate, offset: opts.offset ?? 0 });
    return;
  }
  const behavior: ScrollBehavior = opts.immediate ? "instant" : "smooth";
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior });
    return;
  }
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY + (opts.offset ?? 0);
  window.scrollTo({ top, behavior });
}

/** Pause scrolling while a modal (command palette, mobile menu) is open. */
export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}
