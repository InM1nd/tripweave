"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

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
      <PageHeader
        badge={{ label: "🗺️ Explorer View", color: "green" }}
        title="Trip Map"
        description="Explore your destinations and events"
        className="border-b-2 border-border pb-4 shrink-0"
      />
      <div className={`flex-1 min-h-0 bg-card rounded-3xl border-2 border-border overflow-hidden shadow-sticker-sm-soft relative p-2 md:p-6 p-0 md:p-0`}>
        <TripMap />
      </div>
    </div>
  );
}
