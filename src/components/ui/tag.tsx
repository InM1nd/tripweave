"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type EventTagType =
  | "flight"
  | "hotel"
  | "activity"
  | "food"
  | "transport"
  | "note";

const TAG_STYLES: Record<
  EventTagType,
  { bg: string; text: string }
> = {
  flight: {
    bg: "bg-teal/15",
    text: "text-teal",
  },
  hotel: {
    bg: "bg-accent/15",
    text: "text-accent",
  },
  activity: {
    bg: "bg-success/15",
    text: "text-success",
  },
  food: {
    bg: "bg-gold/15",
    text: "text-gold",
  },
  transport: {
    bg: "bg-mango/15",
    text: "text-mango",
  },
  note: {
    bg: "bg-rose/15",
    text: "text-rose",
  },
};

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  type: EventTagType;
}

export function Tag({ type, className, children, ...props }: TagProps) {
  const styles = TAG_STYLES[type];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        styles.bg,
        styles.text,
        className
      )}
      {...props}
    >
      {children ?? type}
    </span>
  );
}
