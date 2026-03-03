"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                            Day {dayNumber}
                        </div>
                        <div>
                            <CardTitle className="text-base">{format(date, "EEE, MMM d")}</CardTitle>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
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
                            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground py-8 border-2 border-dashed border-border/40 rounded-lg bg-background/50">
                                <p className="text-xs">No activities</p>
                            </div>
                        )}
                    </div>
                </SortableContext>

                <AddEventModal tripId={tripId} defaultDate={date}>
                    <Button variant="ghost" size="sm" className="w-full mt-auto border border-dashed border-border/50 text-muted-foreground hover:text-primary hover:border-primary/50">
                        <Plus className="h-3 w-3 mr-2" />
                        Add Activity
                    </Button>
                </AddEventModal>
            </CardContent>
        </Card>
    );
}
