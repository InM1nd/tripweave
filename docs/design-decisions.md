# Design Decisions (UI Polish Phase)

Brief log of decisions applied in the UI Polish phase.

- **Smooth scroll (Lenis)**: Enabled only on the landing page (`/`). Disabled on dashboard and all trip pages to preserve native scrolling and avoid layout issues on dense lists.
- **Color palette**: Accessible only from **Settings** (`/settings`). Removed from header and sidebar to reduce clutter and keep appearance controls in one place.
- **Cool Blue palette**: Redefined as soft pastel sticker-style tones (muted blues, pinks, greens, etc.) instead of bright Tailwind primaries, for consistency with the default Mango aesthetic.
- **Rotations**: Removed from all structural cards on internal pages (dashboard, trips, notifications, members, documents, budget, settings, timeline, map, suggested). Kept only on the landing page and on single-line decorative badges where appropriate. Internal cards use simple hover (translate, shadow) only.
- **Rounding**: Standardized on `rounded-xl` / `rounded-2xl` / `rounded-3xl` and `rounded-full` for UI components (inputs, dialogs, selects, dropdowns, sheets, popovers) with `border-2` and hard offset shadows.
- **Responsive (md)**: Reduced heading sizes on internal pages (e.g. `md:text-5xl` → `md:text-4xl`) and tightened padding/gaps so more content fits on 14" laptops.

See [ui-guidelines.md](ui-guidelines.md) for the full design system.
