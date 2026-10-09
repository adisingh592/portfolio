import { useReducedMotion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { ROUTES } from "@portfolio/shared";
import { profile } from "@/data/profile";
import { useIsDesktop } from "@/hooks/useMediaQuery";
import { scrollTo } from "@/lib/lenis";
import { LineReveal } from "@/components/motion/LineReveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";

const SCENE = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

/**
 * Home hero built on the Spline + Spotlight card: text on the left, interactive 3D on the right.
 * The 3D scene (~1.3 MB) loads only on laptop-size screens without reduced motion; phones get a
 * quiet glow instead so they stay fast.
 */
export function Hero() {
  const [l1, l2, l3] = profile.heroLines;
  const desktop = useIsDesktop();
  const reduce = useReducedMotion();
  const show3d = desktop && !reduce;

  return (
    <section className="gutter pb-10 pt-24 md:pt-28">
      <Card className="relative min-h-[calc(100svh-8rem)] overflow-hidden rounded-2xl border-line bg-black/[0.96]">
        <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" size={320} />

        <div className="flex h-full min-h-[calc(100svh-8rem)] flex-col lg:flex-row">
          {/* Left content */}
          <div className="relative z-10 flex flex-1 flex-col justify-center p-6 sm:p-10 lg:p-14">
            <Reveal trigger="mount">
              <p className="flex items-center gap-2.5 text-sm text-neutral-400">
                <span className="relative inline-flex h-2 w-2">
                  <span className="ping-soft absolute inset-0 rounded-full bg-neutral-200" />
                  <span className="relative h-2 w-2 rounded-full bg-neutral-200" />
                </span>
                {profile.roles}
              </p>
            </Reveal>

            <LineReveal
              as="h1"
              trigger="mount"
              delay={0.05}
              className="mt-6 font-display text-[clamp(3.25rem,8vw,7.25rem)] font-bold leading-[0.9] tracking-[-0.05em]"
              lines={[l1, l2, <em key="impact" className="text-accent">{l3}</em>]}
            />

            <Reveal trigger="mount" delay={0.5}>
              <p className="mt-7 max-w-md text-lg leading-relaxed text-neutral-300">{profile.heroSummary}</p>
            </Reveal>

            <Reveal trigger="mount" delay={0.7} className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <MagneticButton>
                <ButtonLink to={ROUTES.work}>Explore my work</ButtonLink>
              </MagneticButton>
              <button
                type="button"
                onClick={() => scrollTo("#intro", { offset: -24 })}
                className="group inline-flex min-h-11 items-center gap-3 text-sm text-neutral-400 transition-colors hover:text-neutral-50"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 transition-colors group-hover:border-white/60">
                  <ArrowDown aria-hidden className="h-4 w-4 transition-transform duration-500 ease-house group-hover:translate-y-0.5" />
                </span>
                Scroll to explore
              </button>
            </Reveal>
          </div>

          {/* Right content */}
          <div className="relative hidden flex-1 lg:block">
            {show3d ? (
              <Reveal trigger="mount" delay={0.3} className="absolute inset-0">
                <SplineScene scene={SCENE} className="h-full w-full" />
              </Reveal>
            ) : (
              <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_60%_at_60%_40%,rgb(255_255_255/0.08),transparent_70%)]" />
            )}
          </div>
        </div>
      </Card>
    </section>
  );
}
