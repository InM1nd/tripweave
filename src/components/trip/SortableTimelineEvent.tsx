import { useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Event } from "@prisma/client";
import {
    GripVertical,
    MapPin,
    Clock,
    ExternalLink,
    MoreHorizontal,
    Pencil,
    Trash2,
    AlignLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDayTimeline } from "./DayTimelineContext";
import { getEventTypeStyle } from "@/lib/design-tokens";

interface SortableTimelineEventProps {
    event: Event;
    isDeleteLoading: string | null;
    onDelete: (eventId: string) => void;
    onEdit: (event: Event) => void;
    currentUserId?: string;
}

export function SortableTimelineEvent({
    event,
    isDeleteLoading,
    onDelete,
    onEdit,
    currentUserId,
}: SortableTimelineEventProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: event.id });
    const cardRef = useRef<HTMLDivElement>(null);
    const ctx = useDayTimeline();

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 1,
    };

    const hasWriteAccess = event.createdBy === currentUserId || true;

    const formatTimeInfo = (date: Date) =>
        new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const theme = getEventTypeStyle(event.type);

    const handleMouseEnter = () => {
        if (ctx && cardRef.current) {
            ctx.onHover(event.type, cardRef.current);
        }
    };

    const handleMouseLeave = () => {
        ctx?.onLeave();
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn("relative py-2 group", isDragging && "opacity-50")}
        >
            <div
                ref={cardRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={cn(
                  "overflow-hidden transition-all duration-300 rounded-[20px] border-2 border-border flex flex-col sm:flex-row hover:-translate-y-1 min-h-20",
                  "shadow-sticker-card",
                  "hover:shadow-sticker-card-hover",
                  theme.card,
                    isDragging &&
                        "shadow-none ring-4 ring-foreground cursor-grabbing scale-[1.02]"
                )}
            >
                {/* Drag handle */}
                <div
                    {...attributes}
                    {...listeners}
                    className="flex sm:w-10 items-center justify-center bg-foreground/10 cursor-grab hover:bg-foreground/20 transition-colors py-3 sm:py-0 border-b-2 sm:border-b-0 sm:border-r-2 border-border"
                >
                    <GripVertical className="h-6 w-6 text-foreground/50" strokeWidth={3} />
                </div>

                <div className="flex-1 p-2.5 sm:p-4 flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center min-w-0">
                    {/* Time & Type column */}
                    <div className="flex sm:flex-col items-center sm:items-start justify-between sm:justify-center w-full sm:w-28 shrink-0 gap-1.5">
                        <div className="text-[10px] sm:text-[11px] uppercase font-bold tracking-widest rounded-lg px-1.5 sm:px-2 py-0.5 sm:py-1 bg-foreground/10 border border-foreground/10 flex items-center justify-center truncate max-w-[50%] sm:max-w-none">
                            {event.type}
                        </div>
                        <div className="flex items-center text-xs sm:text-sm font-bold whitespace-nowrap opacity-90">
                            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 shrink-0" strokeWidth={2.5} />
                            {formatTimeInfo(event.startTime)}
                        </div>
                    </div>

                    {/* Main content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                        <h4
                            className="font-bold text-base sm:text-lg leading-tight truncate"
                            title={event.title}
                        >
                            {event.title}
                        </h4>

                        {(event.location || event.description) && (
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 text-sm font-semibold opacity-80">
                                {event.location && (
                                    <div
                                        className="flex items-center gap-1.5 min-w-0 truncate"
                                        title={event.location}
                                    >
                                        <MapPin className="h-4 w-4 shrink-0" strokeWidth={3} />
                                        <span className="truncate">{event.location}</span>
                                    </div>
                                )}
                                {event.description && (
                                    <div
                                        className="hidden sm:flex items-center gap-1.5 min-w-0 truncate"
                                        title={event.description}
                                    >
                                        <AlignLeft className="h-4 w-4 shrink-0" strokeWidth={3} />
                                        <span className="truncate">{event.description}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Actions & Meta */}
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-1 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 sm:border-l-2 border-foreground/20 sm:pl-4 shrink-0 gap-1.5 sm:gap-2">
                        {event.cost && (
                            <div className="flex items-center text-sm font-bold px-3 py-1.5 rounded-lg bg-foreground text-background dark:bg-muted-foreground dark:text-muted shrink-0 border border-border/20">
                                {event.currency} {event.cost.toLocaleString()}
                            </div>
                        )}

                        <div className="flex items-center gap-1.5">
                            {event.url && (
                                <Button
                                    variant="stickerIcon"
                                    size="icon"
                                    asChild
                                >
                                    <a href={event.url} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="h-4 w-4" strokeWidth={2.5} />
                                    </a>
                                </Button>
                            )}

                            {(event.location || event.address) && (
                                <Button
                                    variant="stickerIcon"
                                    size="icon"
                                    asChild
                                >
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location || event.address || event.title)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <MapPin className="h-4 w-4" strokeWidth={2.5} />
                                    </a>
                                </Button>
                            )}

                            {hasWriteAccess && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="stickerIcon"
                                            size="icon"
                                        >
                                            <MoreHorizontal className="h-4 w-4" strokeWidth={2.5} />
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
                                            {isDeleteLoading === event.id
                                                ? "Deleting..."
                                                : "Delete"}
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
