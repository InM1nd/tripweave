"use client";

import { Calendar, Plus } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { AddEventModal } from "@/components/trip/AddEventModal";

interface TimelineEmptyStateProps {
  tripId: string;
}

export function TimelineEmptyState({ tripId }: TimelineEmptyStateProps) {
  return (
    <EmptyState
      variant="sticker"
      icon={Calendar}
      iconBgColor="yellow"
      title="No events yet"
      description="Start building your itinerary by adding events."
      action={
        <AddEventModal tripId={tripId}>
          <Button variant="stickerGreen" className="w-full min-w-0 sm:w-auto px-4 py-4 sm:px-8 sm:py-6 text-base sm:text-lg">
            <Plus className="h-5 w-5 mr-2 shrink-0" strokeWidth={3} />
            <span className="truncate">Add First Event</span>
          </Button>
        </AddEventModal>
      }
    />
  );
}
