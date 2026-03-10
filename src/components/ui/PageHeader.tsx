import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { StickerBadge } from "@/components/ui/StickerBadge";
import type { StickerColorKey } from "@/lib/design-tokens";

export interface PageHeaderProps {
  /** Optional pill badge (uses StickerBadge). */
  badge?: {
    label: string;
    icon?: ReactNode;
    color?: StickerColorKey;
    /** Pass through to StickerBadge. Default false so labels like "Global View" keep case. */
    uppercase?: boolean;
  };
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

/**
 * Reusable page header: optional badge, title, description, and actions.
 * Use for dashboard, explore, maps, notifications, trip timeline/map/suggested/settings.
 */
export function PageHeader({
  badge,
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        actions && "sm:flex-row sm:flex-wrap sm:items-end justify-between gap-3",
        className
      )}
    >
      <div className="flex flex-col items-start min-w-0">
        {badge && (
          <StickerBadge color={badge.color} className="mb-2" uppercase={badge.uppercase ?? false}>
            {badge.icon && <>{badge.icon} </>}
            {badge.label}
          </StickerBadge>
        )}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tighter text-foreground leading-[0.9]">
          {title}
        </h1>
        {description != null && (
          <div className="text-muted-foreground font-bold text-sm mt-1">
            {description}
          </div>
        )}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}
