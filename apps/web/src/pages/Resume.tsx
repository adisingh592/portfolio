import type { ReactNode } from "react";
import { Download } from "lucide-react";
import { siGithub } from "simple-icons";
import { ROUTES } from "@portfolio/shared";
import { profile, socials } from "@/data/profile";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { LineReveal } from "@/components/motion/LineReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Achievements, EducationList, ExperienceTimeline, SkillsGrid } from "@/components/sections/ProfileBlocks";
import { ButtonAnchor, ButtonLink } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TechIcon } from "@/components/ui/TechIcon";

function Part({ index, title, children }: { index: string; title: string; children: ReactNode }) {
  return (
    <section className="grid grid-cols-12 gap-x-4 gap-y-6 border-t border-line py-14 md:py-20">
      <Reveal className="col-span-12 md:col-span-4">
        <SectionLabel index={index}>{title}</SectionLabel>
      </Reveal>
      <div className="col-span-12 md:col-span-8">{children}</div>
    </section>
  );
}

/** Resume landing page. Shows a PDF preview and download only when a real PDF is configured. */
export default function Resume() {
  useDocumentTitle("Resume");
  const pdf = profile.resumePdf;

  return (
    <div className="gutter pb-12 pt-32 md:pt-40">
      <header className="grid grid-cols-12 gap-x-4 gap-y-8 pb-14 md:pb-20">
        <div className="col-span-12 lg:col-span-7">
          <Reveal trigger="mount">
            <SectionLabel index="01">Resume</SectionLabel>
          </Reveal>
          <LineReveal
            as="h1"
            trigger="mount"
            lines={["My", <em key="r" className="text-accent">resume.</em>]}
            className="mt-6 font-display text-[clamp(3.5rem,10vw,8rem)] font-medium leading-[0.88] tracking-[-0.035em]"
          />
          <Reveal trigger="mount" delay={0.35}>
            <p className="mt-8 max-w-md text-lg text-fg-2">A quick overview of my education, experience, skills and achievements.</p>
          </Reveal>
          <Reveal trigger="mount" delay={0.5} className="mt-8 flex flex-wrap gap-3">
            {pdf ? (
              <ButtonAnchor href={pdf} download icon={<Download aria-hidden className="h-4 w-4" />}>Download PDF</ButtonAnchor>
            ) : (
              <ButtonLink to={ROUTES.contact}>Ask for my full resume</ButtonLink>
            )}
            {socials.github && (
              <ButtonAnchor href={socials.github} external variant="secondary" icon={<TechIcon icon={siGithub} className="h-4 w-4 !text-current" />}>
                View on GitHub
              </ButtonAnchor>
            )}
          </Reveal>
        </div>

        {pdf && (
          <Reveal trigger="mount" delay={0.4} className="col-span-12 lg:col-span-5">
            <iframe src={`${pdf}#view=FitH`} title={`${profile.name} resume (PDF)`} className="aspect-[1/1.3] w-full rounded-[6px] border border-line bg-paper" loading="lazy" />
          </Reveal>
        )}
      </header>

      <Part index="02" title="Education">
        <EducationList />
      </Part>
      <Part index="03" title="Experience">
        <ExperienceTimeline />
      </Part>
      <Part index="04" title="Skills">
        <SkillsGrid />
      </Part>
      <Part index="05" title="Achievements">
        <Achievements />
      </Part>
    </div>
  );
}
