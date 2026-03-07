"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  accentColor?: "electric" | "coral" | "lime" | "sky" | "amber" | "pink";
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, accentColor, ...props }, ref) => {
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
        className={cn(
          "h-full flex-1 transition-all",
          accentColor === "coral" && "bg-sticker-coral",
          accentColor === "lime" && "bg-sticker-green",
          accentColor === "sky" && "bg-sticker-blue",
          accentColor === "amber" && "bg-sticker-pink",
          accentColor === "pink" && "bg-sticker-pink",
          accentColor === "electric" && "bg-sticker-yellow",
          !accentColor && "bg-accent"
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
