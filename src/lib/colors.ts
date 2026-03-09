/**
 * Playful Colorful Design System - color helpers for TripCard, StatCard, Badge, etc.
 */

import type { StickerColorKey } from "@/lib/design-tokens";
import { STICKER_BG_CLASSES } from "@/lib/design-tokens";

export type CoverColorKey =
  | "electric"
  | "coral"
  | "lime"
  | "sky"
  | "amber"
  | "pink";

/** Maps trip cover color key to sticker Tailwind background class (for cards, badges). */
export const COVER_COLOR_TO_STICKER: Record<CoverColorKey, string> = {
  electric: STICKER_BG_CLASSES.yellow,
  coral: "bg-sticker-coral text-white",
  lime: STICKER_BG_CLASSES.green,
  sky: STICKER_BG_CLASSES.blue,
  amber: STICKER_BG_CLASSES.yellow,
  pink: STICKER_BG_CLASSES.pink,
};

/** Get Tailwind class for a trip card/surface by cover color (e.g. TripCard, StatCard). */
export function getCoverStickerClass(key: CoverColorKey): string {
  return COVER_COLOR_TO_STICKER[key];
}

/** Sticker color key for use in StickerBadge / Card variant (when you need StickerColorKey from CoverColorKey). */
export function coverColorToStickerKey(cover: CoverColorKey): StickerColorKey {
  const map: Record<CoverColorKey, StickerColorKey> = {
    electric: "yellow",
    coral: "coral",
    lime: "green",
    sky: "blue",
    amber: "yellow",
    pink: "pink",
  };
  return map[cover];
}

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

/** Legacy: hex values for cover identity (e.g. non-Tailwind / image overlays). */
const COVER_COLORS: Record<CoverColorKey, string> = {
  electric: "#FF6B2C",
  coral: "#FFB800",
  lime: "#84CC16",
  sky: "#00B4A6",
  amber: "#7C6FF7",
  pink: "#F43F5E",
};

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
