import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router";
import { Menu, Search } from "lucide-react";
import { ROUTES } from "@portfolio/shared";
import { cn } from "@portfolio/ui";
import { navLinks, profile } from "@/data/profile";
import { DUR, EASE } from "@/lib/motion";
import { shortcutLabel, useCommandPalette } from "./CommandPalette";
import { MobileMenu } from "./MobileMenu";

function Logo() {
  return (
    <Link to={ROUTES.home} className="group inline-flex min-h-11 items-center gap-2 font-display text-xl font-semibold tracking-tight" aria-label={`${profile.shortName}, home`}>
      <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-accent transition-transform duration-500 ease-house group-hover:scale-125" />
      {profile.shortName}
    </Link>
  );
}

/** Route links with an active dot that glides between items (S03). */
function NavItems({ layoutId }: { layoutId: string }) {
  return (
    <ul className="hidden items-center gap-8 md:flex">
      {navLinks.map(l => (
        <li key={l.to}>
          <NavLink
            to={l.to}
            className={({ isActive }) =>
              cn("relative inline-flex min-h-11 items-center text-sm transition-colors duration-150", isActive ? "text-fg" : "text-fg-2 hover:text-fg")
            }
          >
            {({ isActive }) => (
              <>
                {l.label}
                {isActive && (
                  <motion.span
                    layoutId={layoutId}
                    aria-hidden
                    className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent"
                    transition={{ duration: DUR.fast, ease: EASE }}
                  />
                )}
              </>
            )}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

function Actions({ onMenu }: { onMenu: () => void }) {
  const palette = useCommandPalette();
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={palette.open}
        aria-label={`Search pages and projects (${shortcutLabel})`}
        className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-3 text-fg-2 transition-colors hover:border-fg/40 hover:text-fg"
      >
        <Search aria-hidden className="h-4 w-4" />
        <kbd className="label hidden lg:inline">{shortcutLabel}</kbd>
      </button>
      <button
        type="button"
        onClick={onMenu}
        aria-label="Open menu"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-fg md:hidden"
      >
        <Menu aria-hidden className="h-5 w-5" />
      </button>
    </div>
  );
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [floating, setFloating] = useState(false);

  useEffect(() => {
    const check = () => setFloating(window.scrollY > window.innerHeight * 0.8);
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

  return (
    <>
      <header className="gutter absolute inset-x-0 top-0 z-40 flex h-20 items-center justify-between">
        <Logo />
        <nav aria-label="Main" className="flex items-center gap-8">
          <NavItems layoutId="nav-dot-top" />
          <Actions onMenu={() => setMenuOpen(true)} />
        </nav>
      </header>

      {/* S02: compact bar slides down once the first screen has scrolled away */}
      <AnimatePresence>
        {floating && (
          <motion.div
            className="fixed inset-x-0 top-0 z-50 flex justify-center px-3"
            initial={{ y: "-110%" }}
            animate={{ y: 0 }}
            exit={{ y: "-110%" }}
            transition={{ duration: DUR.base, ease: EASE }}
          >
            <nav
              aria-label="Main (compact)"
              className="flex w-full max-w-3xl items-center justify-between gap-6 rounded-b-2xl border border-t-0 border-line bg-surface/95 py-1 pl-5 pr-2 shadow-[0_12px_30px_-20px_rgb(53_39_27/0.4)]"
            >
              <Logo />
              <NavItems layoutId="nav-dot-float" />
              <Actions onMenu={() => setMenuOpen(true)} />
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
