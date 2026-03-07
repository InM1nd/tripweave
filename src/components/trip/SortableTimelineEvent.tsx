import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Event } from "@prisma/client";
import { GripVertical, MapPin, Clock, ExternalLink, MoreHorizontal, Pencil, Trash2, AlignLeft } from "lucide-react";
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

const eventTypeColors: Record<string, { bg: string; dot: string }> = {
    TRANSPORT: { bg: "bg-[#A3D5DF] text-foreground", dot: "bg-[#A3D5DF] border-foreground" },
    HOTEL: { bg: "bg-[#CE9CCC] text-foreground", dot: "bg-[#CE9CCC] border-foreground" },
    ACTIVITY: { bg: "bg-[#FFCF54] text-foreground", dot: "bg-[#FFCF54] border-foreground" },
    RESTAURANT: { bg: "bg-[#FF8A5B] text-foreground", dot: "bg-[#FF8A5B] border-foreground" },
    OTHER: { bg: "bg-[#9CB082] text-foreground", dot: "bg-[#9CB082] border-foreground" },
};

export function SortableTimelineEvent({ event, isDeleteLoading, onDelete, onEdit, currentUserId }: SortableTimelineEventProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: event.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 1,
    };

    const hasWriteAccess = event.createdBy === currentUserId || true; // Allow delete for demo

    const formatTimeInfo = (date: Date) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const theme = eventTypeColors[event.type] || eventTypeColors.OTHER;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "relative pl-8 sm:pl-12 py-3 group",
                isDragging && "opacity-50"
            )}
        >
            {/* Timeline connector visual element */}
            <div className="absolute left-3.5 sm:left-[19px] top-8 bottom-[-1.5rem] w-1 bg-foreground/10 group-last:bottom-0" />

            {/* Timeline dot */}
            <div className={cn(
                "absolute left-1.5 sm:left-[11px] top-[40px] h-5 w-5 rounded-full border-4 z-10",
                theme.dot
            )} />

            <div className={cn(
                "overflow-hidden transition-all duration-300 rounded-[20px] border-4 border-transparent flex flex-col sm:flex-row hover:-translate-y-1 min-h-[5rem]",
                theme.bg,
                isDragging && "shadow-none ring-4 ring-foreground cursor-grabbing scale-[1.02]"
            )}>
                {/* Draggable Handle */}
                <div
                    {...attributes}
                    {...listeners}
                    className="flex sm:w-10 items-center justify-center bg-foreground/10 cursor-grab hover:bg-foreground/20 transition-colors py-2 sm:py-0 border-b-4 sm:border-b-0 sm:border-r-4 border-transparent"
                >
                    <GripVertical className="h-6 w-6 text-foreground/50" strokeWidth={3} />
                </div>

                <div className="flex-1 p-3 sm:p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center min-w-0">
                    {/* Time & Type Column */}
                    <div className="flex sm:flex-col items-center sm:items-start justify-between sm:justify-center w-full sm:w-32 shrink-0 gap-2 sm:gap-1">
                        <div className="text-[11px] uppercase font-bold tracking-widest rounded-sm px-2 py-1 bg-foreground/10 flex items-center justify-center">
                            {event.type}
                        </div>
                        <div className="flex items-center text-sm md:text-xs font-bold whitespace-nowrap opacity-90">
                            <Clock className="w-5 h-5 mr-1.5" strokeWidth={2.5} />
                            {formatTimeInfo(event.startTime)}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                        <h4 className="font-bold text-xl md:text-lg leading-tight truncate">
                            {event.title}
                        </h4>

                        {(event.location || event.description) && (
                            <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm font-semibold opacity-80">
                                {event.location && (
                                    <div className="flex items-center gap-1.5 min-w-0 truncate">
                                        <MapPin className="h-4 w-4 shrink-0" strokeWidth={3} />
                                        <span className="truncate">{event.location}</span>
                                    </div>
                                )}
                                {event.description && (
                                    <div className="hidden sm:flex items-center gap-1.5 min-w-0 truncate">
                                        <AlignLeft className="h-4 w-4 shrink-0" strokeWidth={3} />
                                        <span className="truncate">{event.description}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Actions & Meta */}
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t-4 sm:border-t-0 sm:border-l-4 border-foreground/10 sm:pl-5 shrink-0 gap-3">
                        {event.cost ? (
                            <div className="flex items-center text-sm font-bold px-3 py-1 rounded-md bg-[#1a1a1a] text-white dark:bg-neutral-200 dark:text-neutral-900">
                                {event.currency} {event.cost.toLocaleString()}
                            </div>
                        ) : <div />}

                        <div className="flex items-center gap-2">
                            {event.url && (
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-foreground/10 text-foreground shadow-none transition-none" asChild>
                                    <a href={event.url} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="h-5 w-5" strokeWidth={2.5} />
                                    </a>
                                </Button>
                            )}

                            {(event.location || event.address) && (
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-foreground/10 text-foreground shadow-none transition-none" asChild>
                                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location || event.address || event.title)}`} target="_blank" rel="noopener noreferrer">
                                        <MapPin className="h-5 w-5" strokeWidth={2.5} />
                                    </a>
                                </Button>
                            )}

                            {hasWriteAccess && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-foreground/10 text-foreground shadow-none transition-none">
                                            <MoreHorizontal className="h-5 w-5" strokeWidth={2.5} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-40 font-bold border-4 border-transparent shadow-none rounded-xl">
                                        <DropdownMenuItem onClick={() => onEdit(event)} className="cursor-pointer focus:bg-muted">
                                            <Pencil className="mr-2 h-4 w-4" strokeWidth={2.5} />
                                            Edit Event
                                        </DropdownMenuItem>
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
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
