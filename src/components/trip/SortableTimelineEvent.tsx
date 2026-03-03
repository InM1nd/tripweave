import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Event } from "@prisma/client";
import { GripVertical, MapPin, Navigation, DollarSign, Clock, ExternalLink, MoreHorizontal, Pencil, Trash2, AlignLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SortableTimelineEventProps {
    event: Event;
    isDeleteLoading: string | null;
    onDelete: (eventId: string) => void;
    onEdit: (event: Event) => void;
    currentUserId?: string;
}

const eventTypeColors: Record<string, { dot: string; border: string; badge: string }> = {
    TRANSPORT: { dot: "bg-teal", border: "border-l-teal", badge: "bg-teal/15 text-teal dark:bg-blue-950 dark:text-blue-300" },
    HOTEL: { dot: "bg-violet", border: "border-l-violet", badge: "bg-violet/15 text-violet dark:bg-purple-950 dark:text-purple-300" },
    ACTIVITY: { dot: "bg-accent]", border: "border-l-[var(--color-electric)]", badge: "bg-accent]/15 text-accent]" },
    RESTAURANT: { dot: "bg-orange-500", border: "border-l-orange-500", badge: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300" },
    OTHER: { dot: "bg-gray-500", border: "border-l-gray-500", badge: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
};

export function SortableTimelineEvent({ event, isDeleteLoading, onDelete, onEdit, currentUserId }: SortableTimelineEventProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: event.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 1,
    };

    const hasWriteAccess = event.createdBy === currentUserId; // simplified access check

    const formatTimeInfo = (date: Date) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "relative pl-6 sm:pl-8 py-2 md:py-3 group",
                isDragging && "opacity-50"
            )}
        >
            {/* Timeline connector visual element */}
            <div className="absolute left-1.5 sm:left-[11px] top-6 bottom-[-1.5rem] w-px bg-border group-last:bottom-0" />

            {/* Timeline dot */}
            <div className={cn(
                "absolute left-0 sm:left-1 top-6 sm:top-[26px] h-3.5 w-3.5 rounded-full border-2 border-background z-10",
                eventTypeColors[event.type]?.dot || "bg-gray-400"
            )} />

            <Card className={cn(
                "overflow-hidden transition-all duration-200 border-l-4 group-hover:shadow-md bg-card/60 backdrop-blur-sm",
                eventTypeColors[event.type]?.border || "border-l-gray-400",
                isDragging && "shadow-xl ring-2 ring-primary/20 cursor-grabbing"
            )}>
                <CardContent className="p-0 flex flex-col sm:flex-row items-stretch min-h-[4rem]">
                    {/* Draggable Handle */}
                    <div
                        {...attributes}
                        {...listeners}
                        className="flex sm:w-8 items-center justify-center bg-muted/30 cursor-grab hover:bg-muted/50 transition-colors py-1 sm:py-0 border-b sm:border-b-0 sm:border-r border-border/50"
                    >
                        <GripVertical className="h-4 w-4 text-muted-foreground/50" />
                    </div>

                    <div className="flex-1 p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center min-w-0">
                        {/* Time & Type Column */}
                        <div className="flex sm:flex-col items-center sm:items-start justify-between sm:justify-center w-full sm:w-28 shrink-0 gap-2 sm:gap-1 pl-1">
                            <Badge variant="outline" className={cn(
                                "text-[10px] uppercase font-bold tracking-wider rounded-sm px-1.5 py-0 h-5 border-0 flex items-center justify-center shrink-0",
                                eventTypeColors[event.type]?.badge || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                            )}>
                                {event.type}
                            </Badge>
                            <div className="flex items-center text-sm font-semibold whitespace-nowrap text-foreground/90">
                                <Clock className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                                {formatTimeInfo(event.startTime)}
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <h4 className="font-bold text-base leading-tight truncate text-foreground/90 group-hover:text-foreground transition-colors">
                                {event.title}
                            </h4>

                            {(event.location || event.description) && (
                                <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-xs text-muted-foreground">
                                    {event.location && (
                                        <div className="flex items-center gap-1 min-w-0 truncate">
                                            <MapPin className="h-3 w-3 shrink-0" />
                                            <span className="truncate">{event.location}</span>
                                        </div>
                                    )}
                                    {event.description && (
                                        <div className="hidden sm:flex items-center gap-1 min-w-0 truncate">
                                            <AlignLeft className="h-3 w-3 shrink-0" />
                                            <span className="truncate">{event.description}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Actions & Meta */}
                        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 sm:border-l border-border/50 sm:pl-4 shrink-0 gap-2">
                            {event.cost ? (
                                <div className="flex items-center text-sm font-medium px-2 py-0.5 rounded-full bg-success]/10 text-success]">
                                    {event.currency} {event.cost.toLocaleString()}
                                </div>
                            ) : <div />}

                            <div className="flex items-center gap-1">
                                {event.url && (
                                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-sm relative group/btn" asChild>
                                        <a href={event.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                                            <ExternalLink className="h-3.5 w-3.5" />
                                            <span className="absolute -top-8 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                Open Link
                                            </span>
                                        </a>
                                    </Button>
                                )}

                                {(event.location || event.address) && (
                                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-sm relative group/btn text-violet-500 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-500/10" asChild>
                                        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location || event.address || event.title)}`} target="_blank" rel="noopener noreferrer">
                                            <MapPin className="h-3.5 w-3.5" />
                                            <span className="absolute -top-8 right-0 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                Open in Maps
                                            </span>
                                        </a>
                                    </Button>
                                )}

                                {hasWriteAccess && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-sm hover:bg-muted">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Actions</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-40">
                                            <DropdownMenuItem onClick={() => onEdit(event)}>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit Event
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="text-destructive focus:bg-destructive focus:text-destructive-foreground focus:outline-none"
                                                disabled={isDeleteLoading === event.id}
                                                onSelect={(e) => {
                                                    e.preventDefault();
                                                    onDelete(event.id);
                                                }}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                {isDeleteLoading === event.id ? "Deleting..." : "Delete"}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
