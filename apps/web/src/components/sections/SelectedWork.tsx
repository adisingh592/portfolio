import { ROUTES } from "@portfolio/shared";
import { featuredProjects } from "@/data/projects";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionLabel";
import { VoyageSlider } from "@/components/ui/VoyageSlider";

export function SelectedWork() {
  return (
    <section className="pt-24 md:pt-32">
      <div className="gutter">
        <SectionHeader
          index="03"
          label="Selected work"
          title="Selected work"
          sub="A few projects across computer vision, edge AI and the web."
          action={
            <ButtonLink to={ROUTES.work} variant="ghost" className="px-0!">
              View all work
            </ButtonLink>
          }
        />
      </div>
      <Reveal>
        <VoyageSlider projects={featuredProjects} />
      </Reveal>
    </section>
  );
}
