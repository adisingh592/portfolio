import { AnimatePresence, motion } from "motion/react";
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { CircleAlert, CircleCheck, Info, X } from "lucide-react";
import { DUR, EASE } from "@/lib/motion";

type Tone = "success" | "error" | "info";
type ToastItem = { id: number; tone: Tone; title: string; body?: string };

const ToastContext = createContext<(t: Omit<ToastItem, "id">) => void>(() => {});

export const useToast = () => useContext(ToastContext);

const icons = { success: CircleCheck, error: CircleAlert, info: Info };

/** O02 toasts: slide up 10px and fade in over 0.4s, stack bottom-left, auto-dismiss after 6s. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => setItems(list => list.filter(t => t.id !== id)), []);
  const push = useCallback(
    (t: Omit<ToastItem, "id">) => {
      const id = nextId.current++;
      setItems(list => [...list, { ...t, id }]);
      window.setTimeout(() => dismiss(id), 6000);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed bottom-4 left-4 right-4 z-[90] flex flex-col items-start gap-2 sm:right-auto sm:w-[380px]">
        <AnimatePresence initial={false}>
          {items.map(t => {
            const Icon = icons[t.tone];
            return (
              <motion.div
                key={t.id}
                layout
                role={t.tone === "error" ? "alert" : "status"}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: DUR.exit } }}
                transition={{ duration: DUR.quick, ease: EASE }}
                className="pointer-events-auto flex w-full items-start gap-3 rounded-xl border border-line bg-surface p-4 shadow-[0_12px_40px_-16px_rgb(53_39_27/0.35)]"
              >
                <Icon aria-hidden className={`mt-0.5 h-5 w-5 shrink-0 ${t.tone === "success" ? "text-olive" : "text-accent"}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{t.title}</p>
                  {t.body && <p className="mt-1 text-sm text-fg-2">{t.body}</p>}
                </div>
                <button type="button" onClick={() => dismiss(t.id)} aria-label="Dismiss notification" className="rounded-full p-1 text-fg-2 hover:text-fg">
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
