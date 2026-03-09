import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SubSectionTitleProps {
  children: ReactNode;
  className?: string;
}

export function SubSectionTitle({ children, className }: SubSectionTitleProps) {
  return (
    <div
      className={cn(
        "font-black text-sm uppercase tracking-wider text-muted-foreground mb-2",
        className
      )}
    >
      {children}
    </div>
  );
}
