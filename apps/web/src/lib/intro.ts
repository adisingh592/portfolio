// Decides once per page load whether the preloader (N11) runs, and how long the first page
// should wait before its entrance animations start.
import { PRELOADER } from "./motion";

const KEY = "aps-preloader-seen";

function readSeen() {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return true;
  }
}

const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const showPreloader = typeof window !== "undefined" && !reduced && !readSeen();

export function markPreloaderSeen() {
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {
    /* storage blocked: preloader simply shows again next visit */
  }
}

/** Delay for the very first page's entrance: after the preloader lifts, or almost immediately. */
export const firstPageDelay = showPreloader ? PRELOADER.count + PRELOADER.lift - 0.15 : 0.1;
