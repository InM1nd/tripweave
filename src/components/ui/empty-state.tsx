"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { getStickerBgClass, type StickerColorKey } from "@/lib/design-tokens";

interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description?: string | React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  /** When "sticker", uses dashed border container and sticker-style icon wrapper. */
  variant?: "default" | "sticker";
  /** Sticker background for icon wrapper when variant="sticker". Defaults to primary/10 if not set. */
  iconBgColor?: StickerColorKey;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  variant = "default",
  iconBgColor,
}: EmptyStateProps) {
  const content = (
    <>
      {Icon && (
        <div
          className={cn(
            "mb-4 flex items-center justify-center",
            variant === "sticker"
              ? cn(
                  "h-12 w-12 rounded-xl border-2 border-border shadow-sticker-sm",
                  iconBgColor ? getStickerBgClass(iconBgColor) : "bg-primary/10"
                )
              : "h-16 w-16 rounded-2xl bg-primary/10"
          )}
        >
          <Icon
            className={cn(
              variant === "sticker" ? "h-6 w-6" : "h-8 w-8",
              iconBgColor ? "text-current" : "text-primary"
            )}
          />
        </div>
      )}
      <h3 className="font-semibold text-lg text-foreground mb-1">{title}</h3>
      {description != null && (
        <div className="text-sm text-muted-foreground w-full max-w-[280px] mb-4 min-w-0">
          {typeof description === "string" ? <p>{description}</p> : description}
        </div>
      )}
      {action}
    </>
  );

  if (variant === "sticker") {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center text-center border-2 border-dashed border-border rounded-2xl bg-muted/10 shadow-sticker-dashed w-full min-w-0 max-w-full overflow-hidden px-4 py-6 sm:p-8 md:p-12",
          className
        )}
      >
        {content}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center",
        className
      )}
    >
      {content}
    </div>
  );
}
