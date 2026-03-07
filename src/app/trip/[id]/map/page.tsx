"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const TripMap = dynamic(() => import("@/components/trip/TripMap").then(mod => mod.TripMap), {
  loading: () => (
    <div className="flex items-center justify-center h-[50vh] lg:h-[calc(100vh-200px)]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  ),
  ssr: false,
});

export default function MapPage() {
  return (
    <div className="space-y-6 md:space-y-8 pb-12 flex flex-col h-[calc(100vh-140px)]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b-2 border-border pb-4 shrink-0">
        <div>
          <div className="bg-sticker-green text-foreground px-3 py-1 rounded-full font-black text-xs border-2 border-border shadow-[0_3px_0_rgba(0,0,0,0.08)] inline-block mb-2 -rotate-1">
            🗺️ Explorer View
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-foreground leading-[0.9]">Trip Map</h2>
          <p className="text-muted-foreground font-bold text-sm mt-1">Explore your destinations and events</p>
        </div>
      </div>
      <div className="flex-1 min-h-0 bg-card rounded-3xl border-2 border-border overflow-hidden shadow-[0_4px_0_rgba(0,0,0,0.06)] relative p-2 md:p-6 p-0 md:p-0">
        <TripMap />
      </div>
    </div>
  );
}
