"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Clock, CalendarDays, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface MoveEventDialogProps {
    open: boolean;
    eventTitle: string;
    targetDate: Date;
    currentTime: string; // "HH:mm"
    onKeepTime: () => void;
    onChangeTime: (newTime: string) => void;
    onCancel: () => void;
}

export function MoveEventDialog({
    open,
    eventTitle,
    targetDate,
    currentTime,
    onKeepTime,
    onChangeTime,
    onCancel,
}: MoveEventDialogProps) {
    const [selectedTime, setSelectedTime] = useState(currentTime);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const dayLabel = format(targetDate, "EEEE, MMM d");

    return (
        <Dialog open={open} onOpenChange={(v) => { if (!v) onCancel(); }}>
            <DialogContent className="sm:max-w-md border-2 border-border rounded-2xl shadow-sticker-modal p-0 overflow-hidden">
                {/* Header */}
                <div className="bg-primary/10 border-b-2 border-border px-5 pt-6 pb-4">
                    <DialogHeader className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="h-9 w-9 rounded-xl bg-primary/20 border-2 border-border flex items-center justify-center shadow-sticker-badge">
                                <CalendarDays className="h-4 w-4 text-primary" strokeWidth={2.5} />
                            </div>
                            <DialogTitle className="text-lg font-black tracking-tight">
                                Event Moved
                            </DialogTitle>
                        </div>
                        <DialogDescription className="text-sm font-bold text-muted-foreground">
                            <span className="font-black text-foreground">{eventTitle}</span>{" "}
                            moved to{" "}
                            <span className="font-black text-primary">{dayLabel}</span>
                        </DialogDescription>
                    </DialogHeader>
                </div>

                {/* Body */}
                <div className="p-5 space-y-4">
                    <p className="text-sm font-bold text-muted-foreground">
                        What time should this event be?
                    </p>

                    {/* Keep time option */}
                    <button
                        type="button"
                        onClick={() => { setShowTimePicker(false); }}
                        className={cn(
                            "w-full flex items-center gap-3 p-3 rounded-2xl border-2 transition-all text-left",
                            !showTimePicker
                                ? "border-primary bg-primary/5 shadow-sticker-sm"
                                : "border-border hover:border-primary/50 hover:bg-muted/30"
                        )}
                    >
                        <div className="h-8 w-8 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                            <Clock className="h-4 w-4 text-primary" strokeWidth={2.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-black text-sm">Keep current time</div>
                            <div className="text-xs font-bold text-muted-foreground">{currentTime}</div>
                        </div>
                        {!showTimePicker && (
                            <Check className="h-4 w-4 text-primary shrink-0" strokeWidth={3} />
                        )}
                    </button>

                    {/* Change time option */}
                    <button
                        type="button"
                        onClick={() => setShowTimePicker(true)}
                        className={cn(
                            "w-full flex items-center gap-3 p-3 rounded-2xl border-2 transition-all text-left",
                            showTimePicker
                                ? "border-primary bg-primary/5 shadow-sticker-sm"
                                : "border-border hover:border-primary/50 hover:bg-muted/30"
                        )}
                    >
                        <div className="h-8 w-8 rounded-xl bg-sticker-yellow/30 flex items-center justify-center shrink-0">
                            <Clock className="h-4 w-4 text-sticker-foreground" strokeWidth={2.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-black text-sm">Change time</div>
                            <div className="text-xs font-bold text-muted-foreground">Pick a new time</div>
                        </div>
                        {showTimePicker && (
                            <Check className="h-4 w-4 text-primary shrink-0" strokeWidth={3} />
                        )}
                    </button>

                    {/* Time picker — shown when "Change time" is selected */}
                    {showTimePicker && (
                        <div className="bg-muted/30 rounded-2xl border-2 border-border p-4 shadow-sticker-badge">
                            <label htmlFor="move-event-time" className="text-xs font-black text-muted-foreground uppercase tracking-widest block mb-2">
                                New Time
                            </label>
                            <input
                                id="move-event-time"
                                type="time"
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                className="w-full h-11 px-3 rounded-xl border-2 border-border bg-card text-foreground font-bold text-lg shadow-sticker-badge focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t-2 border-border px-5 py-4 flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        className="flex-1 h-10 rounded-full border-2 border-border font-bold shadow-sticker-sm hover:-translate-y-px transition-all"
                    >
                        <X className="h-4 w-4 mr-1.5" strokeWidth={2.5} />
                        Undo Move
                    </Button>
                    <Button
                        onClick={() => {
                            if (showTimePicker) {
                                onChangeTime(selectedTime);
                            } else {
                                onKeepTime();
                            }
                        }}
                        className="flex-1 h-10 rounded-full border-2 border-border font-bold bg-primary text-primary-foreground shadow-sticker-sm hover:-translate-y-px transition-all"
                    >
                        <Check className="h-4 w-4 mr-1.5" strokeWidth={2.5} />
                        Confirm
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
