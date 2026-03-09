"use client";

import { cn } from "@/lib/utils";
import type { StickerColorKey } from "@/lib/design-tokens";
import { getStickerBgClass } from "@/lib/design-tokens";

export interface StickerBadgeProps {
  children: React.ReactNode;
  /** Sticker palette color. Default: primary-like (yellow). */
  color?: StickerColorKey;
  className?: string;
  /**
   * Optional rotation for decoration (e.g. page headers).
   * number: 1 → rotate-1, -1 → -rotate-1.
   * boolean: true → rotate-1 (backward compat).
   */
  rotate?: number | boolean;
  /** Whether to apply uppercase. Default true. */
  uppercase?: boolean;
}

/**
 * Small pill/badge in sticker style: thick border, hard shadow, bold text.
 * Use for type labels (e.g. ACTIVITY, TRANSPORT), status, or decorative labels.
 * Supports emoji/icon in children (e.g. "🌍 Global View").
 */
export function StickerBadge({
  children,
  color = "yellow",
  className,
  rotate = false,
  uppercase = true,
}: StickerBadgeProps) {
  const rotateClass =
    rotate === true || rotate === 1
      ? "rotate-1"
      : rotate === -1
        ? "-rotate-1"
        : "";

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border-2 border-border font-black text-xs tracking-widest px-2.5 py-1",
        "shadow-sticker-sm",
        getStickerBgClass(color),
        uppercase && "uppercase",
        rotateClass,
        className
      )}
    >
      {children}
    </span>
  );
}
