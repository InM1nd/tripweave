"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { getStickerBgClass, type StickerColorKey } from "@/lib/design-tokens";

export interface StickerSurfaceProps {
  children: ReactNode;
  className?: string;
  /** Adds hover:-translate-y-px hover:shadow-sticker-card-hover */
  hover?: boolean;
  /** Adds hover:-translate-y-1 hover:shadow-sticker-card-hover-strong */
  hoverStrong?: boolean;
  /** Applies getStickerBgClass(color) for colored sticker surfaces */
  stickerColor?: StickerColorKey;
  /** Render as div or button for clickable cards */
  as?: "div" | "button";
}

const baseClasses =
  "rounded-2xl border-2 border-border shadow-sticker-card transition-transform duration-200";

export function StickerSurface({
  children,
  className,
  hover = false,
  hoverStrong = false,
  stickerColor,
  as: Component = "div",
}: StickerSurfaceProps) {
  const classes = cn(
    baseClasses,
    stickerColor && getStickerBgClass(stickerColor),
    hover && "hover:-translate-y-px hover:shadow-sticker-card-hover",
    hoverStrong && "hover:-translate-y-1 hover:shadow-sticker-card-hover-strong",
    className
  );

  return <Component className={classes}>{children}</Component>;
}
