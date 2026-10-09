import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowUp } from "lucide-react";
import { ROUTES } from "@portfolio/shared";
import { navLinks, profile, socials } from "@/data/profile";
import { scrollTo } from "@/lib/lenis";

function useIndiaTime() {
  const fmt = () =>
    new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" }).format(new Date());
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const id = window.setInterval(() => setTime(fmt()), 30_000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

/** Quiet landscape ridge echoing the design board's horizon motif. */
function Horizon() {
  return (
    <svg aria-hidden viewBox="0 0 1440 160" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-0 h-28 w-full md:h-36">
      <path d="M0 110 L140 70 L260 98 L420 40 L560 92 L700 58 L860 104 L1010 50 L1180 96 L1320 66 L1440 92 V160 H0Z" fill="#111111" />
      <path d="M0 132 L180 104 L340 128 L520 92 L700 126 L880 100 L1060 130 L1240 106 L1440 124 V160 H0Z" fill="#161616" />
    </svg>
  );
}

export function Footer() {
  const time = useIndiaTime();
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-line bg-surface pb-40 pt-14 md:pb-48">
      <div className="gutter grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-12">
        <div className="col-span-2 md:col-span-5">
          <Link to={ROUTES.home} className="inline-flex items-center gap-2 font-display text-2xl font-semibold">
            <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-accent" />
            {profile.name}
          </Link>
          <p className="mt-3 max-w-sm text-sm text-fg-2">{profile.roles}</p>
          <a href={`mailto:${profile.email}`} className="mt-6 inline-block border-b border-fg/30 pb-0.5 text-sm transition-colors hover:border-fg">
            {profile.email}
          </a>
        </div>

        <nav aria-label="Footer" className="md:col-span-2">
          <p className="label mb-4">Navigate</p>
          <ul className="space-y-2 text-sm">
            {[...navLinks, { to: ROUTES.resume, label: "Resume" }].map(l => (
              <li key={l.to}>
                <Link to={l.to} className="text-fg-2 transition-colors hover:text-fg">{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-2">
          <p className="label mb-4">Elsewhere</p>
          <ul className="space-y-2 text-sm">
            {socials.github && <li><a href={socials.github} target="_blank" rel="noreferrer" className="text-fg-2 transition-colors hover:text-fg">GitHub ↗</a></li>}
            {socials.linkedin && <li><a href={socials.linkedin} target="_blank" rel="noreferrer" className="text-fg-2 transition-colors hover:text-fg">LinkedIn ↗</a></li>}
            <li><a href={`mailto:${profile.email}`} className="text-fg-2 transition-colors hover:text-fg">Email</a></li>
          </ul>
        </div>

        <div className="col-span-2 flex flex-col items-start gap-4 md:col-span-3 md:items-end">
          <p className="label">India · {time} IST</p>
          <button
            type="button"
            onClick={() => scrollTo(0)}
            className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-sm transition-colors hover:border-fg/40"
          >
            Back to top
            <ArrowUp aria-hidden className="h-4 w-4 transition-transform duration-500 ease-house group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
      <p className="gutter relative z-10 mt-14 text-xs text-fg-2">© {new Date().getFullYear()} {profile.name}. Designed and built by hand.</p>
      <Horizon />
    </footer>
  );
}
