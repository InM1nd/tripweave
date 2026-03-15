# TripWeave - AI Assistant Guidelines

## 1. Project Overview
TripWeave is a collaborative travel planning PWA. Users can create trips, manage itineraries (timeline, map, budget, documents), and explore recommendations.
- **Tone of Voice:** Friendly, motivating, action-oriented. Use short phrases (e.g., "Plan Together Beautifully", "Let's Go!"). Avoid corporate jargon.
- **Documentation:** Always refer to `docs/rules.md`, `docs/ui-guidelines.md`, and `docs/design-decisions.md` as the ultimate source of truth for styling and architecture.

## 2. Tech Stack
- **Core:** Next.js 16 (App Router), React 19, TypeScript (Strict, NO `any`).
- **Styling:** Tailwind CSS v4, Shadcn/ui (Radix), Framer Motion.
- **Backend & DB:** PostgreSQL (Supabase), Prisma 7, Next.js API Routes, Server Actions.
- **State & Forms:** TanStack React Query, React Hook Form, Zod.
- **Maps:** React Leaflet, OpenStreetMap.

## 3. Design System ("Sticker / Magazine" Style)
Strictly avoid flat minimalism. UI elements should feel like physical objects (tickets, polaroids, stickers).
- **Borders:** Thick, high-contrast borders (e.g., `border-2` or `border-4 border-border`).
- **Shadows:** Hard offset shadows ONLY (e.g., `shadow-[0_4px_0_rgba(0,0,0,0.08)]`). NO blur. On hover: shift element up and increase shadow offset.
- **Border Radius:** `rounded-2xl` / `rounded-3xl` for cards, `rounded-full` for badges/buttons.
- **Colors:** Use the sticker palette (`bg-sticker-yellow`, `sticker-pink`, `sticker-green`, etc.) alongside `primary`, `muted`, `card`. Support `[data-theme="dark"]` and `[data-palette="alternate"]`.
- **Dark theme — colored components:** For `bg-sticker-*`, badges, pills, colored cards: do NOT add `dark:text-white`. Keep the same text color in both themes (`text-foreground` for most sticker backgrounds). Use `text-white` only when the background is intentionally dark (e.g. danger, destructive).
- **Typography:** Bold, punchy headings (`font-black tracking-tighter`). Do not bloat heading sizes on internal pages (e.g., avoid `md:text-5xl` in lists).
- **Transforms:** Use rotation (`rotate-*`) ONLY for decorative badges and the landing page. DO NOT rotate structural cards inside the app (dashboard, trip, notifications).

## 4. Code Conventions & Architecture
- **Component Paradigm:** React Server Components (RSC) by default. Use `'use client'` strictly when necessary (hooks, browser APIs, interactive UI).
- **File Structure:** - `src/app/` for routing.
  - `src/components/` grouped by feature (`ui/`, `trip/`, `explore/`, etc.).
  - `src/actions/` for Server Actions.
- **Data Flow:** React Query for client-side state/fetching; Server actions for mutations; REST approach for API routes.
- **Styling Rules:** Tailwind classes ONLY. No inline styles.
- **Component Size:** Keep components under ~250 lines. Extract logic into smaller components or hooks if exceeded.
- **Naming:** PascalCase and named exports for components. camelCase for utilities.
