import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { getStickerBgClass } from "@/lib/design-tokens"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sticker text-sm font-bold transition-all duration-[180ms] ease-in-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sticker hover:translate-y-[1px] hover:shadow-stickerSoft hover:bg-primary/95",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sticker hover:translate-y-[1px] hover:shadow-stickerSoft hover:bg-destructive/90",
        outline:
          "border-2 border-border bg-transparent shadow-sm hover:bg-secondary text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground border-2 border-border shadow-sticker hover:translate-y-[1px] hover:shadow-stickerSoft",
        ghost: "bg-transparent text-muted-foreground hover:bg-secondary hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        danger:
          "bg-destructive text-destructive-foreground shadow-sticker hover:translate-y-[1px] hover:shadow-stickerSoft hover:bg-destructive/90",
        sticker:
          `${getStickerBgClass("yellow")} rounded-sticker border-2 border-border shadow-sticker-card`,
        stickerGreen:
          `${getStickerBgClass("green")} border-2 border-border shadow-sticker-sm hover:-translate-y-px hover:bg-sticker-green/90`,
        stickerCoral:
          `${getStickerBgClass("coral")} border-2 border-border shadow-sticker-sm hover:-translate-y-px hover:bg-sticker-coral/90`,
        stickerOutline:
          "border-2 border-border bg-card text-foreground shadow-sticker-sm hover:-translate-y-px hover:shadow-sticker-card transition-all rounded-full font-bold",
        stickerIcon:
          "rounded-full border-2 border-border bg-card text-foreground shadow-sticker-sm hover:-translate-y-px hover:shadow-sticker-card transition-all",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-5",
        lg: "h-12 px-8 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
