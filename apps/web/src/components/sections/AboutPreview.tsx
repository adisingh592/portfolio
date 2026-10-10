import { ROUTES } from "@portfolio/shared";
import { education, experience, profile } from "@/data/profile";
import { LineReveal } from "@/components/motion/LineReveal";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";

/** Short introduction. No portrait here: it lives on the About page only. */
export function AboutPreview() {
  const edu = education[0];
  const current = experience.find(e => e.current);
  return (
    <section id="intro" className="gutter border-t border-line py-24 md:py-32">
      <div className="grid grid-cols-12 gap-x-4 gap-y-8">
        <Reveal className="col-span-12 md:col-span-3">
          <SectionLabel index="01">About</SectionLabel>
        </Reveal>
        <div className="col-span-12 md:col-span-9">
          <LineReveal
            lines={[<>I'm <em className="text-accent">{profile.shortName}.</em></>]}
            className="font-display text-[clamp(3rem,8vw,6.5rem)] font-semibold leading-[0.9] tracking-[-0.045em]"
          />
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-2xl font-display text-[clamp(1.4rem,2.6vw,2rem)] leading-snug tracking-tight text-fg">{profile.intro}</p>
          </Reveal>
          <Reveal delay={0.25}>
            <p className="mt-5 max-w-2xl text-lg text-fg-2">{profile.introDetail}</p>
          </Reveal>
          <Reveal delay={0.3}>
            <dl className="mt-10 grid max-w-2xl gap-6 border-t border-line pt-6 text-sm sm:grid-cols-2">
              <div>
                <dt className="label">Studying</dt>
                <dd className="mt-2">{edu.degree}, {edu.school} · {edu.start}–{edu.end}</dd>
              </div>
              {current && (
                <div>
                  <dt className="label">Currently</dt>
                  <dd className="mt-2">{current.role}, {current.org}</dd>
                </div>
              )}
            </dl>
          </Reveal>
          <Reveal delay={0.4} className="mt-10">
            <ButtonLink to={ROUTES.about} variant="secondary">More about me</ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
