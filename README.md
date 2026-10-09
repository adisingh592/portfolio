# Online Portfolio

A personal portfolio with a React frontend, an Express API and a shared UI package, set up as one npm workspace repo.

The plan, effect catalogue and build phases are in [docs/](docs/).

## Structure

```
onlineportfolio/
├── apps/
│   ├── web/                    Frontend: Vite + React + Tailwind v4 + Motion + Lenis
│   │   ├── public/images/      Placeholder artwork (hero, projects, lab, portrait). Replace with real images.
│   │   └── src/
│   │       ├── app/            App root and router (8 routes)
│   │       ├── pages/          Home, Work, CaseStudy, About, Lab, Contact, Resume, NotFound
│   │       ├── components/
│   │       │   ├── layout/     Navbar, MobileMenu, Footer, PageTransition, CommandPalette,
│   │       │   │               Cursor, FloatingContact, Preloader, RootLayout
│   │       │   ├── motion/     Reveal, WordReveal, LineReveal, CountUp, ImageReveal, MagneticButton
│   │       │   ├── sections/   Home sections, ProjectRail, TechnologyMarquee, ProfileBlocks
│   │       │   └── ui/         Button, Chip, ProjectCard, SectionLabel, ScrollProgress, Toast, TechIcon
│   │       ├── data/           All content: profile.ts, projects.ts, technologies.ts, lab.ts
│   │       ├── hooks/          useMediaQuery, useActiveSection, useDocumentTitle
│   │       ├── lib/            motion.ts (shared animation values), lenis.ts, contact.ts, intro.ts, api.ts
│   │       └── styles/         Global CSS (imports Tailwind + UI tokens + Lenis)
│   │
│   └── api/                    Backend: Express 5 + TypeScript
│       └── src/
│           ├── config/         Environment variables, validated with zod
│           ├── routes/         /api/health, /api/projects, /api/contact
│           ├── services/       Email delivery and other integrations
│           ├── middleware/     404 and error handlers
│           ├── data/           Project content
│           ├── app.ts          Express app (middleware + routes)
│           └── index.ts        Server start
│
├── packages/
│   ├── ui/                     Shared design system
│   │   └── src/
│   │       ├── tokens/         Motion tokens: EASE, DUR, STAGGER, VIEWPORT, SPRING
│   │       ├── styles/         tokens.css: Warm Earth colours, fonts, keyframes, reduced motion
│   │       └── lib/            cn() class helper
│   │
│   └── shared/                 Code used by both web and api
│       └── src/
│           ├── types/          Project type
│           ├── schemas/        Contact form schema (zod), validated on both sides
│           └── constants/      Route and API paths
│
└── docs/                       Plan, motion spec, build schedule
```

## Getting started

Requires Node 20 or newer.

```bash
npm install
cp apps/api/.env.example apps/api/.env
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:4000/api/health

In development, the frontend forwards `/api/*` requests to the API, so the frontend code calls `/api/...` with no hostname.

## Making it yours

All content lives in `apps/web/src/data/`. Components only read from there.

| What | Where |
|---|---|
| Name, intro, email, story | `data/profile.ts` |
| Portrait (About page only) | Put the photo in `public/images/`, set `profile.portrait` (e.g. `"/images/portrait.jpg"`) |
| Resume PDF | Put it in `public/resume/`, set `profile.resumePdf`. The preview and download button appear automatically |
| LinkedIn | `socials.linkedin` in `data/profile.ts`. Hidden while empty |
| Projects, case studies, links, results | `data/projects.ts`. Live demo, GitHub and video buttons appear only when a URL is set |
| Lab experiments | `data/lab.ts`. Cards become links when `href` is set |
| Images | Replace the SVG placeholders in `public/images/`, or point the data at new files |

### Contact form

The form validates and shows clear errors, but it does not deliver messages yet. Until it does, it offers to open the message in the visitor's email app instead of claiming it was sent. To turn on delivery:

1. Implement `apps/api/src/services/mail.service.ts` (e.g. with Resend) and set its env vars in `apps/api/.env`.
2. Set `VITE_CONTACT_ENABLED=true` in `apps/web/.env.local`.

## Scripts (run from the root)

| Command | What it does |
|---|---|
| `npm run dev` | Start the frontend and API together |
| `npm run dev:web` | Frontend only |
| `npm run dev:api` | API only |
| `npm run typecheck` | Type-check every package |
| `npm run build` | Build the frontend to `apps/web/dist` and the API to `apps/api/dist` |

## API

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Status check |
| GET | `/api/projects` | All projects |
| GET | `/api/projects/:slug` | One project |
| POST | `/api/contact` | Contact form. Body: `{ name, email, message }`. Returns 202, or 400 with validation issues |

## Deploying

- **Frontend:** Vercel, deployed from the **repo root** (Project Settings → Build and Deployment → Root Directory left empty). The root `vercel.json` installs the whole workspace with `npm ci`, builds `@portfolio/web`, serves `apps/web/dist`, and sends all page routes to `index.html`. Don't set Root Directory to `apps/web`: that folder can't build on its own because TypeScript, Vite and the shared packages are installed at the root.
- **API:** any Node host (Render, Railway, Fly.io). Build with `npm run build -w apps/api`, start with `npm run start -w apps/api`. Set `CORS_ORIGIN` to the frontend URL.
- Set `VITE_API_URL` on the frontend to the API's URL.
