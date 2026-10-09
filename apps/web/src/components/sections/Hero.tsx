import { ArrowDown } from "lucide-react";
import { ROUTES } from "@portfolio/shared";
import { profile } from "@/data/profile";
import { scrollTo } from "@/lib/lenis";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { LineReveal } from "@/components/motion/LineReveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";

/** Home hero: E01–E03 entrance, N02 masked headline, N06/N07 image reveal and parallax, N08 magnetic CTA. */
export function Hero() {
  const [l1, l2, l3] = profile.heroLines;
  return (
    <section className="relative overflow-hidden pt-24 lg:min-h-[100svh] lg:pt-0">
      <div className="gutter grid grid-cols-12 gap-x-4 lg:min-h-[100svh] lg:items-center">
        <div className="col-span-12 py-10 lg:col-span-6 lg:py-32">
          <Reveal trigger="mount">
            <p className="flex items-center gap-2.5 text-sm text-fg-2">
              <span className="relative inline-flex h-2 w-2">
                <span className="ping-soft absolute inset-0 rounded-full bg-accent" />
                <span className="relative h-2 w-2 rounded-full bg-accent" />
              </span>
              {profile.roles}
            </p>
          </Reveal>

          <LineReveal
            as="h1"
            trigger="mount"
            delay={0.05}
            className="mt-6 font-display text-[clamp(3.5rem,10.5vw,8.75rem)] font-medium leading-[0.88] tracking-[-0.035em]"
            lines={[l1, l2, <em key="impact" className="font-normal text-accent">{l3}</em>]}
          />

          <Reveal trigger="mount" delay={0.5}>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-fg-2">{profile.heroSummary}</p>
          </Reveal>

          <Reveal trigger="mount" delay={0.7} className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <MagneticButton>
              <ButtonLink to={ROUTES.work}>Explore my work</ButtonLink>
            </MagneticButton>
            <button
              type="button"
              onClick={() => scrollTo("#overview", { offset: -24 })}
              className="group inline-flex min-h-11 items-center gap-3 text-sm text-fg-2 transition-colors hover:text-fg"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-fg/25 transition-colors group-hover:border-fg">
                <ArrowDown aria-hidden className="h-4 w-4 transition-transform duration-500 ease-house group-hover:translate-y-0.5" />
              </span>
              Scroll to explore
            </button>
          </Reveal>
        </div>
      </div>

      {/* Architecture image: bleeds off the right edge on desktop, sits below the text on phones */}
      <div className="gutter pb-6 lg:absolute lg:inset-y-0 lg:right-0 lg:w-[46%] lg:p-0">
        <ImageReveal
          src="/images/hero-architecture.webp"
          alt="Modern stone villa with cantilevered slabs in warm evening light"
          width={668}
          height={816}
          trigger="mount"
          delay={0.2}
          parallax
          priority
          className="aspect-[4/3] rounded-[6px] sm:aspect-[16/10] lg:aspect-auto lg:h-full lg:rounded-none lg:rounded-bl-[48px]"
        />
      </div>
    </section>
  );
}
