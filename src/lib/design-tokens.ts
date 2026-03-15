/**
 * Design tokens for TripWeave sticker/magazine UI.
 * Single source of truth for shadows, sticker color classes, and event-type styling.
 * Use these in components instead of duplicating raw Tailwind strings.
 */

// ── Sticker color keys (semantic) ─────────────────────────────────────────
export type StickerColorKey =
  | "pink"
  | "blue"
  | "green"
  | "lilac"
  | "yellow"
  | "coral"
  | "olive";

/** Tailwind classes for sticker backgrounds. Use with border-border, shadow tokens. */
export const STICKER_BG_CLASSES: Record<StickerColorKey, string> = {
  pink: "bg-sticker-pink text-sticker-foreground",
  blue: "bg-sticker-blue text-sticker-foreground",
  green: "bg-sticker-green text-sticker-foreground",
  lilac: "bg-sticker-lilac text-sticker-foreground",
  yellow: "bg-sticker-yellow text-sticker-foreground",
  coral: "bg-sticker-coral text-white",
  olive: "bg-sticker-olive text-white",
};

/** For Card/Button variants: same as above, used by StickerBadge, StickerCard, etc. */
export function getStickerBgClass(color: StickerColorKey): string {
  return STICKER_BG_CLASSES[color];
}

// ── Hard offset shadows (no blur; sticker style) ──────────────────────────
/** Card / surface default */
export const SHADOW_STICKER_CARD = "shadow-sticker-card";
/** Card hover */
export const SHADOW_STICKER_CARD_HOVER = "shadow-sticker-card-hover";
/** Card hover stronger (e.g. dashboard cards) */
export const SHADOW_STICKER_CARD_HOVER_STRONG = "shadow-sticker-card-hover-strong";
/** Small elements: buttons, badges, icons */
export const SHADOW_STICKER_SM = "shadow-sticker-sm";
export const SHADOW_STICKER_SM_SOFT = "shadow-sticker-sm-soft";
/** Modals, sheets, elevated surfaces */
export const SHADOW_STICKER_ELEVATED = "shadow-sticker-elevated";
export const SHADOW_STICKER_MODAL = "shadow-sticker-modal";
/** Tab bar “sitting on” content */
export const SHADOW_STICKER_TOP = "shadow-sticker-top";
/** Dashed / empty state areas */
export const SHADOW_STICKER_DASHED = "shadow-sticker-dashed";
/** Badge / tiny elements */
export const SHADOW_STICKER_BADGE = "shadow-sticker-badge";

// ── Event type (timeline / suggested) → sticker style ─────────────────────
export type EventTypeKey =
  | "TRANSPORT"
  | "HOTEL"
  | "ACTIVITY"
  | "RESTAURANT"
  | "OTHER";

export interface EventTypeStyle {
  /** Card background + text (e.g. bg-sticker-yellow text-sticker-foreground) */
  card: string;
  /** Dot/badge border (e.g. bg-sticker-yellow border-foreground) */
  dot?: string;
  /**
   * Hex color for Framer Motion `backgroundColor` animation.
   * Matches --sticker-* CSS var in light theme. Used only for animated dot in TimelineEventList.
   */
  dotHex: string;
}

/**
 * Maps Prisma Event.type to sticker palette. Use for timeline events, suggested places.
 * Aligns with docs: yellow = emphasis, blue = info, green = activities, etc.
 */
export const EVENT_TYPE_STICKER_STYLES: Record<EventTypeKey, EventTypeStyle> = {
  TRANSPORT:  { card: "bg-sticker-blue text-sticker-foreground",   dot: "bg-sticker-blue border-foreground",   dotHex: "#85B8EA" },
  HOTEL:      { card: "bg-sticker-lilac text-sticker-foreground",  dot: "bg-sticker-lilac border-foreground",  dotHex: "#B89CF7" },
  ACTIVITY:   { card: "bg-sticker-yellow text-sticker-foreground", dot: "bg-sticker-yellow border-foreground", dotHex: "#FFCF5C" },
  RESTAURANT: { card: "bg-sticker-pink text-sticker-foreground",   dot: "bg-sticker-pink border-foreground",   dotHex: "#F0A0AE" },
  OTHER:      { card: "bg-sticker-green text-sticker-foreground",  dot: "bg-sticker-green border-foreground",  dotHex: "#7EC89A" },
};

const DEFAULT_EVENT_STYLE: EventTypeStyle = EVENT_TYPE_STICKER_STYLES.OTHER;

export function getEventTypeStyle(type: string): EventTypeStyle {
  const key = type as EventTypeKey;
  return EVENT_TYPE_STICKER_STYLES[key] ?? DEFAULT_EVENT_STYLE;
}

/** Card class only (for backward compatibility where only class string is needed) */
export function getEventTypeCardClass(type: string): string {
  return getEventTypeStyle(type).card;
}

const EVENT_TYPE_TO_STICKER_COLOR: Record<EventTypeKey, StickerColorKey> = {
  TRANSPORT: "blue",
  HOTEL: "lilac",
  ACTIVITY: "yellow",
  RESTAURANT: "pink",
  OTHER: "green",
};

/** For StickerBadge etc.: get sticker color key from event type. */
export function getEventTypeStickerColor(type: string): StickerColorKey {
  return EVENT_TYPE_TO_STICKER_COLOR[type as EventTypeKey] ?? "green";
}

/**
 * Hex color for Framer Motion `backgroundColor` animation.
 * Matches --sticker-* CSS variables in light theme.
 */
export function getEventTypeDotHex(type: string): string {
  return (EVENT_TYPE_STICKER_STYLES[type as EventTypeKey] ?? DEFAULT_EVENT_STYLE).dotHex;
}

// ── Place type (from Explore AI) → sticker style ─────────────────────────
// Mirrors the color logic in PlaceCard's getCategoryInfo.
const PLACE_TYPE_STICKER_STYLES: Record<string, EventTypeStyle> = {
  food:        { card: "bg-sticker-pink text-sticker-foreground",   dotHex: "#F0A0AE" },
  restaurant:  { card: "bg-sticker-pink text-sticker-foreground",   dotHex: "#F0A0AE" },
  cafe:        { card: "bg-sticker-pink text-sticker-foreground",   dotHex: "#F0A0AE" },
  bar:         { card: "bg-sticker-pink text-sticker-foreground",   dotHex: "#F0A0AE" },
  nature:      { card: "bg-sticker-green text-sticker-foreground",  dotHex: "#7EC89A" },
  park:        { card: "bg-sticker-green text-sticker-foreground",  dotHex: "#7EC89A" },
  culture:     { card: "bg-sticker-blue text-sticker-foreground",   dotHex: "#85B8EA" },
  history:     { card: "bg-sticker-blue text-sticker-foreground",   dotHex: "#85B8EA" },
  museum:      { card: "bg-sticker-blue text-sticker-foreground",   dotHex: "#85B8EA" },
  "must see":  { card: "bg-sticker-coral text-white",       dotHex: "#FF8A75" },
  "must-see":  { card: "bg-sticker-coral text-white",       dotHex: "#FF8A75" },
  attraction:  { card: "bg-sticker-coral text-white",       dotHex: "#FF8A75" },
  instagram:   { card: "bg-sticker-lilac text-sticker-foreground",  dotHex: "#B89CF7" },
  tiktok:      { card: "bg-sticker-lilac text-sticker-foreground",  dotHex: "#B89CF7" },
  youtube:     { card: "bg-sticker-lilac text-sticker-foreground",  dotHex: "#B89CF7" },
};

/**
 * Maps the original Explore place type string to a sticker style.
 * Falls back to event type style if no match found.
 */
export function getPlaceTypeStyle(placeType: string | null | undefined, fallbackEventType?: string): EventTypeStyle {
  if (placeType) {
    const key = placeType.toLowerCase().trim();
    if (PLACE_TYPE_STICKER_STYLES[key]) return PLACE_TYPE_STICKER_STYLES[key];
    // Partial match
    for (const [k, v] of Object.entries(PLACE_TYPE_STICKER_STYLES)) {
      if (key.includes(k) || k.includes(key)) return v;
    }
  }
  return getEventTypeStyle(fallbackEventType ?? "OTHER");
}
