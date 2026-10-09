import { useEffect, useState } from "react";

/**
 * S03-style active section detection: a thin band across the middle of the screen
 * (rootMargin −45% / −50%); whichever section crosses it is active.
 */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "");
  const key = ids.join("|");

  useEffect(() => {
    const els = key.split("|").map(id => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [key]);

  return active;
}
