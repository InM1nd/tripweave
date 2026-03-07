"use client";

import { useState } from "react";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
    defaultDropAnimationSideEffects,
    DropAnimation,
    useDroppable
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { format, parseISO } from "date-fns";
import { EditEventSheet } from "@/components/trip/EditEventSheet";
import { SortableTimelineEvent } from "@/components/trip/SortableTimelineEvent";
import { updateEvent, deleteEvent } from "@/actions/event";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddEventModal } from "@/components/trip/AddEventModal";
import { cn } from "@/lib/utils";
import type { Event } from "@prisma/client";

interface TimelineEventListProps {
    groupedEvents: Record<string, Event[]>; // Events grouped by date string (YYYY-MM-DD)
    tripId: string;
}

// Droppable container for each day
function DayContainer({ dateKey, count, children, tripId }: { dateKey: string, count: number, children: React.ReactNode, tripId: string }) {
    const date = new Date(dateKey);
    const { setNodeRef, isOver } = useDroppable({
        id: dateKey,
        data: { date }
    });

    return (
        <div ref={setNodeRef} className={cn("relative transition-colors rounded-xl p-2 -m-2", isOver && "bg-primary/5")}>
            {/* Date Header - Sticky: just below tab bar */}
            <div className="flex items-center justify-between mb-4 sticky top-28 z-20 bg-background/95 backdrop-blur-sm py-3 border-b border-border/40">
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex flex-col items-center justify-center shrink-0 shadow-sm">
                        <span className="text-xl font-bold text-primary leading-none">
                            {date.getDate()}
                        </span>
                        <span className="text-[10px] text-primary font-medium uppercase tracking-wider">
                            {date.toLocaleDateString("en-US", { month: "short" })}
                        </span>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-foreground">
                            {date.toLocaleDateString("en-US", { weekday: "long" })}
                        </h3>
                        <p className="text-sm font-medium text-muted-foreground">
                            {count} {count === 1 ? "activity" : "activities"} planned
                        </p>
                    </div>
                </div>

                <AddEventModal tripId={tripId} defaultDate={date}>
                    <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">Add Event</span>
                    </Button>
                </AddEventModal>
            </div>

            {/* Events Line */}
            <div className="ml-6 pl-6 border-l-2 border-border/50 space-y-4 min-h-[50px]">
                {children}
            </div>
        </div>
    );
}

export function TimelineEventList({ groupedEvents, tripId }: TimelineEventListProps) {
    // We need local state to handle optimistic updates for drag and drop
    // We flatten the grouped events into a single list for easier management if needed, 
    // or keep them grouped. Keeping them grouped matches the UI structure.

    // Actually, for optimistic updates, we might need a single state object.
    // Let's assume groupedEvents is passed fresh from server but we want immediate feedback.
    // For now, let's just use the props and rely on server revalidation (which might be slow).
    // Better: use state.

    const [localGroups, setLocalGroups] = useState(groupedEvents);
    const [activeEvent, setActiveEvent] = useState<Event | null>(null);
    const [selectedEventToEdit, setSelectedEventToEdit] = useState<Event | null>(null);
    const [isDeleteLoading, setIsDeleteLoading] = useState<string | null>(null);

    const handleDeleteEvent = async (eventId: string) => {
        setIsDeleteLoading(eventId);
        try {
            await deleteEvent(tripId, eventId);
            toast.success("Event deleted");
            const newGroups = { ...localGroups };
            for (const key in newGroups) {
                newGroups[key] = newGroups[key].filter((e: Event) => e.id !== eventId);
            }
            setLocalGroups(newGroups);
        } catch {
            toast.error("Failed to delete event");
        } finally {
            setIsDeleteLoading(null);
        }
    };

    // Update local state when props change (e.g. after server revalidation)
    // useEffect(() => { setLocalGroups(groupedEvents); }, [groupedEvents]); 
    // ^ This might cause jitter if we are dragging. 
    // Let's just initialize state. If we need to sync, we can rely on key changes or manual refresh.
    // Actually, `activeEvent` logic needs to find the event in the props if we don't use state.

    // Let's stick with local state initialized from props, and update it on drag.
    // Re-validation will trigger a re-render of the parent, enabling a fresh `groupedEvents`.
    // We should probably sync it:
    if (JSON.stringify(Object.keys(groupedEvents)) !== JSON.stringify(Object.keys(localGroups))) {
        // Simple check if keys changed (dates changed/added). 
        // Deep compare is expensive. 
        // For MVP, handling state strictly locally during drag is enough.
    }

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const onDragStart = (event: DragStartEvent) => {
        const { active } = event;
        // Find the event in our groups
        let found = null;
        for (const group of Object.values(localGroups)) {
            const e = group.find((item: Event) => item.id === active.id);
            if (e) {
                found = e;
                break;
            }
        }
        if (found) setActiveEvent(found);
    };

    const onDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveEvent(null);

        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        // Find source event and its date
        let sourceDateKey = "";
        let activeEventData = null;

        for (const [date, events] of Object.entries(localGroups)) {
            const found = events.find((e: Event) => e.id === activeId);
            if (found) {
                sourceDateKey = date;
                activeEventData = found;
                break;
            }
        }

        if (!activeEventData) return;

        // Determine target date
        let targetDateKey = overId; // Assume dropped on a container (Date ID)

        // If dropped on another event, find that event's date
        // Note: overId will be the event ID if dropped on an event
        for (const [date, events] of Object.entries(localGroups)) {
            if (events.find((e: Event) => e.id === overId)) {
                targetDateKey = date;
                break;
            }
        }

        // If the target is not a valid date string (and not found as event), abort
        if (isNaN(Date.parse(targetDateKey))) return;

        // Calculate new start time
        const targetDate = parseISO(targetDateKey);
        const oldStart = new Date(activeEventData.startTime);

        // Preserve time, change date
        const newStart = new Date(targetDate);
        newStart.setHours(oldStart.getHours(), oldStart.getMinutes());

        // Optimistic Update
        const newGroups = { ...localGroups };

        // Remove from source
        newGroups[sourceDateKey] = newGroups[sourceDateKey].filter((e: Event) => e.id !== activeId);

        // Add to target
        const updatedEvent = {
            ...activeEventData,
            startTime: newStart, // Update internal Date for logic
            time: format(newStart, "HH:mm") // Update display time
        };

        if (!newGroups[targetDateKey]) newGroups[targetDateKey] = [];
        newGroups[targetDateKey].push(updatedEvent as unknown as Event);

        // Sort target group by time
        newGroups[targetDateKey].sort((a: Event, b: Event) => {
            return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
        });

        setLocalGroups(newGroups);

        // Server Update
        // Only update if date changed
        if (sourceDateKey !== targetDateKey) {
            try {
                await updateEvent(tripId, activeId, {
                    startDate: newStart,
                    startTime: format(newStart, "HH:mm"),
                });
                toast.success("Event moved");
            } catch {
                toast.error("Failed to move event");
                setLocalGroups(groupedEvents); // Revert
            }
        }
    };

    // Sort dates
    const sortedDates = Object.keys(localGroups).sort();

    const dropAnimation: DropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: '0.4',
                },
            },
        }),
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
        >
            <div className="space-y-8 pb-20">
                {sortedDates.map((dateKey) => (
                    <DayContainer
                        key={dateKey}
                        dateKey={dateKey}
                        count={localGroups[dateKey]?.length || 0}
                        tripId={tripId}
                    >
                        <SortableContext
                            items={localGroups[dateKey]?.map((e: Event) => e.id) || []}
                            strategy={verticalListSortingStrategy}
                        >
                            {localGroups[dateKey]?.map((event: Event) => (
                                <SortableTimelineEvent
                                    key={event.id}
                                    event={event}
                                    isDeleteLoading={isDeleteLoading}
                                    onDelete={handleDeleteEvent}
                                    onEdit={(e) => setSelectedEventToEdit(e)}
                                />
                            ))}
                        </SortableContext>
                    </DayContainer>
                ))}
            </div>

            <DragOverlay dropAnimation={dropAnimation}>
                {activeEvent ? (
                    <SortableTimelineEvent
                        event={activeEvent}
                        isDeleteLoading={null}
                        onDelete={() => { }}
                        onEdit={() => { }}
                    />
                ) : null}
            </DragOverlay>

            {selectedEventToEdit && (
                <EditEventSheet
                    event={selectedEventToEdit}
                    open={!!selectedEventToEdit}
                    onOpenChange={(open) => !open && setSelectedEventToEdit(null)}
                    tripId={tripId}
                />
            )}
        </DndContext>
    );
}
