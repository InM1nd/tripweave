# Design Tokens & Reusable Components

Single source of truth for sticker/magazine style: colors, shadows, event types, and shared UI pieces.

## Tokens

### `src/lib/design-tokens.ts`

- **Sticker palette**  
  `STICKER_BG_CLASSES`, `getStickerBgClass(color)`  
  Keys: `pink` | `blue` | `green` | `lilac` | `yellow` | `coral` | `olive`.  
  Use for backgrounds of badges, cards, and surfaces that follow the sticker palette.

- **Shadows (hard offset, no blur)**  
  Export-only constants for reference; in components use Tailwind classes:
  - Card: `shadow-[0_4px_0_rgba(0,0,0,0.08)]` or `shadow-sticker` / `shadow-stickerSoft` from `tailwind.config.ts`
  - Hover: `shadow-[0_6px_0_rgba(0,0,0,0.10)]`
  - Small elements: `shadow-[0_3px_0_rgba(0,0,0,0.08)]`

- **Event types (timeline / suggested)**  
  - `getEventTypeStyle(type)` → `{ card, dot }` (Tailwind classes)
  - `getEventTypeCardClass(type)` → card class string
  - `getEventTypeStickerColor(type)` → `StickerColorKey` for `StickerBadge`
  - Types: TRANSPORT, HOTEL, ACTIVITY, RESTAURANT, OTHER

### `src/lib/colors.ts`

- **Trip cover colors**  
  - `getCoverStickerClass(coverColor)` — Tailwind class for trip/StatCard surface (`CoverColorKey`: electric, coral, lime, sky, amber, pink).
  - `coverColorToStickerKey(cover)` — map to `StickerColorKey` for reusable components.
  - `getCoverColor`, `getGradient`, `getShadow`, `getRandomCoverColor` — legacy hex/gradient/shadow for non-Tailwind use.

## Reusable components

- **`StickerBadge`** (`src/components/ui/StickerBadge.tsx`)  
  Pill badge: sticker palette color, thick border, hard shadow.  
  Props: `color?: StickerColorKey`, `rotate?: boolean`.  
  Use for type labels, status, decorative labels (e.g. ACTIVITY, TRANSPORT).

- **Card** (`src/components/ui/card.tsx`)  
  Variants: `sticker`, `stickerPink`, `stickerBlue`, `stickerGreen`, `stickerLilac`, `stickerCoral`, `stickerOlive` — use with `border-border` and shadow classes.

- **Landing**  
  `StickerCard`, `StampBadge`, `TicketButton` in `src/components/landing/StickerCard.tsx` — for landing only; app pages prefer `StickerBadge` and design-tokens.

## Usage rules

1. **Event/timeline colors**  
   Use `getEventTypeStyle(type).card` or `getEventTypeCardClass(type)` for event cards; do not duplicate local `eventTypeColors` maps.

2. **Trip cover colors**  
   Use `getCoverStickerClass(coverColor)` for TripCard, StatCard, and any surface that follows trip cover color.

3. **New sticker-colored surfaces**  
   Prefer `getStickerBgClass(color)` + border + shadow from tokens or Tailwind config.

4. **Shadows**  
   Hard offset only (no blur). Prefer `shadow-sticker` / `shadow-stickerSoft` from config or the explicit `shadow-[0_*px_0_*]` classes from ui-guidelines.

See [ui-guidelines.md](ui-guidelines.md) and [design-decisions.md](design-decisions.md) for full style rules.
