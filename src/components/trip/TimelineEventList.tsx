"use client";

import { useState, useRef, useCallback, useMemo, useEffect } from "react";
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
import {
    SortableContext,
    verticalListSortingStrategy,
    sortableKeyboardCoordinates,
    arrayMove
} from "@dnd-kit/sortable";
import { motion, AnimatePresence } from "framer-motion";
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
import { DayTimelineContext } from "./DayTimelineContext";
import { getEventTypeDotHex } from "@/lib/design-tokens";

interface TimelineEventListProps {
    groupedEvents: Record<string, Event[]>;
    tripId: string;
}

function DayContainer({
    dateKey,
    count,
    children,
    tripId,
}: {
    dateKey: string;
    count: number;
    children: React.ReactNode;
    tripId: string;
}) {
    const date = new Date(dateKey);
    const { setNodeRef, isOver } = useDroppable({ id: dateKey, data: { date } });
    const lineRef = useRef<HTMLDivElement>(null);
    const [dotState, setDotState] = useState<{ y: number; color: string } | null>(null);

    const onHover = useCallback((type: string, el: HTMLElement) => {
        const lineRect = lineRef.current?.getBoundingClientRect();
        if (!lineRect) return;
        const elRect = el.getBoundingClientRect();
        // Center dot on the card; 10 = half of the 20px dot height
        const y = elRect.top - lineRect.top + elRect.height / 2 - 10;
        setDotState({ y, color: getEventTypeDotHex(type) });
    }, []);

    const onLeave = useCallback(() => setDotState(null), []);

    // Stable context value — only recreates when callbacks change (they don't)
    const ctxValue = useMemo(
        () => ({ lineRef, onHover, onLeave }),
        [onHover, onLeave]
    );

    return (
        <DayTimelineContext.Provider value={ctxValue}>
            <div
                ref={setNodeRef}
                className={cn(
                    "relative transition-colors rounded-xl p-2 -m-2",
                    isOver && "bg-primary/5"
                )}
            >
                {/* Sticky date header — below header on mobile, below tabs on desktop */}
                <div
                    className="flex items-center justify-between gap-2 sm:gap-3 mb-3 sm:mb-4 sticky z-10 bg-background py-2 sm:py-3 border-b border-border/40 min-w-0"
                    style={{ top: "var(--trip-tabs-offset, 4.5rem)" }}
                >
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">
                        <div className="h-9 w-9 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-primary/10 border-2 border-border flex flex-col items-center justify-center shrink-0 shadow-sticker-sm">
                            <span className="text-base sm:text-xl font-bold text-foreground leading-none">
                                {date.getDate()}
                            </span>
                            <span className="text-[8px] sm:text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                                {date.toLocaleDateString("en-US", { month: "short" })}
                            </span>
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-bold text-sm sm:text-lg text-foreground truncate">
                                {date.toLocaleDateString("en-US", { weekday: "long" })}
                            </h3>
                            <p className="text-[11px] sm:text-sm font-medium text-muted-foreground">
                                {count} {count === 1 ? "activity" : "activities"}
                            </p>
                        </div>
                    </div>

                    <AddEventModal tripId={tripId} defaultDate={date}>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 sm:gap-2 h-8 sm:h-9 rounded-full border-2 border-border bg-card text-foreground text-xs sm:text-sm font-bold shadow-sticker-sm hover:-translate-y-px hover:shadow-sticker-card transition-all shrink-0"
                        >
                            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.5} />
                            <span className="hidden sm:inline">Add Event</span>
                        </Button>
                    </AddEventModal>
                </div>

                {/* Vertical timeline line */}
                <div
                    ref={lineRef}
                    className="ml-2 pl-3 sm:ml-6 sm:pl-6 border-l-2 border-border/50 space-y-2 sm:space-y-3 min-h-[40px] sm:min-h-[50px] relative"
                >
                    <AnimatePresence>
                        {dotState && (
                            <motion.div
                                key="timeline-dot"
                                initial={{
                                    opacity: 0,
                                    scale: 0,
                                    backgroundColor: dotState.color,
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    y: dotState.y,
                                    backgroundColor: dotState.color,
                                }}
                                exit={{ opacity: 0, scale: 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                                className="absolute -left-2.5 top-0 w-5 h-5 rounded-full border-2 border-border shadow-sticker-badge z-20 pointer-events-none"
                            />
                        )}
                    </AnimatePresence>
                    {children}
                </div>
            </div>
        </DayTimelineContext.Provider>
    );
}

export function TimelineEventList({ groupedEvents, tripId }: TimelineEventListProps) {
    const [localGroups, setLocalGroups] = useState(groupedEvents);
    const [activeEvent, setActiveEvent] = useState<Event | null>(null);
    const [selectedEventToEdit, setSelectedEventToEdit] = useState<Event | null>(null);
    const [isDeleteLoading, setIsDeleteLoading] = useState<string | null>(null);

    // Sync local state when server sends fresh data (e.g. after router.refresh() from Add/Edit)
    useEffect(() => {
        setLocalGroups(groupedEvents);
    }, [groupedEvents]);

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

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const onDragStart = (event: DragStartEvent) => {
        const { active } = event;
        let found: Event | null = null;
        for (const group of Object.values(localGroups)) {
            const e = group.find((item: Event) => item.id === active.id);
            if (e) { found = e; break; }
        }
        if (found) setActiveEvent(found);
    };

    const onDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveEvent(null);
        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;
        if (activeId === overId) return;

        // Find source event
        let sourceDateKey = "";
        let activeEventData: Event | null = null;
        for (const [date, events] of Object.entries(localGroups)) {
            const found = events.find((e: Event) => e.id === activeId);
            if (found) { sourceDateKey = date; activeEventData = found; break; }
        }
        if (!activeEventData) return;

        // Determine target date key (could be a dateKey or an event id)
        let targetDateKey = overId;
        for (const [date, events] of Object.entries(localGroups)) {
            if (events.find((e: Event) => e.id === overId)) { targetDateKey = date; break; }
        }
        if (isNaN(Date.parse(targetDateKey))) return;

        // ── Same-day reorder ──────────────────────────────────────────────
        if (sourceDateKey === targetDateKey) {
            const group = localGroups[sourceDateKey] ?? [];
            const oldIndex = group.findIndex((e: Event) => e.id === activeId);
            // If dropped on the container (not an event), move to end
            const overIndex =
                overId === sourceDateKey
                    ? group.length - 1
                    : group.findIndex((e: Event) => e.id === overId);

            if (oldIndex === -1 || overIndex === -1 || oldIndex === overIndex) return;

            // Redistribute the original time slots to the new order
            const times = group.map((e: Event) => new Date(e.startTime));
            const reordered = arrayMove([...group], oldIndex, overIndex);
            const updatedGroup = reordered.map((ev: Event, idx: number) => ({
                ...ev,
                startTime: times[idx],
            }));

            setLocalGroups({ ...localGroups, [sourceDateKey]: updatedGroup });

            // Only persist events whose time actually changed
            const changed = updatedGroup.filter((ev: Event) => {
                const orig = group.find((e: Event) => e.id === ev.id);
                return (
                    orig &&
                    new Date(orig.startTime).getTime() !==
                    new Date(ev.startTime).getTime()
                );
            });

            if (changed.length > 0) {
                try {
                    await Promise.all(
                        changed.map((ev: Event) =>
                            updateEvent(tripId, ev.id, {
                                startDate: new Date(ev.startTime),
                                startTime: format(new Date(ev.startTime), "HH:mm"),
                            })
                        )
                    );
                } catch {
                    toast.error("Failed to reorder events");
                    setLocalGroups(groupedEvents);
                }
            }
            return;
        }

        // ── Cross-day move ────────────────────────────────────────────────
        const targetDate = parseISO(targetDateKey);
        const oldStart = new Date(activeEventData.startTime);
        const newStart = new Date(targetDate);
        newStart.setHours(oldStart.getHours(), oldStart.getMinutes());

        const newGroups = { ...localGroups };
        newGroups[sourceDateKey] = newGroups[sourceDateKey].filter(
            (e: Event) => e.id !== activeId
        );
        const updatedEvent = {
            ...activeEventData,
            startTime: newStart,
            time: format(newStart, "HH:mm"),
        };
        if (!newGroups[targetDateKey]) newGroups[targetDateKey] = [];
        newGroups[targetDateKey].push(updatedEvent as unknown as Event);
        newGroups[targetDateKey].sort(
            (a: Event, b: Event) =>
                new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
        setLocalGroups(newGroups);

        try {
            await updateEvent(tripId, activeId, {
                startDate: newStart,
                startTime: format(newStart, "HH:mm"),
            });
            toast.success("Event moved");
        } catch {
            toast.error("Failed to move event");
            setLocalGroups(groupedEvents);
        }
    };

    const sortedDates = Object.keys(localGroups).sort();

    const dropAnimation: DropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: { active: { opacity: "0.4" } },
        }),
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
        >
            <div className="space-y-6 sm:space-y-8 pb-20 min-w-0">
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
                        onDelete={() => {}}
                        onEdit={() => {}}
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
