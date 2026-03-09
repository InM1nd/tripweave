import * as React from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type AlertVariant = "success" | "error" | "warning" | "info";

interface AlertProps {
  variant: AlertVariant;
  title?: string;
  children?: React.ReactNode;
  onClose?: () => void;
  action?: React.ReactNode;
  className?: string;
}

const VARIANT_CONFIG: Record<
  AlertVariant,
  { bg: string; border: string; icon: React.ElementType; iconClass: string }
> = {
  success: {
    bg: "bg-sticker-green",
    border: "border-border",
    icon: CheckCircle2,
    iconClass: "text-foreground",
  },
  error: {
    bg: "bg-sticker-coral",
    border: "border-border",
    icon: AlertCircle,
    iconClass: "text-white",
  },
  warning: {
    bg: "bg-sticker-yellow",
    border: "border-border",
    icon: AlertTriangle,
    iconClass: "text-foreground",
  },
  info: {
    bg: "bg-sticker-blue",
    border: "border-border",
    icon: Info,
    iconClass: "text-foreground",
  },
};

const VARIANT_TEXT: Record<AlertVariant, { title: string; body: string }> = {
  success: { title: "text-foreground", body: "text-foreground/80" },
  error:   { title: "text-white",      body: "text-white/80" },
  warning: { title: "text-foreground", body: "text-foreground/80" },
  info:    { title: "text-foreground", body: "text-foreground/80" },
};

export function Alert({ variant, title, children, onClose, action, className }: AlertProps) {
  const config = VARIANT_CONFIG[variant];
  const text = VARIANT_TEXT[variant];
  const Icon = config.icon;

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-2xl border-2 p-4 shadow-sticker-card",
        config.bg,
        config.border,
        className,
      )}
    >
      <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", config.iconClass)} aria-hidden="true" />

      <div className="flex-1 min-w-0 space-y-1">
        {title && (
          <p className={cn("text-sm font-black tracking-tight leading-none", text.title)}>
            {title}
          </p>
        )}
        {children && (
          <div className={cn("text-sm leading-relaxed", text.body)}>
            {children}
          </div>
        )}
        {action && <div className="pt-1">{action}</div>}
      </div>

      {onClose && (
        <button
          onClick={onClose}
          aria-label="Dismiss"
          className={cn(
            "shrink-0 rounded-full border-2 border-border p-0.5 transition-all hover:-translate-y-px",
            variant === "error"
              ? "bg-white/20 text-white hover:bg-white/30"
              : "bg-black/10 text-foreground hover:bg-black/20",
          )}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
