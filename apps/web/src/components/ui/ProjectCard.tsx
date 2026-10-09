import { Link } from "react-router";
import { ROUTES } from "@portfolio/shared";
import { cn } from "@portfolio/ui";
import type { Project } from "@/data/projects";
import { ArrowCircle } from "./ArrowCircle";
import { Tag } from "./Chip";

type Props = {
  project: Project;
  /** CSS aspect-ratio for the image, e.g. "4 / 3". */
  aspect?: string;
  size?: "md" | "lg";
  priority?: boolean;
  className?: string;
};

/**
 * Project card with the reference hover set: line draw (H03), title nudge (H04),
 * arrow flip (H05), slow image zoom (H06). The custom cursor shows "View" over it (N09).
 */
export function ProjectCard({ project, aspect = "4 / 3", size = "md", priority = false, className }: Props) {
  return (
    <Link
      to={ROUTES.caseStudy(project.slug)}
      data-cursor="view"
      className={cn("group relative block outline-none", className)}
      aria-label={`${project.title}: ${project.summary}`}
    >
      <div className="relative overflow-hidden rounded-[6px] bg-surface-alt" style={{ aspectRatio: aspect }}>
        <img
          src={project.cover.src}
          alt={project.cover.alt}
          width={project.cover.width}
          height={project.cover.height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="h-full w-full object-cover grayscale-[0.85] transition-[transform,filter] group-hover:grayscale-0 duration-[1.6s] ease-house group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
        />
        <span className="pointer-events-none absolute inset-0 rounded-[6px] ring-accent ring-offset-2 ring-offset-bg group-focus-visible:ring-2" />
      </div>
      <div className="relative mt-4 border-t border-line pt-4">
        <span className="pointer-events-none absolute inset-x-0 -top-px h-px origin-left scale-x-0 bg-fg transition-transform duration-700 ease-house group-hover:scale-x-100" />
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-baseline gap-3">
              <h3
                className={cn(
                  "font-display-tight transition-transform duration-500 ease-house group-hover:translate-x-2",
                  size === "lg" ? "text-[clamp(1.6rem,2.6vw,2.25rem)]" : "text-[1.6rem]",
                )}
              >
                {project.title}
              </h3>
              {project.year && <span className="label">{project.year}</span>}
            </div>
            <p className="mt-1.5 max-w-md text-sm leading-relaxed text-fg-2">{project.summary}</p>
          </div>
          <ArrowCircle />
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.map(t => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      </div>
    </Link>
  );
}
