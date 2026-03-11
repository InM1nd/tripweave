# TripWeave

Collaborative travel planning app — plan trips, share timelines, track budgets, and keep documents in one place. Built with a distinctive sticker/magazine aesthetic.

## Features

- **Trips** — Create trips, set dates and destinations, upload cover images
- **Timeline** — Add events (flights, hotels, activities, restaurants), drag to reorder
- **Map** — View events on an interactive map with pins
- **Budget** — Set a budget, add expenses by category, track spending
- **Documents** — Upload and organize tickets, bookings, and files
- **Members** — Invite others, manage roles (Owner / Admin / Member)
- **Notifications** — Stay updated on invites and trip changes
- **Explore** — Discover and save places; suggested places per trip
- **Appearance** — Light/dark theme and two color palettes (Papaya Mango, Cool Blue) in Settings
- **PWA** — Installable, with offline support

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Shadcn/ui
- **Backend**: Next.js API routes, Prisma, PostgreSQL (Supabase)
- **Auth**: Clerk
- **Storage**: UploadThing
- **Maps**: React Leaflet (OpenStreetMap)
- **Charts**: Recharts
- **State**: TanStack React Query, React Hook Form, Zod
- **AI Code Generation**: The codebase is developed with the assistance of AI coding assistants (using large language models) to ensure best practices, maintain consistency, and accelerate development.

## Screenshots

| Landing | Dashboard | Trip timeline |
|--------|-----------|----------------|
| *Add `docs/screenshots/landing.png`* | *Add `docs/screenshots/dashboard.png`* | *Add `docs/screenshots/timeline.png`* |

Place screenshots in `docs/screenshots/` and link them here to showcase the sticker-style UI.

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL (or Supabase)
- [Clerk](https://clerk.com) and [UploadThing](https://uploadthing.com) accounts

### Install and run

```bash
npm install
cp .env.example .env.local   # then fill in your keys
npx prisma generate
npx prisma migrate dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

See `.env.example` for required variables (e.g. `DATABASE_URL`, Clerk keys, UploadThing, Resend).

### Database

```bash
npx prisma migrate dev   # run migrations
npx prisma studio        # open DB GUI
npx prisma db seed       # optional seed data
```

## Documentation

- [docs/plan.md](docs/plan.md) — MVP plan and phases
- [docs/rules.md](docs/rules.md) — Cursor/project rules and conventions
- [docs/ui-guidelines.md](docs/ui-guidelines.md) — Sticker/magazine design system
- [docs/design-tokens.md](docs/design-tokens.md) — Design tokens (shadows, colors)
- [docs/design-decisions.md](docs/design-decisions.md) — UI polish decisions

## Deploy

The app is set up for [Vercel](https://vercel.com). Connect the repo, set environment variables, and deploy.

---

TripWeave — plan adventures together.
