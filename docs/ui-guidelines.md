# TripWeave UI Guidelines: Sticker & Travel Journal Aesthetic

TripWeave employs a unique "sticker", "magazine", and "travel journal" aesthetic. This document outlines the fundamental principles, design tokens, and components used to construct the app's interfaces.

## 🎨 1. Core Principles

- **No more flat minimalism**: The era of clean, flat, thin-bordered cards is gone.
- **Physicality**: Elements should feel like physical objects—tickets, polaroids, stickers, stamps, and receipts glued to a scrapbook.
- **Bold Typography**: Big, chunky, sans-serif fonts (e.g., `font-black`, `tracking-tighter`). Text should demand attention.
- **High Contrast Borders**: Almost all containers must use thick borders (e.g., `border-2`, `border-4`) mapped to the `border-border` variable (which is high-contrast).
- **Hard Offset Shadows**: Shadows are strictly solid blocks of color, imitating thick paper layers or stickers, rather than soft blurred drop-shadows.
- **Rotations for Decoration**: Decorative badges and header elements can have subtle rotations (`rotate-1`, `-rotate-2`), but **avoid rotating main structural cards** containing dense readable text in internal pages (to preserve usability).
- **Playful Pastels & Vibrant Accents**: Use the `bg-sticker-*` utilities.

## 📦 2. Design Tokens (Tailwind)

### 2.1 Color Palette
The app leverages a dual-palette system controlled by `[data-theme]` (dark/light) and `[data-palette]` (default "Mango" / alternate "Cool Blue"). 

**Sticker Colors (Semantic utility classes):**
- Yellow: `bg-sticker-yellow` (Warning, emphasis, highlights)
- Pink: `bg-sticker-pink` (Fun, avatars, badges)
- Green: `bg-sticker-green` (Success, maps, activities)
- Blue: `bg-sticker-blue` (Information, files)
- Lilac: `bg-sticker-lilac` (Creative, timeline events)
- Coral: `bg-sticker-coral` (Destructive/Important buttons)
- Olive: `bg-sticker-olive` (Secondary accents)

**Examples:**
```tsx
<div className="bg-sticker-yellow text-foreground ...">...</div>
```

### 2.2 Borders & Rounding
- **Thickness**:
  - `border-2` (Standard cards and inputs)
  - `border-4` (Hero structural elements, danger zones)
- **Rounding**: We rely heavily on large pill shapes and round corners to soften the thick borders.
  - `rounded-2xl` / `rounded-3xl` (Cards, dialogs)
  - `rounded-full` (Badges, primary hero buttons)
  - `rounded-[1.25rem]` (Avatars and inner components)

### 2.3 Hard Offset Shadows (Box Shadows)
All shadows in TripWeave are explicitly defined in square brackets to ensure zero blur radius.

- **Subtle (Inputs, small buttons):**
  `shadow-[0_2px_0_rgba(0,0,0,0.06)]` / `0.04`
- **Standard (Cards, secondary buttons):**
  `shadow-[0_4px_0_rgba(0,0,0,0.08)]` 
- **Elevated (Modals, primary buttons):**
  `shadow-[0_6px_0_rgba(0,0,0,0.1)]` / `shadow-[0_8px_0_...]`

**Hover State example:**
```tsx
<button className="shadow-[0_4px_0_rgba(0,0,0,0.08)] hover:-translate-y-px hover:shadow-[0_6px_0... transition-all">
```

## 🧩 3. Component Blueprints

### 3.1 The "Sticker Badge"
Used to denote status, roles, or decorate headers.
```tsx
<div className="bg-sticker-pink text-foreground px-4 py-1.5 rounded-full font-black text-sm border-2 border-border shadow-[0_3px_0_rgba(0,0,0,0.08)] inline-block rotate-1">
  ✈️ Flight
</div>
```

### 3.2 The "Ticket/Scrapbook Card"
The replacement for standard shadcn `Card`.
```tsx
<Card className="border-2 border-border bg-card shadow-[0_4px_0_rgba(0,0,0,0.08)] rounded-3xl overflow-hidden">
  <CardHeader className="border-b-2 border-border bg-secondary/30 p-5 md:p-6 pb-4">
    <CardTitle className="font-black text-xl md:text-2xl">Title</CardTitle>
  </CardHeader>
  <CardContent className="p-5 md:p-6 pt-5">
    Content...
  </CardContent>
</Card>
```

### 3.3 The "Perforated Edge / Danger Zone"
Used for drop zones, danger zones, layout empty states.
```tsx
<div className="border-4 border-dashed border-border bg-secondary/30 rounded-3xl shadow-[0_4px_0_rgba(0,0,0,0.04)]">
  ...
</div>
```

### 3.4 Buttons
Primary Call to Actions must feel chunky and tactile.
```tsx
<Button className="font-bold border-2 border-border shadow-[0_4px_0_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-transform rounded-full bg-primary text-primary-foreground h-12 px-6">
  Let's Go!
</Button>
```

## 📺 4. Responsive Rules
The chunky style takes up lots of space. To combat this on small/medium (laptop) screens:
- On `sm` or default sizes: Keep font sizes tight (e.g., `text-base`, `text-3xl`).
- On `md:` (Laptops 1024px+): Text scales slightly up (`text-lg`, `md:text-4xl`), but **do not use `md:text-5xl/6xl` for internal dashboard pages** as it rapidly reduces readable list space. Only use massive typography headers on the main Landing page or the Dashboard's hero section. Keep paddings at `p-5 md:p-6`.

## ⚙️ 5. Motion & UX Restrictions
- Smooth Scrolling (`ReactLenis`) should **only be active on the marketing Landing Page**. It breaks native scrolling expectations on dense lists/dashboards.
- Avoid rotating elements that contain multiple lines of text, lists, inputs or form controls. Rotations should only be applied to empty states, single badges, or visual-only decorative cards.
