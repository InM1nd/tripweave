"use client";

import { List, Columns3 } from "lucide-react";
import { cn } from "@/lib/utils";

export type TimelineViewMode = "vertical" | "horizontal";

interface TimelineViewToggleProps {
    mode: TimelineViewMode;
    onChange: (mode: TimelineViewMode) => void;
}

export function TimelineViewToggle({ mode, onChange }: TimelineViewToggleProps) {
    return (
        <div className="inline-flex items-center rounded-full border-2 border-border bg-card shadow-sticker-badge h-9 p-0.5 gap-0.5">
            <button
                type="button"
                onClick={() => onChange("vertical")}
                className={cn(
                    "flex items-center justify-center h-full px-3.5 rounded-full transition-all font-black text-xs gap-1.5",
                    mode === "vertical"
                        ? "bg-primary text-primary-foreground shadow-sticker-badge"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                )}
            >
                <List className="h-3.5 w-3.5" strokeWidth={3} />
                <span className="hidden sm:inline">List</span>
            </button>
            <button
                type="button"
                onClick={() => onChange("horizontal")}
                className={cn(
                    "flex items-center justify-center h-full px-3.5 rounded-full transition-all font-black text-xs gap-1.5",
                    mode === "horizontal"
                        ? "bg-primary text-primary-foreground shadow-sticker-badge"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                )}
            >
                <Columns3 className="h-3.5 w-3.5" strokeWidth={3} />
                <span className="hidden sm:inline">Board</span>
            </button>
        </div>
    );
}
