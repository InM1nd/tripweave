"use client";

import { useState } from "react";
import { CalendarPlus, Check, Loader2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { promoteSuggestedToTimeline } from "@/actions/event";
import { toast } from "sonner";
import { format, eachDayOfInterval, isValid } from "date-fns";
import { cn } from "@/lib/utils";

interface AssignToDayPopoverProps {
    tripId: string;
    eventId: string;
    tripStartDate: Date | string | null;
    tripEndDate: Date | string | null;
}

export function AssignToDayPopover({ tripId, eventId, tripStartDate, tripEndDate }: AssignToDayPopoverProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [assignedDay, setAssignedDay] = useState<string | null>(null);

    const start = tripStartDate ? new Date(tripStartDate) : null;
    const end = tripEndDate ? new Date(tripEndDate) : null;
    const hasDates = start && end && isValid(start) && isValid(end);

    const days = hasDates ? eachDayOfInterval({ start, end }) : [];

    const handleAssign = async (day: Date) => {
        setIsLoading(true);
        try {
            const result = await promoteSuggestedToTimeline(tripId, eventId, day);
            if (result.success) {
                setAssignedDay(day.toISOString());
                toast.success(`Added to ${format(day, "EEE, MMM d")}!`);
                setOpen(false);
            } else {
                toast.error("error" in result ? result.error : "Failed to assign day");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    className={cn(
                        "flex items-center justify-center min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 h-9 w-9 rounded-full font-black border-2 border-border shadow-sticker-sm hover:-translate-y-px hover:shadow-sticker-card transition-all touch-manipulation",
                        assignedDay ? "bg-sticker-green text-foreground" : "bg-foreground text-background"
                    )}
                    onClick={(e) => e.stopPropagation()}
                    title="Add to day"
                    aria-label="Add to day"
                >
                    {assignedDay ? <Check className="h-4 w-4" strokeWidth={3} /> : <CalendarPlus className="h-4 w-4" strokeWidth={3} />}
                </button>
            </PopoverTrigger>
            <PopoverContent
                className="w-52 p-2 border-2 border-border rounded-2xl shadow-sticker-card"
                onClick={(e) => e.stopPropagation()}
                align="start"
            >
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2 pb-2">Add to day</p>
                {isLoading && (
                    <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                )}
                {!isLoading && !hasDates && (
                    <p className="text-xs text-muted-foreground px-2 py-2">
                        Set trip dates to assign a day.
                    </p>
                )}
                {!isLoading && hasDates && days.length === 0 && (
                    <p className="text-xs text-muted-foreground px-2 py-2">No days in range.</p>
                )}
                {!isLoading && hasDates && (
                    <div className="flex flex-col gap-0.5 max-h-48 overflow-y-auto">
                        {days.map((day) => (
                            <button
                                key={day.toISOString()}
                                onClick={() => handleAssign(day)}
                                className="flex items-center gap-2 w-full text-left px-2.5 py-2 rounded-xl hover:bg-accent font-bold text-sm transition-colors"
                            >
                                <span className="text-xs font-black w-6 text-muted-foreground tabular-nums">
                                    {format(day, "d")}
                                </span>
                                <span>{format(day, "EEE, MMM d")}</span>
                            </button>
                        ))}
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
