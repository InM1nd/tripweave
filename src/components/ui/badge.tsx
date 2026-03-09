import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border-2 border-border px-2.5 py-0.5 text-xs font-bold shadow-sticker-badge transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-accent text-accent-text shadow hover:bg-accent/80",
        secondary:
          "border-transparent bg-bg-surface-2 text-text-primary hover:bg-bg-surface-2/80",
        destructive:
          "border-transparent bg-danger text-white shadow hover:bg-danger/80",
        outline: "text-text-primary",
        upcoming:
          "border-transparent bg-accent-subtle text-accent",
        ongoing:
          "border-transparent bg-success-subtle text-success",
        completed:
          "border-transparent bg-success-subtle text-success",
        draft:
          "border-transparent bg-bg-surface-3 text-text-secondary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
