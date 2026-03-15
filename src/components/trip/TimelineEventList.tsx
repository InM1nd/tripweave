"use client";

import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import {
    DndContext,
    DragOverlay,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
    defaultDropAnimationSideEffects,
    DropAnimation,
    useDroppable,
    CollisionDetection,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    sortableKeyboardCoordinates,
    arrayMove
} from "@dnd-kit/sortable";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO } from "date-fns";
import { SortableTimelineEvent } from "@/components/trip/SortableTimelineEvent";
import { MoveEventDialog } from "@/components/trip/MoveEventDialog";

const EditEventSheet = dynamic(
    () => import("@/components/trip/EditEventSheet").then(m => ({ default: m.EditEventSheet })),
    { ssr: false }
);
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

// ─── Pending cross-day move state ────────────────────────────────────────────

interface PendingMove {
    event: Event;
    sourceDateKey: string;
    targetDateKey: string;
    currentTime: string; // "HH:mm"
    /** Snapshot of groups before the optimistic move — used for cancel/rollback */
    previousGroups: Record<string, Event[]>;
}

// ─── DayContainer ────────────────────────────────────────────────────────────

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
        const y = elRect.top - lineRect.top + elRect.height / 2 - 10;
        setDotState({ y, color: getEventTypeDotHex(type) });
    }, []);

    const onLeave = useCallback(() => setDotState(null), []);

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
                    isOver && "bg-primary/5 ring-2 ring-primary/20 ring-inset"
                )}
            >
                {/* Sticky date header */}
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
                    className="pl-0 ml-0 sm:ml-6 sm:pl-6 sm:border-l-2 sm:border-border/50 space-y-2 sm:space-y-3 min-h-[40px] sm:min-h-[50px] relative"
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
                                className="absolute -left-2.5 top-0 w-5 h-5 rounded-full border-2 border-border shadow-sticker-badge z-20 pointer-events-none hidden sm:block"
                            />
                        )}
                    </AnimatePresence>
                    {children}
                </div>
            </div>
        </DayTimelineContext.Provider>
    );
}

// ─── TimelineEventList ───────────────────────────────────────────────────────

export function TimelineEventList({ groupedEvents, tripId }: TimelineEventListProps) {
    const [localGroups, setLocalGroups] = useState(groupedEvents);
    const [activeEvent, setActiveEvent] = useState<Event | null>(null);
    const [selectedEventToEdit, setSelectedEventToEdit] = useState<Event | null>(null);
    const [isDeleteLoading, setIsDeleteLoading] = useState<string | null>(null);
    const [pendingMove, setPendingMove] = useState<PendingMove | null>(null);

    // Sync local state when server sends fresh data
    useEffect(() => {
        setLocalGroups(groupedEvents);
    }, [groupedEvents]);

    // ── Sensors ──────────────────────────────────────────────────────────────

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        }),
        useSensor(TouchSensor, {
            activationConstraint: { delay: 200, tolerance: 6 },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // ── Custom collision detection ──────────────────────────────────────────
    // Day containers (useDroppable with dateKey ids) swallow collisions from
    // individual sortable event cards.  We run closestCenter on everything,
    // then strip out day-container hits whenever an event-card hit exists.
    // For cross-day drops onto empty days the day-container is the only hit,
    // so we keep it as a fallback.

    const dayKeySet = useMemo(() => new Set(Object.keys(localGroups)), [localGroups]);

    const collisionDetection: CollisionDetection = useCallback((args) => {
        const collisions = closestCenter(args);
        // Separate event-card collisions from day-container collisions
        const eventHits = collisions.filter((c) => !dayKeySet.has(c.id as string));
        return eventHits.length > 0 ? eventHits : collisions;
    }, [dayKeySet]);

    // ── Handlers ─────────────────────────────────────────────────────────────

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

    /** Move to day — used from dropdown menu on mobile as fallback for drag */
    const handleMoveToDay = useCallback((eventId: string, targetDateKey: string) => {
        let sourceDateKey = "";
        let eventData: Event | null = null;
        for (const [date, events] of Object.entries(localGroups)) {
            const found = events.find((e: Event) => e.id === eventId);
            if (found) { sourceDateKey = date; eventData = found; break; }
        }
        if (!eventData || sourceDateKey === targetDateKey) return;

        const previousGroups = { ...localGroups };
        const targetDate = parseISO(targetDateKey);
        const oldStart = new Date(eventData.startTime);
        const newStart = new Date(targetDate);
        newStart.setHours(oldStart.getHours(), oldStart.getMinutes());

        // Optimistic move
        const newGroups = { ...localGroups };
        newGroups[sourceDateKey] = newGroups[sourceDateKey].filter(
            (e: Event) => e.id !== eventId
        );
        const updatedEvent = { ...eventData, startTime: newStart };
        if (!newGroups[targetDateKey]) newGroups[targetDateKey] = [];
        newGroups[targetDateKey] = [...newGroups[targetDateKey], updatedEvent as unknown as Event].sort(
            (a: Event, b: Event) =>
                new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
        setLocalGroups(newGroups);

        // Show time picker dialog
        setPendingMove({
            event: eventData,
            sourceDateKey,
            targetDateKey,
            currentTime: format(oldStart, "HH:mm"),
            previousGroups,
        });
    }, [localGroups]);

    /** Reorder within a day — used from dropdown menu (Move up / Move down) */
    const handleReorderInDay = useCallback(async (eventId: string, direction: "up" | "down") => {
        // Find which day and index
        let dateKey = "";
        let group: Event[] = [];
        for (const [d, events] of Object.entries(localGroups)) {
            const idx = events.findIndex((e: Event) => e.id === eventId);
            if (idx !== -1) { dateKey = d; group = events; break; }
        }
        if (!dateKey || group.length < 2) return;

        const oldIndex = group.findIndex((e: Event) => e.id === eventId);
        const newIndex = direction === "up" ? oldIndex - 1 : oldIndex + 1;
        if (newIndex < 0 || newIndex >= group.length) return;

        // Swap times so visual order matches persisted order
        const times = group.map((e: Event) => new Date(e.startTime));
        const reordered = arrayMove([...group], oldIndex, newIndex);
        const updatedGroup = reordered.map((ev: Event, idx: number) => ({
            ...ev,
            startTime: times[idx],
        }));

        setLocalGroups(prev => ({ ...prev, [dateKey]: updatedGroup }));

        // Persist changed events
        const changed = updatedGroup.filter((ev: Event) => {
            const orig = group.find((e: Event) => e.id === ev.id);
            return orig && new Date(orig.startTime).getTime() !== new Date(ev.startTime).getTime();
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
    }, [localGroups, tripId, groupedEvents]);

    // ── Drag callbacks ───────────────────────────────────────────────────────

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

        // ── Same-day reorder ─────────────────────────────────────────────
        if (sourceDateKey === targetDateKey) {
            const group = localGroups[sourceDateKey] ?? [];
            const oldIndex = group.findIndex((e: Event) => e.id === activeId);
            const overIndex =
                overId === sourceDateKey
                    ? group.length - 1
                    : group.findIndex((e: Event) => e.id === overId);

            if (oldIndex === -1 || overIndex === -1 || oldIndex === overIndex) return;

            const times = group.map((e: Event) => new Date(e.startTime));
            const reordered = arrayMove([...group], oldIndex, overIndex);
            const updatedGroup = reordered.map((ev: Event, idx: number) => ({
                ...ev,
                startTime: times[idx],
            }));

            setLocalGroups({ ...localGroups, [sourceDateKey]: updatedGroup });

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

        // ── Cross-day move → show time picker dialog ─────────────────────
        const previousGroups = { ...localGroups };
        const targetDate = parseISO(targetDateKey);
        const oldStart = new Date(activeEventData.startTime);
        const newStart = new Date(targetDate);
        newStart.setHours(oldStart.getHours(), oldStart.getMinutes());

        // Optimistic UI update
        const newGroups = { ...localGroups };
        newGroups[sourceDateKey] = newGroups[sourceDateKey].filter(
            (e: Event) => e.id !== activeId
        );
        const updatedEvent = { ...activeEventData, startTime: newStart };
        if (!newGroups[targetDateKey]) newGroups[targetDateKey] = [];
        newGroups[targetDateKey] = [...newGroups[targetDateKey], updatedEvent as unknown as Event].sort(
            (a: Event, b: Event) =>
                new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
        setLocalGroups(newGroups);

        // Open dialog to confirm time
        setPendingMove({
            event: activeEventData,
            sourceDateKey,
            targetDateKey,
            currentTime: format(oldStart, "HH:mm"),
            previousGroups,
        });
    };

    // ── Move dialog callbacks ────────────────────────────────────────────────

    const confirmMove = async (time: string) => {
        if (!pendingMove) return;
        const { event: movedEvent, targetDateKey } = pendingMove;
        const targetDate = parseISO(targetDateKey);
        const [hours, minutes] = time.split(":").map(Number);
        const newStart = new Date(targetDate);
        newStart.setHours(hours, minutes, 0, 0);

        setPendingMove(null);

        try {
            await updateEvent(tripId, movedEvent.id, {
                startDate: newStart,
                startTime: time,
            });
            // Re-sort the target day with the confirmed time
            setLocalGroups(prev => {
                const updated = { ...prev };
                if (updated[targetDateKey]) {
                    updated[targetDateKey] = updated[targetDateKey].map((e: Event) =>
                        e.id === movedEvent.id ? { ...e, startTime: newStart } as unknown as Event : e
                    ).sort(
                        (a: Event, b: Event) =>
                            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
                    );
                }
                return updated;
            });
            toast.success("Event moved");
        } catch {
            toast.error("Failed to move event");
            setLocalGroups(groupedEvents);
        }
    };

    const cancelMove = () => {
        if (!pendingMove) return;
        setLocalGroups(pendingMove.previousGroups);
        setPendingMove(null);
    };

    // ── Render ───────────────────────────────────────────────────────────────

    const sortedDates = Object.keys(localGroups).sort();

    const dropAnimation: DropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: { active: { opacity: "0.4" } },
        }),
    };

    return (
        <>
            <DndContext
                sensors={sensors}
                collisionDetection={collisionDetection}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
            >
                <div className="space-y-6 sm:space-y-8 pb-0 md:pb-20 min-w-0 w-full">
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
                                {localGroups[dateKey]?.map((event: Event, idx: number) => (
                                    <SortableTimelineEvent
                                        key={event.id}
                                        event={event}
                                        isDeleteLoading={isDeleteLoading}
                                        onDelete={handleDeleteEvent}
                                        onEdit={(e) => setSelectedEventToEdit(e)}
                                        onMoveToDay={handleMoveToDay}
                                        onReorderInDay={handleReorderInDay}
                                        availableDays={sortedDates}
                                        eventIndex={idx}
                                        dayEventCount={localGroups[dateKey]?.length || 0}
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
                            availableDays={[]}
                            eventIndex={0}
                            dayEventCount={1}
                        />
                    ) : null}
                </DragOverlay>
            </DndContext>

            {selectedEventToEdit && (
                <EditEventSheet
                    event={selectedEventToEdit}
                    open={!!selectedEventToEdit}
                    onOpenChange={(open: boolean) => !open && setSelectedEventToEdit(null)}
                    tripId={tripId}
                />
            )}

            {pendingMove && (
                <MoveEventDialog
                    open
                    eventTitle={pendingMove.event.title}
                    targetDate={parseISO(pendingMove.targetDateKey)}
                    currentTime={pendingMove.currentTime}
                    onKeepTime={() => confirmMove(pendingMove.currentTime)}
                    onChangeTime={(newTime) => confirmMove(newTime)}
                    onCancel={cancelMove}
                />
            )}
        </>
    );
}
