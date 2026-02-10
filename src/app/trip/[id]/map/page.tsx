"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const TripMap = dynamic(() => import("@/components/trip/TripMap"), {
  loading: () => (
    <div className="flex items-center justify-center h-[calc(100vh-200px)]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  ),
  ssr: false,
});

export default function MapPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Trip Map</h2>
        <p className="text-muted-foreground">Explore your destinations and events</p>
      </div>
      <TripMap />
    </div>
  );
}
