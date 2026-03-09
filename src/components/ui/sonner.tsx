"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      gap={8}
      // Override Sonner's built-in CSS variables so each variant gets the right bg/text
      style={
        {
          "--normal-bg":      "var(--card)",
          "--normal-text":    "var(--foreground)",
          "--normal-border":  "var(--border)",
          "--success-bg":     "var(--sticker-green)",
          "--success-text":   "var(--foreground)",
          "--success-border": "var(--border)",
          "--error-bg":       "var(--sticker-coral)",
          "--error-text":     "#ffffff",
          "--error-border":   "var(--border)",
          "--warning-bg":     "var(--sticker-yellow)",
          "--warning-text":   "var(--foreground)",
          "--warning-border": "var(--border)",
          "--info-bg":        "var(--sticker-blue)",
          "--info-text":      "var(--foreground)",
          "--info-border":    "var(--border)",
          "--border-radius":  "1rem",
          "--toast-shadow":   "0 4px 0 rgba(0,0,0,0.08)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "!border-2 !font-sans !text-sm",
          title:
            "!font-black !tracking-tight",
          description:
            "!text-xs !opacity-80",
          actionButton:
            "!bg-primary !text-primary-foreground !border-2 !border-border !rounded-full !font-black !text-xs",
          cancelButton:
            "!bg-black/10 !text-current !border !border-black/10 !rounded-full !font-bold !text-xs",
          closeButton:
            "!border-2 !border-border !rounded-full",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
