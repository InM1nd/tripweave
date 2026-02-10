"use client";

import { Plus } from "lucide-react";

export function NewTripCard() {
    return (
        <div
            className="hidden md:flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group min-h-[280px]"
            onClick={() => {
                // Trigger the hidden or main CreateTripModal button
                document.getElementById("create-trip-trigger")?.click();
            }}
        >
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-600/10 group-hover:from-emerald-500/20 group-hover:to-teal-600/20 flex items-center justify-center mb-4 transition-all">
                <Plus className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-1">New Adventure</h3>
            <p className="text-sm text-muted-foreground text-center max-w-[180px]">
                Start planning your next trip
            </p>
        </div>
    );
}
