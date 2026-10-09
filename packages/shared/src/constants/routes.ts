export const ROUTES = {
  home: "/",
  work: "/work",
  caseStudy: (slug: string) => `/work/${slug}`,
  about: "/about",
  lab: "/lab",
  contact: "/contact",
} as const;

export const API = {
  health: "/api/health",
  projects: "/api/projects",
  contact: "/api/contact",
} as const;
