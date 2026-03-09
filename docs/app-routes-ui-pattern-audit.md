# TripWeave App Routes — UI Pattern Audit Report

Audit of all app routes under `src/app/` for repeated UI patterns that should be reusable components.  
**Scope:** dashboard, explore, maps, notifications, profile, login, settings, invite, trip/[id]/* (timeline, map, budget, documents, suggested, members, settings, page.tsx), landing page.tsx.

---

## 1. BUTTONS

### 1.1 Sticker-style primary CTA (green, rounded-full, shadow-sticker-sm, hover lift)
**Pattern:** `font-bold border-2 border-border shadow-sticker-sm hover:-translate-y-px transition-all rounded-full ${getStickerBgClass("green")} hover:bg-sticker-green/90` (often with gap-2, plus icon).

| Location | File:Line / Component |
|----------|----------------------|
| Notifications | `src/app/notifications/page.tsx:114` — Accept button |
| Timeline | `src/app/trip/[id]/timeline/page.tsx:67` — Add First Event |
| Documents | `src/app/trip/[id]/documents/page.tsx:67` — Add Link |
| Trip Settings | `src/app/trip/[id]/settings/page.tsx:222` — Save Changes |
| Budget | `src/app/trip/[id]/budget/page.tsx:46` — Add Expense (primary, same shape) |

**Suggested:** `StickerButton` or Button variant `sticker-primary` (e.g. `variant="stickerPrimary"` with optional `color="green"`).  
**Priority:** **High** (5+ uses).

---

### 1.2 Outline sticker-style button (rounded-full, border-2, shadow-sticker-sm, bg-card)
**Pattern:** `font-bold border-2 border-border shadow-sticker-sm hover:-translate-y-px transition-all rounded-full bg-card` (sometimes `hover:shadow-sticker-card`).

| Location | File:Line / Component |
|----------|----------------------|
| Dashboard | `src/app/dashboard/page.tsx:207` — View All (profile) |
| Notifications | `src/app/notifications/page.tsx:77` — Mark all read |
| Timeline | `src/app/trip/[id]/timeline/page.tsx:41` — Import |
| Notifications | `src/app/notifications/page.tsx:117` — Decline |
| Profile | `src/app/profile/page.tsx:66` — Edit Profile (`rounded-xl`) |
| Profile | `src/app/profile/page.tsx:131` — View All (`rounded-xl`) |

**Suggested:** Button variant `sticker-outline` or `StickerButton variant="outline"`.  
**Priority:** **High** (6+).

---

### 1.3 Simple outline (border-2 border-border rounded-xl) — no shadow
**Pattern:** `font-bold border-2 border-border rounded-xl` (often with variant="outline").

| Location | File:Line / Component |
|----------|----------------------|
| Invite | `src/app/invite/[token]/page.tsx:98` — Go to Dashboard |
| Login | `src/app/login/page.tsx:90` — Sign in with Google |
| Invite | `src/app/invite/[token]/page.tsx:153` — Join Trip (primary, rounded-xl) |

**Suggested:** Button variant `stickerOutline` (rounded-xl, border-2) or document for auth/invite.  
**Priority:** **Medium** (3–4).

---

## 2. CARDS

### 2.1 Bordered rounded surface with shadow-sticker-card (inline div, not Card)
**Pattern:** `border-2 border-border rounded-2xl shadow-sticker-card` with `bg-card`, `hover:-translate-y-1`, `overflow-hidden`.

| Location | File:Line / Component |
|----------|----------------------|
| Dashboard | `src/app/dashboard/page.tsx:26` — NextTripBoardingPass wrapper |
| Dashboard | `src/app/dashboard/page.tsx:114` — CouponStatCard |
| Budget | `src/app/trip/[id]/budget/page.tsx:56,67,81` — 3 stat cards (bg-sticker-yellow/pink/green) |
| Budget | `src/app/trip/[id]/budget/page.tsx:103,127` — category/expense rows (rounded-xl) |
| Documents | `src/app/trip/[id]/documents/page.tsx:78` — file card |
| Members | `src/app/trip/[id]/members/page.tsx:69` — member row card |
| Notifications | `src/app/notifications/page.tsx:87` — Card with same classes |
| Profile | `src/app/profile/page.tsx:72,96` — Card with same classes |
| Settings | `src/app/settings/page.tsx:21` — Card |

**Note:** Trip pages use `TripDocumentCard` (budget, documents, members). Dashboard and budget use inline divs with same sticker-card look.

**Suggested:** Use `Card` with shared className or `StickerSurface` wrapper; ensure all use `Card` + `border-2 border-border rounded-2xl shadow-sticker-card`.  
**Priority:** **High** (many inline card divs).

---

### 2.2 Modal/centered card (auth, invite)
**Pattern:** `w-full max-w-md bg-card rounded-2xl border-2 border-border shadow-sticker-modal`.

| Location | File:Line / Component |
|----------|----------------------|
| Login | `src/app/login/page.tsx:74` |
| Invite | `src/app/invite/[token]/page.tsx:110` |

**Suggested:** `AuthCard` or `CenteredStickerCard` for auth/invite.  
**Priority:** **Low** (2 uses).

---

## 3. BADGES / LABELS

### 3.1 Page/section pill badge (getStickerBgClass + rounded-full + border-2 + shadow-sticker-sm)
**Pattern:** `${getStickerBgClass("…")} px-3 py-1 rounded-full font-black text-xs border-2 border-border shadow-sticker-sm inline-block mb-1/mb-2 rotate-1/-rotate-1`.

| Location | File:Line / Component |
|----------|----------------------|
| Maps | `src/app/maps/page.tsx:22` — 🌍 Global View (green, -rotate-1) |
| Notifications | `src/app/notifications/page.tsx:69` — 🔔 What's new (coral, rotate-1) |
| Timeline | `src/app/trip/[id]/timeline/page.tsx:33` — 📅 Itinerary (blue, rotate-1) |
| Map (trip) | `src/app/trip/[id]/map/page.tsx:21` — 🗺️ Explorer View (green, -rotate-1) |
| Suggested | `src/app/trip/[id]/suggested/page.tsx:35` — 💡 Idea Board (pink, -rotate-1) |
| Trip Settings | `src/app/trip/[id]/settings/page.tsx:118` — ⚙️ Configuration (blue, rotate-1) |
| Dashboard | `src/app/dashboard/page.tsx:41` — status pill "Done/In 30d/Upcoming" (primary) |
| TripHeader | `src/components/trip/TripHeader.tsx:147` — status pill (primary) |

**Existing:** `StickerBadge` in `src/components/ui/StickerBadge.tsx` uses `uppercase tracking-widest`; pages use slightly different style (optional rotate).  
**Suggested:** Extend `StickerBadge` with `color`, `rotate?: number`, optional `uppercase?: boolean`; use on all these pages.  
**Priority:** **High** (8+ inline pills).

---

### 3.2 Small type/role badges
**Pattern:** Small pill with `border-2 border-border`, `shadow-sticker-badge` or `shadow-sticker-sm`, `rounded-lg` or `rounded-full`.

| Location | File:Line / Component |
|----------|----------------------|
| Documents | `src/app/trip/[id]/documents/page.tsx:89` — doc type badge |
| Members | `src/app/trip/[id]/members/page.tsx:88` — role Badge (roleColors, shadow-sticker-badge) |
| Notifications | `src/app/notifications/page.tsx:104` — time badge |
| Landing | `src/app/page.tsx:91` — FAQ stamp |

**Suggested:** Use or extend `StickerBadge` for type/role.  
**Priority:** **Medium** (3–4).

---

## 4. EMPTY STATES

### 4.1 Dashed box + icon + title + description + optional CTA
**Pattern:** `border-4 border-dashed border-border rounded-3xl/rounded-2xl bg-secondary/30 shadow-sticker-dashed` with centered content, icon in sticker circle, heading, text, optional button.

| Location | File:Line / Component |
|----------|----------------------|
| Timeline | `src/app/trip/[id]/timeline/page.tsx:58–72` — No events yet |
| Documents | `src/app/trip/[id]/documents/page.tsx:104–109` — Add Document placeholder |
| Members | `src/app/trip/[id]/members/page.tsx:107–109` — No pending invitations |
| Trip root | `src/app/trip/[id]/page.tsx:18` — “Your Journey Awaits” |
| ExploreContent | `src/components/explore/ExploreContent.tsx:176` — empty discovery |
| SuggestedPlacesBoard | `src/components/trip/SuggestedPlacesBoard.tsx:33` — empty board |
| DayColumn | `src/components/trip/DayColumn.tsx:60` — empty day column |
| NewTripCard | `src/components/trip/NewTripCard.tsx:11` — create trip |

**Existing:** `EmptyState` in `src/components/ui/empty-state.tsx` — no dashed border or sticker icon circle.  
**Suggested:** `StickerEmptyState` (or extend `EmptyState`) with dashed border, sticker icon circle (getStickerBgClass), optional primary CTA.  
**Priority:** **High** (6+ empty/placeholder blocks).

---

## 5. SECTION / PAGE HEADERS

### 5.1 Trip & app page header (badge + title + description + optional actions)
**Pattern:** Optional pill badge; title `text-2xl md:text-3xl font-black tracking-tighter text-foreground leading-[0.9]`; description `text-muted-foreground font-bold text-sm mt-1`; layout `flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b-2 border-border pb-4`.

| Location | File:Line / Component |
|----------|----------------------|
| Dashboard | StampBadge + h1 + p; section headers |
| Explore | `src/app/explore/page.tsx:50–64` — StampBadge, h1, p |
| Maps | `src/app/maps/page.tsx:21–27` |
| Notifications | `src/app/notifications/page.tsx:66–79` |
| Timeline | `src/app/trip/[id]/timeline/page.tsx:31–52` |
| Map (trip) | `src/app/trip/[id]/map/page.tsx:19–26` |
| Suggested | `src/app/trip/[id]/suggested/page.tsx:33–40` |
| Trip Settings | `src/app/trip/[id]/settings/page.tsx:115–125` |

**Suggested:** `PageHeader`: optional `badge`, `title`, `description`, `actions`.  
**Priority:** **High** (8+ pages).

---

### 5.2 Sub-section title (uppercase, muted)
**Pattern:** `font-black text-sm uppercase tracking-wider text-muted-foreground mb-2`.

| Location | File:Line / Component |
|----------|----------------------|
| Budget | `src/app/trip/[id]/budget/page.tsx:97,121` |
| Members | `src/app/trip/[id]/members/page.tsx:105` |

**Suggested:** `SubSectionTitle` or typography variant.  
**Priority:** **Low** (2–3 uses).

---

## 6. REPEATED TAILWIND / INLINE STYLES

### 6.1 Tailwind strings appearing 3+ times

| Pattern | Approx. count | Notes |
|---------|----------------|-------|
| `border-2 border-border` | 50+ | Everywhere |
| `shadow-sticker-card` | 25+ | Cards, notifications, profile, budget, etc. |
| `shadow-sticker-sm` | 20+ | Buttons, badges, icons |
| `rounded-2xl` / `rounded-xl` | 70+ | Cards, buttons, inputs |
| `font-black` | 60+ | Headings, labels |
| `getStickerBgClass("…")` | 40+ | Badges, cards, landing |
| Page title class | 7 | `text-2xl md:text-3xl font-black tracking-tighter text-foreground leading-[0.9]` |
| Dashed empty state | 6+ | Empty states, trip root, NewTripCard |
| Icon box (h-9 w-9 rounded-xl border-2 shadow-sticker-sm-soft) | 4+ | Budget x3, documents, trip page |
| Form field: `border-2 border-border shadow-sticker-badge font-bold rounded-xl h-11` | 6+ | Trip settings |

**Suggested:** Shared constants or components (PageHeader, StickerCard, StickerEmptyState, StickerInput) so strings live in one place.  
**Priority:** **High** for consistency.

---

### 6.2 Inline style objects
- ParallaxDecor `style={{ y }}`, backfaceVisibility, animationDelay — acceptable (motion/3D).
- Budget progress `style={{ width: `${percentSpent}%` }}` — necessary dynamic value.  
**Priority:** **Low**.

---

## 7. SUMMARY BY AREA

| Area | Main patterns | Priority |
|------|----------------|----------|
| **Dashboard** | Sticker cards, outline button, status pill, section headers | High |
| **Explore** | PageHeader, empty state in ExploreContent | Medium |
| **Maps** | PageHeader + StickerBadge | Medium |
| **Notifications** | PageHeader, StickerButton (primary + outline), card | High |
| **Profile** | Outline buttons, Card + stat boxes | Medium |
| **Login** | AuthCard, outline button | Low |
| **Settings** | Card (single) | Low |
| **Invite** | AuthCard, buttons | Low |
| **Trip timeline** | PageHeader, StickerEmptyState, StickerButton | High |
| **Trip map** | PageHeader + StickerBadge | Medium |
| **Trip budget** | TripDocumentCard used; stat cards inline → StickerStatCard | High |
| **Trip documents** | TripDocumentCard; StickerButton, empty tile | High |
| **Trip suggested** | PageHeader + StickerBadge | Medium |
| **Trip members** | TripDocumentCard; empty state | High |
| **Trip settings** | PageHeader, form inputs, StickerButton, Danger card | High |
| **Trip root** | Dashed welcome card + CTA | High |
| **Landing** | Uses StampBadge, StickerCard, TicketButton; many decorative stickers | Low (landing-specific) |

---

## 8. EXTRACTION PRIORITY MATRIX

| Priority | Pattern | Suggested component | Est. uses |
|----------|--------|----------------------|-----------|
| **High** | Sticker primary CTA | `StickerButton` or `variant="stickerPrimary"` | 5+ |
| **High** | Sticker outline button | `StickerButton variant="outline"` | 6+ |
| **High** | Page/section pill | Extend `StickerBadge` (color, rotate) | 8+ |
| **High** | Sticker card surface | `StickerSurface` or Card + shared className | 15+ |
| **High** | Empty state (dashed + icon + CTA) | `StickerEmptyState` (extend EmptyState) | 6+ |
| **High** | Page header | `PageHeader` | 8+ |
| **Medium** | Auth/centered card | `AuthCard` | 2 |
| **Medium** | Simple outline (rounded-xl) | Button variant | 3–4 |
| **Medium** | Sub-section title | `SubSectionTitle` | 2–3 |
| **Low** | Sub-section label | Typography utility | 2–3 |

---

## 9. RECOMMENDED EXTRACTION ORDER

1. **PageHeader** — used on almost every app/trip page; biggest consistency win.
2. **StickerBadge** — extend existing; replace all inline pill badges.
3. **StickerButton** (primary + outline) — consolidate CTAs and secondary actions.
4. **StickerEmptyState** — extend EmptyState; use on timeline, documents, members, explore, suggested, NewTripCard.
5. **Sticker card surface** — shared className or `StickerSurface`; migrate inline card divs.
6. **AuthCard** (optional) — login + invite.
7. **SubSectionTitle** / form field styling — as needed.

This order reduces duplication first (headers, badges, buttons), then empty states and cards, then smaller patterns.
