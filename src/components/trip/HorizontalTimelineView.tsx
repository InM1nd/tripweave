"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import { format, parseISO } from "date-fns";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
    DndContext,
    DragOverlay,
    closestCenter,
    PointerSensor,
    TouchSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
    useDroppable,
    DragStartEvent,
    DragEndEvent,
    defaultDropAnimationSideEffects,
    CollisionDetection,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    sortableKeyboardCoordinates,
    arrayMove,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { updateEvent, deleteEvent } from "@/actions/event";
import { Button } from "@/components/ui/button";
import { AddEventModal } from "@/components/trip/AddEventModal";
import { BoardEventCard } from "@/components/trip/BoardEventCard";
import { MoveEventDialog } from "@/components/trip/MoveEventDialog";
import { cn } from "@/lib/utils";
import type { Event } from "@prisma/client";

const EditEventSheet = dynamic(
    () => import("@/components/trip/EditEventSheet").then(m => ({ default: m.EditEventSheet })),
    { ssr: false }
);

// ─── Sortable card wrapper ──────────────────────────────────────────────────

function SortableBoardCard({
    event,
    children,
}: {
    event: Event;
    children: React.ReactNode;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: event.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 50 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="group/card touch-none"
        >
            {children}
        </div>
    );
}

// ─── Droppable day column ───────────────────────────────────────────────────

function DroppableDayColumn({
    dateKey,
    children,
}: {
    dateKey: string;
    children: React.ReactNode;
}) {
    const { setNodeRef, isOver } = useDroppable({ id: dateKey });

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "flex-1 overflow-y-auto p-2.5 space-y-2 bg-background/50",
                "max-h-[calc(100vh-18rem)] min-h-[140px]",
                "transition-colors duration-150",
                isOver && "bg-primary/5"
            )}
        >
            {children}
        </div>
    );
}

// ─── Main component ─────────────────────────────────────────────────────────

interface PendingMove {
    event: Event;
    sourceDateKey: string;
    targetDateKey: string;
    currentTime: string;
    previousGroups: Record<string, Event[]>;
}

interface HorizontalTimelineViewProps {
    groupedEvents: Record<string, Event[]>;
    tripId: string;
}

export function HorizontalTimelineView({ groupedEvents, tripId }: HorizontalTimelineViewProps) {
    const [localGroups, setLocalGroups] = useState(groupedEvents);
    const [activeEvent, setActiveEvent] = useState<Event | null>(null);
    const [selectedEventToEdit, setSelectedEventToEdit] = useState<Event | null>(null);
    const [isDeleteLoading, setIsDeleteLoading] = useState<string | null>(null);
    const [pendingMove, setPendingMove] = useState<PendingMove | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const wasDraggingRef = useRef(false);

    useEffect(() => {
        setLocalGroups(groupedEvents);
    }, [groupedEvents]);

    const sortedDates = Object.keys(localGroups).sort();

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

    // ── Collision detection ──────────────────────────────────────────────────
    // Prefer event cards over day containers, same pattern as vertical view.

    const dayKeySet = useMemo(() => new Set(Object.keys(localGroups)), [localGroups]);

    const collisionDetection: CollisionDetection = useCallback((args) => {
        const collisions = closestCenter(args);
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

        const newGroups = { ...localGroups };
        newGroups[sourceDateKey] = newGroups[sourceDateKey].filter((e: Event) => e.id !== eventId);
        const updatedEvent = { ...eventData, startTime: newStart };
        if (!newGroups[targetDateKey]) newGroups[targetDateKey] = [];
        newGroups[targetDateKey] = [...newGroups[targetDateKey], updatedEvent as unknown as Event].sort(
            (a: Event, b: Event) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
        setLocalGroups(newGroups);

        setPendingMove({
            event: eventData,
            sourceDateKey,
            targetDateKey,
            currentTime: format(oldStart, "HH:mm"),
            previousGroups,
        });
    }, [localGroups]);

    const handleReorderInDay = useCallback(async (eventId: string, direction: "up" | "down") => {
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

        const times = group.map((e: Event) => new Date(e.startTime));
        const reordered = arrayMove([...group], oldIndex, newIndex);
        const updatedGroup = reordered.map((ev: Event, idx: number) => ({
            ...ev,
            startTime: times[idx],
        }));

        setLocalGroups(prev => ({ ...prev, [dateKey]: updatedGroup }));

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

    const onDragStart = (e: DragStartEvent) => {
        wasDraggingRef.current = true;
        const { active } = e;
        for (const group of Object.values(localGroups)) {
            const found = group.find((ev: Event) => ev.id === active.id);
            if (found) { setActiveEvent(found); break; }
        }
    };

    const onDragEnd = async (e: DragEndEvent) => {
        const { active, over } = e;
        setActiveEvent(null);
        // Clear drag flag after browser fires the residual click
        requestAnimationFrame(() => { wasDraggingRef.current = false; });
        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;
        if (activeId === overId) return;

        // Find source
        let sourceDateKey = "";
        let activeEventData: Event | null = null;
        for (const [date, events] of Object.entries(localGroups)) {
            const found = events.find((ev: Event) => ev.id === activeId);
            if (found) { sourceDateKey = date; activeEventData = found; break; }
        }
        if (!activeEventData) return;

        // Determine target day
        let targetDateKey = overId;
        for (const [date, events] of Object.entries(localGroups)) {
            if (events.find((ev: Event) => ev.id === overId)) { targetDateKey = date; break; }
        }
        if (isNaN(Date.parse(targetDateKey))) return;

        // ── Same-day reorder ─────────────────────────────────────────────
        if (sourceDateKey === targetDateKey) {
            const group = localGroups[sourceDateKey] ?? [];
            const oldIndex = group.findIndex((ev: Event) => ev.id === activeId);
            const overIndex =
                overId === sourceDateKey
                    ? group.length - 1
                    : group.findIndex((ev: Event) => ev.id === overId);

            if (oldIndex === -1 || overIndex === -1 || oldIndex === overIndex) return;

            const times = group.map((ev: Event) => new Date(ev.startTime));
            const reordered = arrayMove([...group], oldIndex, overIndex);
            const updatedGroup = reordered.map((ev: Event, idx: number) => ({
                ...ev,
                startTime: times[idx],
            }));

            setLocalGroups({ ...localGroups, [sourceDateKey]: updatedGroup });

            const changed = updatedGroup.filter((ev: Event) => {
                const orig = group.find((o: Event) => o.id === ev.id);
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
            return;
        }

        // ── Cross-day move → show time picker dialog ─────────────────────
        const previousGroups = { ...localGroups };
        const targetDate = parseISO(targetDateKey);
        const oldStart = new Date(activeEventData.startTime);
        const newStart = new Date(targetDate);
        newStart.setHours(oldStart.getHours(), oldStart.getMinutes());

        const newGroups = { ...localGroups };
        newGroups[sourceDateKey] = newGroups[sourceDateKey].filter((ev: Event) => ev.id !== activeId);
        const updatedEvent = { ...activeEventData, startTime: newStart };
        if (!newGroups[targetDateKey]) newGroups[targetDateKey] = [];
        newGroups[targetDateKey] = [...newGroups[targetDateKey], updatedEvent as unknown as Event].sort(
            (a: Event, b: Event) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
        setLocalGroups(newGroups);

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
            setLocalGroups(prev => {
                const updated = { ...prev };
                if (updated[targetDateKey]) {
                    updated[targetDateKey] = updated[targetDateKey].map((ev: Event) =>
                        ev.id === movedEvent.id ? { ...ev, startTime: newStart } as unknown as Event : ev
                    ).sort(
                        (a: Event, b: Event) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
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

    // ── Render ────────────────────────────────────────────────────────────────

    const dropAnimation = {
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
                {/* Board container — ticket-strip style */}
                <div className="relative rounded-2xl border-2 border-border bg-card shadow-sticker-card overflow-hidden">
                    {/* Top decorative strip */}
                    <div className="h-2 bg-primary/15 border-b-2 border-border" />

                    {/* Horizontal scroll area */}
                    <div
                        ref={scrollRef}
                        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth"
                    >
                        {sortedDates.map((dateKey, colIdx) => {
                            const date = new Date(dateKey);
                            const events = localGroups[dateKey] ?? [];
                            const isLast = colIdx === sortedDates.length - 1;

                            return (
                                <div
                                    key={dateKey}
                                    className={cn(
                                        "flex-none w-72 sm:w-80 snap-start flex flex-col",
                                        !isLast && "border-r-2 border-dashed border-border"
                                    )}
                                >
                                    {/* Day header — ticket stub */}
                                    <div className="px-3 py-3 bg-muted/20 border-b-2 border-border shrink-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <div className="h-11 w-11 rounded-2xl bg-primary/10 border-2 border-border flex flex-col items-center justify-center shrink-0 shadow-sticker-badge">
                                                    <span className="text-lg font-black text-foreground leading-none">
                                                        {date.getDate()}
                                                    </span>
                                                    <span className="text-[7px] text-muted-foreground font-bold uppercase tracking-widest">
                                                        {date.toLocaleDateString("en-US", { month: "short" })}
                                                    </span>
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="font-black text-sm text-foreground truncate tracking-tight">
                                                        {date.toLocaleDateString("en-US", { weekday: "long" })}
                                                    </h3>
                                                    <p className="text-[11px] font-bold text-muted-foreground">
                                                        {events.length} {events.length === 1 ? "activity" : "activities"}
                                                    </p>
                                                </div>
                                            </div>
                                            <AddEventModal tripId={tripId} defaultDate={date}>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-full border-2 border-border bg-card shadow-sticker-badge hover:shadow-sticker-sm hover:-translate-y-px transition-all shrink-0"
                                                >
                                                    <Plus className="h-3.5 w-3.5" strokeWidth={3} />
                                                </Button>
                                            </AddEventModal>
                                        </div>
                                    </div>

                                    {/* Droppable + scrollable event list */}
                                    <DroppableDayColumn dateKey={dateKey}>
                                        <SortableContext
                                            items={events.map((ev: Event) => ev.id)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            {events.length === 0 && (
                                                <div className="flex flex-col items-center justify-center h-28 gap-1.5">
                                                    <div className="h-8 w-8 rounded-full bg-muted/50 border-2 border-dashed border-border flex items-center justify-center">
                                                        <Plus className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={2.5} />
                                                    </div>
                                                    <span className="text-[11px] font-bold text-muted-foreground/60">
                                                        No events yet
                                                    </span>
                                                </div>
                                            )}
                                            {events.map((event: Event, idx: number) => (
                                                <SortableBoardCard key={event.id} event={event}>
                                                    <BoardEventCard
                                                        event={event}
                                                        isDeleteLoading={isDeleteLoading}
                                                        onDelete={handleDeleteEvent}
                                                        onEdit={(ev) => { if (!wasDraggingRef.current) setSelectedEventToEdit(ev); }}
                                                        onMoveToDay={handleMoveToDay}
                                                        onReorderInDay={handleReorderInDay}
                                                        availableDays={sortedDates}
                                                        eventIndex={idx}
                                                        dayEventCount={events.length}
                                                    />
                                                </SortableBoardCard>
                                            ))}
                                        </SortableContext>
                                    </DroppableDayColumn>
                                </div>
                            );
                        })}
                    </div>

                    {/* Bottom decorative strip */}
                    <div className="h-1.5 bg-primary/10 border-t-2 border-border" />
                </div>

                <DragOverlay dropAnimation={dropAnimation}>
                    {activeEvent ? (
                        <div className="w-72 sm:w-80 opacity-90">
                            <BoardEventCard
                                event={activeEvent}
                                isDeleteLoading={null}
                                onDelete={() => {}}
                                onEdit={() => {}}
                                availableDays={[]}
                                eventIndex={0}
                                dayEventCount={1}
                            />
                        </div>
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
