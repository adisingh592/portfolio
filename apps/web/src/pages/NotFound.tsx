import { ROUTES } from "@portfolio/shared";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { LineReveal } from "@/components/motion/LineReveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";

export default function NotFound() {
  useDocumentTitle("Page not found");
  return (
    <section className="gutter flex min-h-[80svh] flex-col justify-center pb-12 pt-32">
      <Reveal trigger="mount">
        <SectionLabel index="404">Not found</SectionLabel>
      </Reveal>
      <LineReveal
        as="h1"
        trigger="mount"
        lines={["This page", <em key="w" className="text-accent">wandered off.</em>]}
        className="mt-6 font-display text-[clamp(3.25rem,9vw,7.5rem)] font-semibold leading-[0.9] tracking-[-0.045em]"
      />
      <Reveal trigger="mount" delay={0.35}>
        <p className="mt-6 max-w-md text-lg text-fg-2">The link may be old or mistyped. Here are some ways back.</p>
      </Reveal>
      <Reveal trigger="mount" delay={0.5} className="mt-10 flex flex-wrap items-center gap-4">
        <MagneticButton>
          <ButtonLink to={ROUTES.home}>Back home</ButtonLink>
        </MagneticButton>
        <ButtonLink to={ROUTES.work} variant="secondary">See my work</ButtonLink>
      </Reveal>
    </section>
  );
}
