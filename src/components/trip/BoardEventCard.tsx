"use client";

import { Event } from "@prisma/client";
import {
    MapPin,
    Clock,
    ExternalLink,
    MoreHorizontal,
    Pencil,
    Trash2,
    CalendarDays,
    ArrowUp,
    ArrowDown,
    Plane,
    Hotel,
    Utensils,
    Bus,
    Compass,
    Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, parseISO } from "date-fns";
import { getEventTypeStyle } from "@/lib/design-tokens";

// ─── Type → icon + label mapping ────────────────────────────────────────────

const EVENT_TYPE_META: Record<string, { icon: typeof Plane; label: string }> = {
    FLIGHT: { icon: Plane, label: "Flight" },
    HOTEL: { icon: Hotel, label: "Hotel" },
    RESTAURANT: { icon: Utensils, label: "Restaurant" },
    TRANSPORT: { icon: Bus, label: "Transport" },
    ACTIVITY: { icon: Compass, label: "Activity" },
    OTHER: { icon: Sparkles, label: "Other" },
};

function getTypeMeta(type: string) {
    return EVENT_TYPE_META[type] ?? EVENT_TYPE_META.OTHER;
}

// ─── Component ──────────────────────────────────────────────────────────────

interface BoardEventCardProps {
    event: Event;
    isDeleteLoading: string | null;
    onDelete: (eventId: string) => void;
    onEdit: (event: Event) => void;
    onMoveToDay?: (eventId: string, targetDateKey: string) => void;
    onReorderInDay?: (eventId: string, direction: "up" | "down") => void;
    availableDays: string[];
    eventIndex: number;
    dayEventCount: number;
}

export function BoardEventCard({
    event,
    isDeleteLoading,
    onDelete,
    onEdit,
    onMoveToDay,
    onReorderInDay,
    availableDays,
    eventIndex,
    dayEventCount,
}: BoardEventCardProps) {
    const theme = getEventTypeStyle(event.type);
    const typeMeta = getTypeMeta(event.type);
    const TypeIcon = typeMeta.icon;

    const formatTimeInfo = (date: Date) =>
        new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const hasEndTime = event.endTime && new Date(event.endTime).getTime() !== new Date(event.startTime).getTime();

    return (
        <div
            className={cn(
                "relative rounded-2xl border-2 border-border overflow-hidden transition-all cursor-pointer",
                "shadow-sticker-badge hover:shadow-sticker-sm hover:-translate-y-px",
                theme.card
            )}
            onClick={() => onEdit(event)}
        >
            {/* ── Content ───────────────────────────────────────────────── */}
            <div className="p-2.5 space-y-1.5">
                {/* Header row: type badge + menu */}
                <div className="flex items-center justify-between gap-1">
                    <span className="inline-flex items-center gap-1 text-[9px] uppercase font-black tracking-widest rounded-full px-2 py-0.5 bg-sticker-foreground/8 text-sticker-foreground leading-tight">
                        <TypeIcon className="h-2.5 w-2.5" strokeWidth={3} />
                        {typeMeta.label}
                    </span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 shrink-0 rounded-lg bg-sticker-foreground/10 hover:bg-sticker-foreground/20 opacity-0 group-hover/card:opacity-100 focus:opacity-100 transition-all"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <MoreHorizontal className="h-3.5 w-3.5 text-sticker-foreground" strokeWidth={3} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-40 font-bold border-2 border-border shadow-sticker-elevated rounded-xl"
                        >
                            <DropdownMenuItem
                                onClick={() => onEdit(event)}
                                className="cursor-pointer focus:bg-muted"
                            >
                                <Pencil className="mr-2 h-4 w-4" strokeWidth={2.5} />
                                Edit Event
                            </DropdownMenuItem>
                            {onMoveToDay && availableDays.length > 1 && (
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger className="cursor-pointer focus:bg-muted">
                                        <CalendarDays className="mr-2 h-4 w-4" strokeWidth={2.5} />
                                        Move to Day
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent className="font-bold border-2 border-border shadow-sticker-elevated rounded-xl max-h-60 overflow-y-auto">
                                        {availableDays
                                            .filter((d) => {
                                                const eventDateKey = format(new Date(event.startTime), "yyyy-MM-dd");
                                                return d !== eventDateKey;
                                            })
                                            .map((dateKey) => {
                                                const d = parseISO(dateKey);
                                                return (
                                                    <DropdownMenuItem
                                                        key={dateKey}
                                                        className="cursor-pointer focus:bg-muted"
                                                        onSelect={(e) => {
                                                            e.preventDefault();
                                                            onMoveToDay(event.id, dateKey);
                                                        }}
                                                    >
                                                        {format(d, "EEE, MMM d")}
                                                    </DropdownMenuItem>
                                                );
                                            })}
                                    </DropdownMenuSubContent>
                                </DropdownMenuSub>
                            )}
                            {onReorderInDay && dayEventCount > 1 && (
                                <>
                                    <DropdownMenuSeparator className="bg-foreground/10" />
                                    <DropdownMenuItem
                                        disabled={eventIndex === 0}
                                        className="cursor-pointer focus:bg-muted"
                                        onSelect={(e) => {
                                            e.preventDefault();
                                            onReorderInDay(event.id, "up");
                                        }}
                                    >
                                        <ArrowUp className="mr-2 h-4 w-4" strokeWidth={2.5} />
                                        Move Up
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        disabled={eventIndex === dayEventCount - 1}
                                        className="cursor-pointer focus:bg-muted"
                                        onSelect={(e) => {
                                            e.preventDefault();
                                            onReorderInDay(event.id, "down");
                                        }}
                                    >
                                        <ArrowDown className="mr-2 h-4 w-4" strokeWidth={2.5} />
                                        Move Down
                                    </DropdownMenuItem>
                                </>
                            )}
                            <DropdownMenuSeparator className="bg-foreground/10" />
                            <DropdownMenuItem
                                className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                                disabled={isDeleteLoading === event.id}
                                onSelect={(e) => {
                                    e.preventDefault();
                                    onDelete(event.id);
                                }}
                            >
                                <Trash2 className="mr-2 h-4 w-4" strokeWidth={2.5} />
                                {isDeleteLoading === event.id ? "Deleting..." : "Delete"}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                {/* Title */}
                <h4 className="font-black text-[13px] leading-snug line-clamp-2 text-sticker-foreground">
                    {event.title}
                </h4>

                {/* Time row */}
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-sticker-foreground/70">
                    <Clock className="w-3 h-3 shrink-0" strokeWidth={2.5} />
                    <span>{formatTimeInfo(event.startTime)}</span>
                    {hasEndTime && (
                        <>
                            <span className="text-sticker-foreground/40">→</span>
                            <span>{formatTimeInfo(event.endTime!)}</span>
                        </>
                    )}
                    {event.allDay && (
                        <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-sticker-foreground/8 text-sticker-foreground/60">
                            All day
                        </span>
                    )}
                </div>

                {/* Description */}
                {event.description && (
                    <p className="text-[11px] font-semibold text-sticker-foreground/55 line-clamp-2 leading-relaxed">
                        {event.description}
                    </p>
                )}

                {/* Location */}
                {event.location && (
                    <div className="flex items-center gap-1 text-[11px] font-bold text-sticker-foreground/70 min-w-0">
                        <MapPin className="h-3 w-3 shrink-0" strokeWidth={2.5} />
                        <span className="truncate">{event.location}</span>
                    </div>
                )}

                {/* ── Action pills ───────────────────────────────────────── */}
                {(event.url || event.location || event.address || (event.cost !== null && event.cost > 0)) && (
                    <div className="flex items-center flex-wrap gap-1 pt-1.5 border-t border-sticker-foreground/8">
                        {event.url && (
                            <a
                                href={event.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-[10px] font-black text-sticker-foreground px-2 py-0.5 rounded-full border-2 border-border bg-card shadow-sticker-badge hover:shadow-sticker-sm hover:-translate-y-px transition-all"
                            >
                                <ExternalLink className="h-2.5 w-2.5" strokeWidth={3} />
                                Source
                            </a>
                        )}
                        {(event.location || event.address) && (
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location || event.address || event.title)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-[10px] font-black text-sticker-foreground px-2 py-0.5 rounded-full border-2 border-border bg-card shadow-sticker-badge hover:shadow-sticker-sm hover:-translate-y-px transition-all"
                            >
                                <MapPin className="h-2.5 w-2.5" strokeWidth={3} />
                                Map
                            </a>
                        )}
                        {event.cost !== null && event.cost > 0 && (
                            <span className="inline-flex items-center text-[10px] font-black text-sticker-foreground px-2 py-0.5 rounded-full border-2 border-border bg-card shadow-sticker-badge ml-auto">
                                {event.currency} {event.cost.toLocaleString()}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
