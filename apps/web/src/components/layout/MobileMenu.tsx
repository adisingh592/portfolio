import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { NavLink } from "react-router";
import { X } from "lucide-react";
import { ROUTES } from "@portfolio/shared";
import { cn } from "@portfolio/ui";
import { navLinks, profile, socials } from "@/data/profile";
import { DUR, EASE, STAGGER } from "@/lib/motion";
import { lockScroll } from "@/lib/lenis";

const links = [{ to: ROUTES.home, label: "Home" }, ...navLinks, { to: ROUTES.resume, label: "Resume" }];

/** Full-screen menu for phones and small tablets. Escape or a link closes it. */
export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="gutter fixed inset-0 z-[70] flex flex-col bg-bg py-5"
          initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: DUR.base, ease: EASE }}
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 font-display text-xl font-medium">
              <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-accent" />
              {profile.shortName}
            </span>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line"
            >
              <X aria-hidden className="h-5 w-5" />
            </button>
          </div>

          <nav aria-label="Mobile" className="mt-12 flex-1">
            <ul className="space-y-1">
              {links.map((l, i) => (
                <li key={l.to} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: DUR.reveal, delay: 0.15 + i * STAGGER.row, ease: EASE }}
                  >
                    <NavLink
                      to={l.to}
                      end={l.to === ROUTES.home}
                      onClick={onClose}
                      className={({ isActive }) =>
                        cn("flex items-baseline gap-3 py-1 font-display-tight text-[clamp(2.6rem,12vw,4rem)]", isActive ? "italic text-accent" : "text-fg")
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {l.label}
                          {isActive && <span className="label not-italic">current</span>}
                        </>
                      )}
                    </NavLink>
                  </motion.div>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-2 border-t border-line pt-5 text-sm text-fg-2">
            <a href={`mailto:${profile.email}`} className="block min-h-11 py-2 text-fg">{profile.email}</a>
            {socials.github && <a href={socials.github} target="_blank" rel="noreferrer" className="mr-6 inline-block min-h-11 py-2">GitHub ↗</a>}
            {socials.linkedin && <a href={socials.linkedin} target="_blank" rel="noreferrer" className="inline-block min-h-11 py-2">LinkedIn ↗</a>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
