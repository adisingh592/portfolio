import type { ReactNode } from "react";
import { ROUTES } from "@portfolio/shared";
import { profile } from "@/data/profile";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { stagger } from "@/lib/motion";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { LineReveal } from "@/components/motion/LineReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Achievements, EducationList, ExperienceTimeline, SkillsGrid } from "@/components/sections/ProfileBlocks";
import { ButtonLink } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";

function Block({ index, label, title, children }: { index: string; label: string; title: ReactNode; children: ReactNode }) {
  return (
    <section className="gutter grid grid-cols-12 gap-x-4 gap-y-8 border-t border-line py-20 md:py-28">
      <div className="col-span-12 lg:col-span-4">
        <Reveal>
          <SectionLabel index={index}>{label}</SectionLabel>
        </Reveal>
        <LineReveal as="h2" lines={[title]} className="mt-4 font-display text-[clamp(2.2rem,4.5vw,3.5rem)] font-semibold leading-none tracking-[-0.04em]" />
      </div>
      <div className="col-span-12 lg:col-span-8">{children}</div>
    </section>
  );
}

/** The only page with the portrait. Until a photo is added, a monogram panel stands in. */
export default function About() {
  useDocumentTitle("About");
  const portrait = profile.portrait || "/images/portrait-placeholder.svg";
  const nameParts = profile.name.toUpperCase().split(" ");

  return (
    <>
      {/* 01 About */}
      <section className="gutter grid grid-cols-12 items-end gap-x-4 gap-y-12 pb-20 pt-28 md:pb-28 md:pt-36">
        <div className="col-span-12 lg:col-span-6 lg:pb-8">
          <Reveal trigger="mount">
            <SectionLabel index="01">About</SectionLabel>
          </Reveal>
          <LineReveal
            as="h1"
            trigger="mount"
            lines={["I'm", <em key="n" className="text-accent">{profile.shortName}.</em>]}
            className="mt-6 font-display text-[clamp(4rem,11vw,9rem)] font-semibold leading-[0.88] tracking-[-0.04em]"
          />
          <Reveal trigger="mount" delay={0.4}>
            <p className="mt-8 max-w-md font-display text-[clamp(1.4rem,2.4vw,1.9rem)] leading-snug tracking-tight">{profile.aboutLead}</p>
            <p className="mt-4 max-w-md text-fg-2">{profile.aboutBody}</p>
          </Reveal>
          <Reveal trigger="mount" delay={0.55} className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to={ROUTES.work}>See my work</ButtonLink>
            <ButtonLink to={ROUTES.resume} variant="secondary">Resume</ButtonLink>
          </Reveal>
        </div>

        <div className="relative col-span-12 sm:col-span-10 sm:col-start-2 lg:col-span-5 lg:col-start-8">
          <ImageReveal
            src={portrait}
            alt={profile.portrait ? `Portrait of ${profile.name}` : `${profile.name} monogram`}
            width={900}
            height={1100}
            trigger="mount"
            delay={0.25}
            parallax
            priority
            className="aspect-[9/11] rounded-[6px]"
          />
          {/* Name set vertically along the portrait's edge: readable, never over the face */}
          <Reveal trigger="mount" delay={0.7} className="absolute -left-2 bottom-0 top-0 hidden -translate-x-full items-end md:flex">
            <p className="label whitespace-nowrap text-[0.8rem] tracking-[0.3em] [writing-mode:vertical-rl] rotate-180">
              {nameParts.map((part, i) => (
                <span key={part} className={i === 1 ? "text-accent" : ""}>{part}{i < nameParts.length - 1 ? " " : ""}</span>
              ))}
            </p>
          </Reveal>
          <Reveal trigger="mount" delay={0.7} className="mt-4 md:hidden">
            <p className="label tracking-[0.2em]">{profile.name.toUpperCase()}</p>
          </Reveal>
        </div>
      </section>

      {/* 02 My story */}
      <Block index="02" label="My story" title="My story">
        <div className="max-w-[62ch] space-y-6">
          {profile.story.map((para, i) => (
            <Reveal key={i} delay={stagger.row(i)}>
              <p className={i === 0 ? "font-display text-[clamp(1.3rem,2.2vw,1.7rem)] leading-snug tracking-tight" : "text-lg leading-relaxed text-fg-2"}>{para}</p>
            </Reveal>
          ))}
        </div>
      </Block>

      {/* 03 Education and experience */}
      <Block index="03" label="Education & experience" title={<>Education <em className="text-accent">&</em> experience</>}>
        <div className="space-y-14">
          <EducationList />
          <ExperienceTimeline />
        </div>
      </Block>

      {/* 04 Skills and tools */}
      <Block index="04" label="Skills & tools" title="Skills & tools">
        <SkillsGrid />
      </Block>

      {/* 05 Achievements */}
      <Block index="05" label="Achievements" title="Achievements">
        <Achievements />
      </Block>
    </>
  );
}
