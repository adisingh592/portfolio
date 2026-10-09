import { ArrowRight } from "lucide-react";
import { cn } from "@portfolio/ui";

/** H05: round arrow that turns −45° and fills when its parent `.group` is hovered. */
export function ArrowCircle({ size = "md", className }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const dims = { sm: "h-8 w-8", md: "h-10 w-10", lg: "h-14 w-14" }[size];
  const icon = { sm: "h-3.5 w-3.5", md: "h-4 w-4", lg: "h-5 w-5" }[size];
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border border-fg/25 text-fg transition-all duration-500 ease-house",
        "group-hover:-rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-paper",
        "group-focus-visible:-rotate-45 group-focus-visible:border-accent group-focus-visible:bg-accent group-focus-visible:text-paper",
        dims,
        className,
      )}
    >
      <ArrowRight className={icon} />
    </span>
  );
}
