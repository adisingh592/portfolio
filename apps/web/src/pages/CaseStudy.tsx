import { motion } from "motion/react";
import type { ReactNode } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, ArrowRight, PlayCircle } from "lucide-react";
import { siGithub } from "simple-icons";
import { ROUTES } from "@portfolio/shared";
import { cn } from "@portfolio/ui";
import { getNextProject, getProject, type Project } from "@/data/projects";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { scrollTo } from "@/lib/lenis";
import { DUR, EASE, stagger } from "@/lib/motion";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { LineReveal } from "@/components/motion/LineReveal";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowCircle } from "@/components/ui/ArrowCircle";
import { ButtonAnchor } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Chip";
import { TechIcon } from "@/components/ui/TechIcon";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import NotFound from "./NotFound";

type Section = { id: string; title: string; body: ReactNode };

function buildSections(p: Project): Section[] {
  const s: Section[] = [];
  if (p.overview) s.push({ id: "overview", title: "Overview", body: <Prose>{p.overview}</Prose> });
  if (p.problem) s.push({ id: "problem", title: "Problem", body: <Prose>{p.problem}</Prose> });
  if (p.solution) s.push({ id: "solution", title: "Solution", body: <Prose>{p.solution}</Prose> });
  if (p.architecture?.length) s.push({ id: "architecture", title: "Architecture", body: <Architecture steps={p.architecture} /> });
  if (p.process?.length) s.push({ id: "process", title: "Development", body: <Steps steps={p.process} /> });
  if (p.results?.length) s.push({ id: "results", title: "Results", body: <Results results={p.results} /> });
  else if (p.features?.length) s.push({ id: "results", title: "What it does", body: <Features features={p.features} /> });
  if (p.stack?.length) s.push({ id: "stack", title: "Tech stack", body: <Stack items={p.stack} /> });
  return s;
}

export default function CaseStudy() {
  const { slug = "" } = useParams();
  const project = getProject(slug);
  useDocumentTitle(project?.title ?? "Not found");
  if (!project) return <NotFound />;
  return <CaseStudyView project={project} />;
}

function CaseStudyView({ project: p }: { project: Project }) {
  const sections = buildSections(p);
  const active = useActiveSection(sections.map(s => s.id));
  const next = getNextProject(p.slug);
  const links = p.links ?? {};

  return (
    <article>
      <ScrollProgress />

      {/* 01 Introduction */}
      <header className="gutter pt-28 md:pt-36">
        <Reveal trigger="mount">
          <Link to={ROUTES.work} className="group inline-flex min-h-11 items-center gap-2 text-sm text-fg-2 transition-colors hover:text-fg">
            <ArrowLeft aria-hidden className="h-4 w-4 transition-transform duration-500 ease-house group-hover:-translate-x-1" />
            All projects
          </Link>
        </Reveal>
        <div className="mt-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <LineReveal
            as="h1"
            trigger="mount"
            lines={[p.title]}
            className="font-display text-[clamp(3rem,9vw,7.5rem)] font-medium leading-[0.92] tracking-[-0.035em]"
          />
          {p.year && (
            <Reveal trigger="mount" delay={0.2}>
              <p className="label pb-3 text-base">{p.year}</p>
            </Reveal>
          )}
        </div>
        <div className="mt-6 grid grid-cols-12 gap-x-4 gap-y-6">
          <Reveal trigger="mount" delay={0.3} className="col-span-12 lg:col-span-7">
            <p className="font-display text-[clamp(1.35rem,2.4vw,1.85rem)] leading-snug tracking-tight text-fg-2">{p.tagline}</p>
          </Reveal>
          <Reveal trigger="mount" delay={0.4} className="col-span-12 flex flex-wrap items-start gap-3 lg:col-span-5 lg:justify-end">
            {links.live && <ButtonAnchor href={links.live} external>Live demo</ButtonAnchor>}
            {links.repo && <ButtonAnchor href={links.repo} external variant="secondary" icon={<TechIcon icon={siGithub} className="h-4 w-4 !text-current" />}>GitHub</ButtonAnchor>}
            {links.video && <ButtonAnchor href={links.video} external variant="secondary" icon={<PlayCircle aria-hidden className="h-4 w-4" />}>Watch video</ButtonAnchor>}
            {!links.live && !links.repo && !links.video && (
              <div className="flex flex-wrap gap-1.5">
                {p.tags.map(t => <Tag key={t}>{t}</Tag>)}
              </div>
            )}
          </Reveal>
        </div>
      </header>

      {/* 02 Hero image */}
      <div className="gutter mt-12 md:mt-16">
        <ImageReveal
          src={p.cover.src}
          alt={p.cover.alt}
          width={p.cover.width}
          height={p.cover.height}
          trigger="mount"
          delay={0.35}
          parallax
          priority
          className="aspect-[4/3] rounded-[6px] md:aspect-[16/8]"
        />
      </div>

      {/* 03–09 Body with a sticky contents list */}
      <div className="gutter mt-20 grid grid-cols-12 gap-x-4 md:mt-28">
        <nav aria-label="On this page" className="col-span-3 hidden lg:block">
          <ol className="sticky top-28 space-y-1 border-l border-line">
            {sections.map(s => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={e => {
                    e.preventDefault();
                    scrollTo(`#${s.id}`, { offset: -110 });
                  }}
                  aria-current={active === s.id ? "true" : undefined}
                  className={cn(
                    "relative -ml-px flex min-h-9 items-center border-l pl-5 text-sm transition-colors",
                    active === s.id ? "border-accent text-fg" : "border-transparent text-fg-2 hover:text-fg",
                  )}
                >
                  {active === s.id && (
                    <motion.span layoutId="toc-dot" aria-hidden className="absolute -left-[3.5px] h-1.5 w-1.5 rounded-full bg-accent" transition={{ duration: DUR.fast, ease: EASE }} />
                  )}
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="col-span-12 space-y-20 md:space-y-28 lg:col-span-9">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-28">
              <Reveal>
                <p className="label"><span className="text-accent">[{String(i + 3).padStart(2, "0")}]</span> {s.title}</p>
              </Reveal>
              <LineReveal
                as="h2"
                lines={[s.title]}
                className="mt-4 font-display text-[clamp(2.2rem,4.5vw,3.5rem)] font-medium leading-none tracking-[-0.03em]"
              />
              <div className="mt-8">{s.body}</div>
            </section>
          ))}
        </div>
      </div>

      {/* 10 Gallery */}
      {p.gallery && p.gallery.length > 0 && (
        <section aria-label="Gallery" className="gutter mt-24 md:mt-32">
          <Reveal>
            <p className="label"><span className="text-accent">[{String(sections.length + 3).padStart(2, "0")}]</span> Gallery</p>
          </Reveal>
          <div className="mt-8 grid gap-6 md:grid-cols-12">
            {p.gallery.map((g, i) => (
              <ImageReveal
                key={g.src + i}
                src={g.src}
                alt={g.alt}
                width={g.width}
                height={g.height}
                parallax
                delay={stagger.card(i)}
                className={cn("rounded-[6px]", i % 3 === 0 ? "aspect-[16/10] md:col-span-7" : "aspect-[8/7] md:col-span-5")}
              />
            ))}
          </div>
        </section>
      )}

      {/* 11 Next project */}
      <section aria-label="Next project" className="gutter mt-24 border-t border-line pt-12 md:mt-32">
        <Link to={ROUTES.caseStudy(next.slug)} data-cursor="view" className="group grid grid-cols-12 items-center gap-6">
          <div className="col-span-12 md:col-span-8">
            <p className="label">Next project</p>
            <p className="mt-4 font-display text-[clamp(2.75rem,8vw,6.5rem)] font-medium leading-[0.92] tracking-[-0.035em] transition-transform duration-500 ease-house group-hover:translate-x-3">
              {next.title}
            </p>
            <p className="mt-3 text-fg-2">{next.summary}</p>
          </div>
          <div className="col-span-12 flex items-center justify-between gap-6 md:col-span-4 md:justify-end">
            <div className="w-40 overflow-hidden rounded-[6px] md:w-56">
              <img
                src={next.cover.src}
                alt=""
                width={next.cover.width}
                height={next.cover.height}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition-transform duration-[1.6s] ease-house group-hover:scale-[1.06]"
              />
            </div>
            <ArrowCircle size="lg" />
          </div>
        </Link>
      </section>
    </article>
  );
}

function Prose({ children }: { children: string }) {
  return (
    <Reveal>
      <p className="max-w-[62ch] text-lg leading-relaxed text-fg-2">{children}</p>
    </Reveal>
  );
}

function Architecture({ steps }: { steps: string[] }) {
  return (
    <ol className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
      {steps.map((step, i) => (
        <Reveal as="li" key={step} delay={stagger.row(i)} className="flex items-center gap-3">
          <span className="inline-flex min-h-12 items-center gap-3 rounded-full border border-line bg-surface px-5 text-sm">
            <span className="label text-accent">{String(i + 1).padStart(2, "0")}</span>
            {step}
          </span>
          {i < steps.length - 1 && <ArrowRight aria-hidden className="h-4 w-4 rotate-90 text-fg-2 md:rotate-0" />}
        </Reveal>
      ))}
    </ol>
  );
}

function Steps({ steps }: { steps: { title: string; body: string }[] }) {
  return (
    <ol className="border-t border-line">
      {steps.map((s, i) => (
        <Reveal as="li" key={s.title} delay={stagger.row(i)} className="grid grid-cols-12 gap-4 border-b border-line py-6">
          <span className="label col-span-2 pt-1.5 text-accent md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="col-span-10 font-display text-2xl font-medium tracking-tight md:col-span-4">{s.title}</h3>
          <p className="col-span-12 text-fg-2 md:col-span-7">{s.body}</p>
        </Reveal>
      ))}
    </ol>
  );
}

function Features({ features }: { features: { title: string; body: string }[] }) {
  return (
    <ul className="grid gap-px overflow-hidden rounded-[6px] border border-line bg-line sm:grid-cols-2">
      {features.map((f, i) => (
        <Reveal as="li" key={f.title} delay={stagger.card(i)} className="bg-bg p-6">
          <span aria-hidden className="block h-1.5 w-1.5 rounded-full bg-accent" />
          <h3 className="mt-5 font-display text-xl font-medium tracking-tight">{f.title}</h3>
          <p className="mt-1.5 text-sm text-fg-2">{f.body}</p>
        </Reveal>
      ))}
    </ul>
  );
}

function Results({ results }: { results: { value: string; label: string }[] }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-3">
      {results.map((r, i) => (
        <Reveal as="li" key={r.label} delay={stagger.card(i)} className="border-t border-line pt-5">
          <p className="font-display text-5xl font-medium tracking-tight">{r.value}</p>
          <p className="mt-2 text-sm text-fg-2">{r.label}</p>
        </Reveal>
      ))}
    </ul>
  );
}

function Stack({ items }: { items: string[] }) {
  return (
    <Reveal>
      <ul className="flex flex-wrap gap-2">
        {items.map(t => (
          <li key={t} className="rounded-full border border-line bg-surface px-4 py-2 text-sm">{t}</li>
        ))}
      </ul>
    </Reveal>
  );
}
