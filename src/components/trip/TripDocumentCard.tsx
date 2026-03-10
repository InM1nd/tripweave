import { cn } from "@/lib/utils";
import { type StickerColorKey } from "@/lib/design-tokens";
import { getStickerBgClass } from "@/lib/design-tokens";
import { StickerSurface } from "@/components/ui/StickerSurface";

interface TripDocumentCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  perforation?: boolean;
  className?: string;
  contentClassName?: string;
}

export function TripDocumentCard({
  children,
  title,
  subtitle,
  badge,
  actions,
  perforation = false,
  className,
  contentClassName,
}: TripDocumentCardProps) {
  return (
    <StickerSurface
      className={cn(
        "relative bg-card overflow-hidden min-w-0",
        className
      )}
    >
      {/* Optional vertical perforation on the left */}
      {perforation && (
        <div className="absolute left-0 top-0 bottom-0 w-3 ticket-perforation-v z-10" />
      )}

      {/* Document header */}
      {(title || badge || actions) && (
        <div
          className={cn(
            "flex flex-col sm:flex-row sm:items-end justify-between gap-3 px-5 pt-5 pb-4 border-b-2 border-dashed border-border",
            perforation && "pl-7"
          )}
        >
          <div className="flex-1 min-w-0">
            {badge && <div className="mb-2">{badge}</div>}
            {title && (
              <h3 className="text-xl md:text-2xl font-black tracking-tighter text-foreground leading-[0.9]">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-muted-foreground font-bold text-sm mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
      )}

      {/* Document content */}
      <div
        className={cn(
          "p-5",
          perforation && "pl-7",
          contentClassName
        )}
      >
        {children}
      </div>
    </StickerSurface>
  );
}

/* Small section badge for document headers */
interface DocumentBadgeProps {
  children: React.ReactNode;
  color?: StickerColorKey;
  className?: string;
}

export function DocumentBadge({
  children,
  color = "yellow",
  className,
}: DocumentBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-black text-xs border-2 border-border uppercase tracking-wider",
        "shadow-sticker-sm",
        getStickerBgClass(color),
        className
      )}
    >
      {children}
    </span>
  );
}
