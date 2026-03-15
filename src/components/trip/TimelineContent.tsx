"use client";

import { useState } from "react";
import { TimelineEventList } from "@/components/trip/TimelineEventList";
import { HorizontalTimelineView } from "@/components/trip/HorizontalTimelineView";
import { TimelineViewToggle, TimelineViewMode } from "@/components/trip/TimelineViewToggle";
import type { Event } from "@prisma/client";

interface TimelineContentProps {
    groupedEvents: Record<string, Event[]>;
    tripId: string;
}

export function TimelineContent({ groupedEvents, tripId }: TimelineContentProps) {
    const [viewMode, setViewMode] = useState<TimelineViewMode>(() => {
        if (typeof window !== "undefined") {
            return (localStorage.getItem("timeline-view") as TimelineViewMode) || "vertical";
        }
        return "vertical";
    });

    const handleViewChange = (mode: TimelineViewMode) => {
        setViewMode(mode);
        localStorage.setItem("timeline-view", mode);
    };

    return (
        <>
            <div className="flex justify-end -mt-2 mb-2">
                <TimelineViewToggle mode={viewMode} onChange={handleViewChange} />
            </div>

            {viewMode === "vertical" ? (
                <div className="max-w-4xl mx-auto w-full">
                    <TimelineEventList groupedEvents={groupedEvents} tripId={tripId} />
                </div>
            ) : (
                <HorizontalTimelineView groupedEvents={groupedEvents} tripId={tripId} />
            )}
        </>
    );
}
