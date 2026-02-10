"use client";

import { use } from "react";
import TripLayout from "@/components/layout/TripLayout";

export default function TripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <TripLayout tripId={id}>
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Welcome to your trip!</h2>
        <p className="text-muted-foreground">Select a tab above to get started.</p>
      </div>
    </TripLayout>
  );
}
