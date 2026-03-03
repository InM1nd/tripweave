# API Changelog

## 2025-03-03 — Trip coverColor (additive)

### Trip model

- **Added** `coverColor` (optional, string): One of `"electric" | "coral" | "lime" | "sky" | "amber" | "pink"`. Default: `"electric"` when not provided.
- Used for Playful Colorful Dashboard styling: card gradients, shadows, and accent colors.
- **Backward compatible**: Existing trips without `coverColor` will use a fallback (electric or random) on the client.

### Server actions

- `createTrip`: Accepts optional `coverColor` in input. If omitted, assigns a random color via `getRandomCoverColor()`.
- `getTrips`, `getTrip`: Return `coverColor` as part of the Trip object (additive, no breaking changes).
