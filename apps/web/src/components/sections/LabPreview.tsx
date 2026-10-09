import { Link } from "react-router";
import { ROUTES } from "@portfolio/shared";
import { featuredLab } from "@/data/lab";
import { stagger } from "@/lib/motion";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowCircle } from "@/components/ui/ArrowCircle";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionLabel";

export function LabPreview() {
  return (
    <section className="gutter py-24 md:py-32">
      <SectionHeader
        index="03"
        label="From the lab"
        title="Experimental playground"
        sub="Small experiments, research and random ideas I'm working on."
        action={
          <ButtonLink to={ROUTES.lab} variant="ghost" className="px-0!">
            Explore lab
          </ButtonLink>
        }
      />
      <ul className="grid gap-10 md:grid-cols-3 md:gap-6">
        {featuredLab.map((item, i) => (
          <Reveal as="li" key={item.slug} delay={stagger.card(i)}>
            <Link to={ROUTES.lab} className="group block" aria-label={`${item.title}: ${item.body} Open the lab`}>
              <div className="overflow-hidden rounded-[6px] bg-surface-alt">
                <img
                  src={item.image.src}
                  alt={item.image.alt}
                  width={item.image.width}
                  height={item.image.height}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-[1.6s] ease-house group-hover:scale-[1.04]"
                />
              </div>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl font-medium tracking-tight transition-transform duration-500 ease-house group-hover:translate-x-1.5">{item.title}</h3>
                  <p className="mt-1 text-sm text-fg-2">{item.body}</p>
                </div>
                <ArrowCircle size="sm" />
              </div>
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
