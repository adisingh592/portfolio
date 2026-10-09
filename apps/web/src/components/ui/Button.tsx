import { motion, useReducedMotion } from "motion/react";
import type { MouseEventHandler, ReactNode } from "react";
import { Link, type To } from "react-router";
import { ArrowRight } from "lucide-react";
import { cn } from "@portfolio/ui";

const MotionLink = motion.create(Link);

type Variant = "primary" | "secondary" | "ghost";

const styles: Record<Variant, string> = {
  primary: "bg-accent text-paper hover:bg-accent-hover",
  secondary: "border border-fg/25 text-fg hover:border-fg hover:bg-fg hover:text-paper",
  ghost: "text-fg hover:text-accent",
};

type Common = {
  children: ReactNode;
  variant?: Variant;
  /** Trailing icon; defaults to an arrow, `false` hides it. */
  icon?: ReactNode | false;
  className?: string;
  "aria-label"?: string;
};

const base =
  "group inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-medium transition-[gap,background-color,color,border-color] duration-150 hover:gap-3";

function Inner({ children, icon }: Pick<Common, "children" | "icon">) {
  return (
    <>
      <span>{children}</span>
      {icon !== false && (icon ?? <ArrowRight aria-hidden className="h-4 w-4" />)}
    </>
  );
}

const usePress = () => (useReducedMotion() ? undefined : { scale: 0.96 });

/** Internal navigation button. P01 press scale 0.96, H01 arrow nudge on hover. */
export function ButtonLink({ to, children, variant = "primary", icon, className, ...aria }: Common & { to: To }) {
  return (
    <MotionLink to={to} whileTap={usePress()} className={cn(base, styles[variant], className)} {...aria}>
      <Inner icon={icon}>{children}</Inner>
    </MotionLink>
  );
}

/** External link or file, styled like ButtonLink. */
export function ButtonAnchor({
  href, children, variant = "primary", icon, className, external, download, ...aria
}: Common & { href: string; external?: boolean; download?: boolean | string }) {
  return (
    <motion.a
      href={href}
      whileTap={usePress()}
      className={cn(base, styles[variant], className)}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      {...(download ? { download: download === true ? "" : download } : {})}
      {...aria}
    >
      <Inner icon={icon}>{children}</Inner>
    </motion.a>
  );
}

/** Real <button>, for forms and actions. */
export function Button({
  children, variant = "primary", icon, className, type = "button", disabled, onClick, ...aria
}: Common & { type?: "button" | "submit"; disabled?: boolean; onClick?: MouseEventHandler<HTMLButtonElement> }) {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileTap={disabled ? undefined : usePress()}
      className={cn(base, styles[variant], "disabled:cursor-not-allowed disabled:opacity-70", className)}
      {...aria}
    >
      <Inner icon={icon}>{children}</Inner>
    </motion.button>
  );
}
