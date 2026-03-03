/**
 * Playful Colorful Design System - color helpers for TripCard, StatCard, Badge, etc.
 */

export type CoverColorKey =
  | "electric"
  | "coral"
  | "lime"
  | "sky"
  | "amber"
  | "pink";

/**
 * Cover colors for trip cards only (identity). Mapped to Midnight Mango colors.
 */
const COVER_COLORS: Record<CoverColorKey, string> = {
  electric: "#FF6B2C",  /* mango */
  coral: "#FFB800",     /* gold */
  lime: "#84CC16",      /* lime */
  sky: "#00B4A6",       /* teal */
  amber: "#7C6FF7",     /* violet */
  pink: "#F43F5E",      /* rose */
};

const GRADIENTS: Record<CoverColorKey, string> = {
  electric: "linear-gradient(135deg, rgba(255, 107, 44, 0.22) 0%, rgba(255, 107, 44, 0.05) 100%)",
  coral: "linear-gradient(135deg, rgba(255, 184, 0, 0.22) 0%, rgba(255, 184, 0, 0.05) 100%)",
  lime: "linear-gradient(135deg, rgba(132, 204, 22, 0.22) 0%, rgba(132, 204, 22, 0.05) 100%)",
  sky: "linear-gradient(135deg, rgba(0, 180, 166, 0.22) 0%, rgba(0, 180, 166, 0.05) 100%)",
  amber: "linear-gradient(135deg, rgba(124, 111, 247, 0.22) 0%, rgba(124, 111, 247, 0.05) 100%)",
  pink: "linear-gradient(135deg, rgba(244, 63, 94, 0.22) 0%, rgba(244, 63, 94, 0.05) 100%)",
};

const SHADOWS: Record<CoverColorKey, string> = {
  electric: "0 8px 32px rgba(255, 107, 44, 0.25)",
  coral: "0 8px 32px rgba(255, 184, 0, 0.25)",
  lime: "0 8px 32px rgba(132, 204, 22, 0.25)",
  sky: "0 8px 32px rgba(0, 180, 166, 0.25)",
  amber: "0 8px 32px rgba(124, 111, 247, 0.25)",
  pink: "0 8px 32px rgba(244, 63, 94, 0.25)",
};

const COVER_COLOR_KEYS: CoverColorKey[] = [
  "electric",
  "coral",
  "lime",
  "sky",
  "amber",
  "pink",
];

export function getCoverColor(key: CoverColorKey): string {
  return COVER_COLORS[key];
}

export function getGradient(key: CoverColorKey): string {
  return GRADIENTS[key];
}

export function getShadow(key: CoverColorKey): string {
  return SHADOWS[key];
}

export function getRandomCoverColor(): CoverColorKey {
  const index = Math.floor(Math.random() * COVER_COLOR_KEYS.length);
  return COVER_COLOR_KEYS[index];
}

export function getAccentBgRgba(key: CoverColorKey, opacity = 0.15): string {
  const rgbMap: Record<CoverColorKey, string> = {
    electric: "255, 107, 44",
    coral: "255, 184, 0",
    lime: "132, 204, 22",
    sky: "0, 180, 166",
    amber: "124, 111, 247",
    pink: "244, 63, 94",
  };
  return `rgba(${rgbMap[key]}, ${opacity})`;
}
