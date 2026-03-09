"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { MoreHorizontal, Plus } from "lucide-react";
import { format } from "date-fns";
import { Event } from "@prisma/client";
import { SortableEventCard } from "./SortableEventCard"; // relative import working? yes same folder
import { AddEventModal } from "./AddEventModal";
import { cn } from "@/lib/utils";

interface DayColumnProps {
    date: Date;
    dayNumber: number;
    events: Event[];
    tripId: string;
}

export function DayColumn({ date, dayNumber, events, tripId }: DayColumnProps) {
    // Use YYYY-MM-DD as ID for the column droppable area
    const dateStr = format(date, "yyyy-MM-dd");

    const { setNodeRef, isOver } = useDroppable({
        id: dateStr,
        data: { date }
    });

    return (
        <Card className={cn("h-full border-border/40 bg-card/50 flex flex-col min-h-[500px] transition-colors", isOver && "bg-muted/50 border-primary/20 ring-2 ring-primary/10")}>
            <CardHeader className="pb-3 border-b border-border/40 bg-muted/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-xl bg-primary/10 border-2 border-border flex items-center justify-center font-bold text-foreground text-xs shrink-0 shadow-sticker-badge">
                            Day {dayNumber}
                        </div>
                        <div>
                            <CardTitle className="text-base">{format(date, "EEE, MMM d")}</CardTitle>
                        </div>
                    </div>
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-2 border-border shadow-sticker-sm hover:-translate-y-px hover:shadow-sticker-card transition-all">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="p-3 flex-1 flex flex-col gap-2">
                <SortableContext
                    id={dateStr}
                    items={events.map(e => e.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div ref={setNodeRef} className="flex-1 flex flex-col gap-2 min-h-[100px]">
                        {events.map((event) => (
                            <SortableEventCard key={event.id} event={event} tripId={tripId} />
                        ))}

                        {events.length === 0 && !isOver && (
                            <EmptyState
                                variant="sticker"
                                title="No activities"
                                className="py-6 px-4 flex-1 min-h-[100px]"
                            />
                        )}
                    </div>
                </SortableContext>

                <AddEventModal tripId={tripId} defaultDate={date}>
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-auto rounded-xl border-2 border-border border-dashed bg-card font-bold text-foreground shadow-sticker-dashed hover:border-primary/50 hover:-translate-y-px hover:shadow-sticker-sm transition-all"
                    >
                        <Plus className="h-3 w-3 mr-2" strokeWidth={2.5} />
                        Add Activity
                    </Button>
                </AddEventModal>
            </CardContent>
        </Card>
    );
}
