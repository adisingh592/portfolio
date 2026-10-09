import { createContext, useContext } from "react";

/**
 * Seconds the current page waits before its on-mount entrance animations start.
 * Set by PageTransition: after the preloader on first load, or after the curtain lifts.
 */
export const PageEnterContext = createContext(0);

export const usePageEnterDelay = () => useContext(PageEnterContext);
