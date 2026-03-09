"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"
import type { CoverColorKey } from "@/lib/colors"
import { getCoverStickerClass } from "@/lib/colors"

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  accentColor?: CoverColorKey;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, accentColor, ...props }, ref) => {
  const indicatorBg = accentColor
    ? getCoverStickerClass(accentColor).split(" ")[0]
    : "bg-accent";
  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-muted border-2 border-border",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn("h-full flex-1 transition-all", indicatorBg)}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
