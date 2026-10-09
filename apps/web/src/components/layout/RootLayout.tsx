import { NavLink, Outlet } from "react-router";
import { ROUTES } from "@portfolio/shared";
import { cn } from "@portfolio/ui";
import { profile } from "@/data/profile";

const links = [
  { to: ROUTES.work, label: "Work" },
  { to: ROUTES.about, label: "About" },
  { to: ROUTES.lab, label: "Lab" },
  { to: ROUTES.contact, label: "Contact" },
];

export function RootLayout() {
  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between px-4 py-5 sm:px-6 md:px-10">
        <NavLink to={ROUTES.home} className="font-display text-lg font-semibold">
          {profile.name}
        </NavLink>
        <nav className="flex gap-6 text-sm">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn("transition-colors hover:text-fg", isActive ? "text-accent" : "text-fg/70")
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
