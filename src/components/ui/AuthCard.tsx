import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: ReactNode;
  className?: string;
}

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md bg-card rounded-2xl border-2 border-border shadow-sticker-modal overflow-hidden",
        className
      )}
    >
      {children}
    </div>
  );
}
