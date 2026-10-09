import { Link } from "react-router";
import { ROUTES } from "@portfolio/shared";
import { featuredProjects, projects } from "@/data/projects";
import { stagger } from "@/lib/motion";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowCircle } from "@/components/ui/ArrowCircle";
import { ButtonLink } from "@/components/ui/Button";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { SectionHeader } from "@/components/ui/SectionLabel";
import { ProjectRail } from "./ProjectRail";

/** Final rail card: a large link to the full index. */
function AllWorkCard() {
  return (
    <Link
      to={ROUTES.work}
      className="group flex aspect-[4/3] flex-col justify-between rounded-[6px] border border-line bg-surface p-8 transition-colors duration-500 hover:bg-surface-alt"
    >
      <p className="label">{projects.length} projects</p>
      <div className="flex items-end justify-between gap-4">
        <p className="font-display-tight text-[clamp(2rem,3.4vw,3rem)]">
          See all <em className="text-accent">work</em>
        </p>
        <ArrowCircle size="lg" />
      </div>
    </Link>
  );
}

export function SelectedWork() {
  const header = (
    <SectionHeader
      index="01"
      label="Selected work"
      title="Selected work"
      sub="A few projects across computer vision, edge AI and the web."
      action={
        <ButtonLink to={ROUTES.work} variant="ghost" className="px-0!">
          View all work
        </ButtonLink>
      }
    />
  );
  const cards = featuredProjects.map((p, i) => (
    <Reveal key={p.slug} delay={stagger.card(i)}>
      <ProjectCard project={p} size="lg" />
    </Reveal>
  ));
  return <ProjectRail header={header} items={[...cards, <AllWorkCard key="all" />]} />;
}
