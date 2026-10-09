import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { ROUTES } from "@portfolio/shared";
import { profile } from "@/data/profile";
import { LineReveal } from "@/components/motion/LineReveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Reveal } from "@/components/motion/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

/** Closing call to action: big type, email, and a magnetic round button to /contact. */
export function ContactPreview() {
  return (
    <section className="gutter border-t border-line pt-24 md:pt-32">
      <Reveal>
        <SectionLabel index="07">Contact</SectionLabel>
      </Reveal>
      <div className="mt-8 grid grid-cols-12 items-end gap-x-4 gap-y-10">
        <LineReveal
          lines={["Let's build", <em key="t" className="text-accent">something together.</em>]}
          className="col-span-12 font-display text-[clamp(3rem,9vw,8rem)] font-semibold leading-[0.9] tracking-[-0.045em] lg:col-span-9"
        />
        <div className="col-span-12 flex items-end justify-between gap-6 lg:col-span-3 lg:flex-col lg:items-start">
          <Reveal delay={0.2}>
            <p className="max-w-xs text-sm text-fg-2">I'm open to collaborations, freelance work, internships and interesting opportunities.</p>
            <a href={`mailto:${profile.email}`} className="mt-4 inline-block break-all border-b border-fg/30 pb-0.5 transition-colors hover:border-fg">
              {profile.email}
            </a>
          </Reveal>
          <Reveal delay={0.3}>
            <MagneticButton>
              <Link
                to={ROUTES.contact}
                aria-label="Go to the contact page"
                className="group inline-flex h-24 w-24 items-center justify-center rounded-full bg-accent text-paper transition-colors hover:bg-accent-hover md:h-28 md:w-28"
              >
                <ArrowUpRight aria-hidden className="h-7 w-7 transition-transform duration-500 ease-house group-hover:rotate-45" />
              </Link>
            </MagneticButton>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
