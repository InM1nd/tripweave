"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Event } from "@prisma/client";
import { useState } from "react";
import { EditEventSheet } from "@/components/trip/EditEventSheet";

interface SortableEventCardProps {
    event: Event;
    tripId: string;
}

const typeColors: Record<string, string> = {
    TRANSPORT: "bg-teal/10 text-teal",
    HOTEL: "bg-violet/10 text-violet",
    ACTIVITY: "bg-accent/10 text-accent",
    RESTAURANT: "bg-orange-500/10 text-orange-500",
    OTHER: "bg-muted/50 text-muted-foreground",
};

export function SortableEventCard({ event, tripId }: SortableEventCardProps) {
    const [showEditSheet, setShowEditSheet] = useState(false);

    // We need to prevent the drag from interfering with the click to edit
    // dnd-kit handles this well usually, but we should make sure the click action
    // is on the element itself or a specific handle.
    // Here we put the click listener on the main div, and useSortable attributes on it too.
    // Sensors usually distinguish properly.

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: event.id, data: { event } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                onClick={() => setShowEditSheet(true)}
                className={cn(
                    "p-3 rounded-lg bg-background border border-border/50 hover:border-primary/50 transition-colors group cursor-grab active:cursor-grabbing shadow-sm select-none",
                    isDragging && "z-50 shadow-xl ring-2 ring-primary/20"
                )}
            >
                <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-mono text-muted-foreground">
                        {format(new Date(event.startTime), "HH:mm")}
                    </span>
                    <Badge
                        variant="secondary"
                        className={cn("text-[10px] px-1 py-0 h-5", typeColors[event.type] || typeColors.OTHER)}
                    >
                        {event.type}
                    </Badge>
                </div>
                <p className="font-medium text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {event.title}
                </p>

                {event.cost !== null && event.cost > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                        {event.currency || "USD"} {event.cost}
                    </p>
                )}
            </div>

            {/* Edit Sheet */}
            <EditEventSheet
                event={event}
                open={showEditSheet}
                onOpenChange={setShowEditSheet}
                tripId={tripId}
            />
        </>
    );
}
