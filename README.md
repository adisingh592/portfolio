# Online Portfolio

A personal portfolio with a React frontend, an Express API and a shared UI package, set up as one npm workspace repo.

The plan, effect catalogue and build phases are in [docs/](docs/).

## Structure

```
onlineportfolio/
├── apps/
│   ├── web/                    Frontend: Vite + React + Tailwind v4 + Motion
│   │   ├── public/             Static files served as-is (favicon, OG images)
│   │   └── src/
│   │       ├── app/            App root and router
│   │       ├── pages/          One file per route: Home, Work, CaseStudy, About, Lab, Contact, NotFound
│   │       ├── components/
│   │       │   ├── layout/     Nav, footer, page transition, root layout
│   │       │   └── sections/   Page sections: hero, marquee, project rail, stats
│   │       ├── hooks/          Frontend-only hooks
│   │       ├── lib/            API client and helpers
│   │       ├── data/           Site copy (profile.ts)
│   │       ├── styles/         Global CSS (imports Tailwind + UI tokens)
│   │       └── assets/         Images and fonts bundled by Vite
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
│   │       ├── tokens/         Motion tokens: EASE, DUR, STAGGER, VIEWPORT
│   │       ├── styles/         tokens.css: colours, fonts, keyframes, reduced motion
│   │       ├── motion/         Reveal, WordReveal, LineReveal, CountUp (phase 1)
│   │       ├── components/     Button, Chip, Cursor, Marquee (phases 1–6)
│   │       ├── hooks/          Shared hooks
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

- **Frontend:** Vercel, with root directory `apps/web`. `vercel.json` already sends all page routes to `index.html`.
- **API:** any Node host (Render, Railway, Fly.io). Build with `npm run build -w apps/api`, start with `npm run start -w apps/api`. Set `CORS_ORIGIN` to the frontend URL.
- Set `VITE_API_URL` on the frontend to the API's URL.
