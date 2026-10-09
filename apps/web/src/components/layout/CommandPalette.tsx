import { AnimatePresence, motion } from "motion/react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, CornerDownLeft, FileText, FolderOpen, Search } from "lucide-react";
import { ROUTES } from "@portfolio/shared";
import { projects } from "@/data/projects";
import { DUR, EASE } from "@/lib/motion";
import { lockScroll } from "@/lib/lenis";

type PaletteApi = { open: () => void; close: () => void; isOpen: boolean };
const PaletteContext = createContext<PaletteApi>({ open: () => {}, close: () => {}, isOpen: false });
export const useCommandPalette = () => useContext(PaletteContext);

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
export const shortcutLabel = isMac ? "⌘K" : "Ctrl K";

type Item = { id: string; label: string; hint: string; to: string; group: "Pages" | "Projects" };

const items: Item[] = [
  { id: "home", label: "Home", hint: "Start here", to: ROUTES.home, group: "Pages" },
  { id: "work", label: "Work", hint: "All projects", to: ROUTES.work, group: "Pages" },
  { id: "about", label: "About", hint: "Story, experience, skills", to: ROUTES.about, group: "Pages" },
  { id: "lab", label: "Lab", hint: "Experiments", to: ROUTES.lab, group: "Pages" },
  { id: "contact", label: "Contact", hint: "Get in touch", to: ROUTES.contact, group: "Pages" },
  { id: "resume", label: "Resume", hint: "Education and experience", to: ROUTES.resume, group: "Pages" },
  ...projects.map(p => ({ id: p.slug, label: p.title, hint: p.summary, to: ROUTES.caseStudy(p.slug), group: "Projects" as const })),
];

/** O01: Ctrl/⌘ + K opens a searchable list of every page and project. */
export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(v => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const api = useMemo(() => ({ open, close, isOpen }), [open, close, isOpen]);
  return (
    <PaletteContext.Provider value={api}>
      {children}
      <AnimatePresence>{isOpen && <Palette onClose={close} />}</AnimatePresence>
    </PaletteContext.Provider>
  );
}

function Palette({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const returnFocus = useRef<Element | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(i => `${i.label} ${i.hint}`.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    returnFocus.current = document.activeElement;
    inputRef.current?.focus();
    lockScroll(true);
    return () => {
      lockScroll(false);
      (returnFocus.current as HTMLElement | null)?.focus?.();
    };
  }, []);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const go = (item: Item | undefined) => {
    if (!item) return;
    onClose();
    navigate(item.to);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive(i => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(i => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[active]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "Tab") {
      // Keep focus inside the dialog: the input is the only tab stop.
      e.preventDefault();
    }
  };

  let lastGroup = "";
  return (
    <motion.div
      className="fixed inset-0 z-[85] flex items-start justify-center bg-fg/40 px-4 pt-[14vh] backdrop-blur-[2px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: DUR.exit } }}
      transition={{ duration: DUR.instant }}
      onMouseDown={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Search pages and projects"
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_30px_80px_-24px_rgb(33_26_21/0.45)]"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 10, opacity: 0 }}
        transition={{ duration: DUR.fast, ease: EASE }}
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search aria-hidden className="h-4 w-4 text-fg-2" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search pages and projects…"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={results[active] ? `palette-${results[active].id}` : undefined}
            aria-autocomplete="list"
            className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-fg-2/70"
          />
          <kbd className="label rounded-md border border-line px-1.5 py-1">Esc</kbd>
        </div>
        <ul ref={listRef} id="palette-list" role="listbox" aria-label="Results" className="max-h-[50vh] overflow-y-auto p-2" data-lenis-prevent>
          {results.length === 0 && <li className="px-3 py-8 text-center text-sm text-fg-2">Nothing matches “{query}”.</li>}
          {results.map((item, i) => {
            const header = item.group !== lastGroup ? item.group : null;
            lastGroup = item.group;
            const Icon = item.group === "Pages" ? FileText : FolderOpen;
            return (
              <li key={item.id} role="presentation">
                {header && <p className="label px-3 pb-1.5 pt-3">{header}</p>}
                <div
                  id={`palette-${item.id}`}
                  role="option"
                  aria-selected={i === active}
                  data-index={i}
                  onMouseMove={() => setActive(i)}
                  onClick={() => go(item)}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${i === active ? "bg-surface-alt" : ""}`}
                >
                  <Icon aria-hidden className={`h-4 w-4 ${i === active ? "text-accent" : "text-fg-2"}`} />
                  <span className="font-medium">{item.label}</span>
                  <span className="truncate text-fg-2">{item.hint}</span>
                  {i === active ? <CornerDownLeft aria-hidden className="ml-auto h-4 w-4 text-fg-2" /> : <ArrowRight aria-hidden className="ml-auto h-4 w-4 text-transparent" />}
                </div>
              </li>
            );
          })}
        </ul>
      </motion.div>
    </motion.div>
  );
}
