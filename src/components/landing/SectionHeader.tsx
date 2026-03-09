"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { StampBadge } from "@/components/landing/StickerCard";
import type { StickerColorKey } from "@/lib/design-tokens";

export interface SectionHeaderProps {
  badge?: {
    label: string;
    icon?: ReactNode;
    color?: StickerColorKey;
  };
  title: string;
  subtitle?: string;
  centered?: boolean;
  as?: "h1" | "h2";
  className?: string;
}

export function SectionHeader({
  badge,
  title,
  subtitle,
  centered = true,
  as: Heading = "h2",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        centered && "text-center",
        className
      )}
    >
      {badge && (
        <StampBadge color={badge.color ?? "primary"}>
          {badge.icon}
          {badge.label}
        </StampBadge>
      )}
      <Heading className="text-4xl md:text-5xl font-black mt-6 text-foreground">
        {title}
      </Heading>
      {subtitle && (
        <p
          className={cn(
            "text-muted-foreground font-bold text-lg mt-3 max-w-xl",
            centered && "mx-auto"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
