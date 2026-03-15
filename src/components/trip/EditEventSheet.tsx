"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
    Calendar as CalendarIcon,
    MapPin,
    Loader2,
    Plane,
    Hotel,
    Utensils,
    Compass,
    Bus,
    Sparkles,
    Trash2,
    X,
    DollarSign,
    Clock,
    Link as LinkIcon,
    Pencil,
    Check,
    StickyNote,
    ExternalLink,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
} from "@/components/ui/sheet";
import { DestructiveAlertDialog } from "@/components/ui/alert-dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { updateEvent, deleteEvent } from "@/actions/event";
import { eventFormSchema, EventFormValues } from "@/lib/validations/event";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/ui/image-upload";
import { getEventTypeStyle } from "@/lib/design-tokens";

// ─── Type metadata ──────────────────────────────────────────────────────────

const EVENT_TYPE_META: Record<string, { icon: typeof Plane; label: string }> = {
    FLIGHT: { icon: Plane, label: "Flight" },
    HOTEL: { icon: Hotel, label: "Hotel" },
    RESTAURANT: { icon: Utensils, label: "Restaurant" },
    TRANSPORT: { icon: Bus, label: "Transport" },
    ACTIVITY: { icon: Compass, label: "Activity" },
    OTHER: { icon: Sparkles, label: "Other" },
};

function getTypeMeta(type: string | undefined) {
    return EVENT_TYPE_META[(type ?? "").toUpperCase()] ?? EVENT_TYPE_META.OTHER;
}

interface EditEventSheetProps {
    event: {
        id: string;
        title?: string;
        type?: string;
        location?: string | null;
        address?: string | null;
        startTime?: string | Date;
        endTime?: string | Date | null;
        startDate?: Date;
        description?: string | null;
        coverImage?: string | null;
        cost?: string | number | null;
        currency?: string | null;
        url?: string | null;
        lat?: number | null;
        lng?: number | null;
        allDay?: boolean;
    };
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tripId: string;
}

const eventTypes = [
    { value: "activity", label: "Activity", icon: Compass },
    { value: "hotel", label: "Hotel", icon: Hotel },
    { value: "flight", label: "Transport", icon: Bus },
    { value: "restaurant", label: "Restaurant", icon: Utensils },
    { value: "other", label: "Other", icon: Sparkles },
];

function eventTypeToForm(t: string | undefined): EventFormValues["type"] {
    const lower = (t ?? "").toLowerCase();
    if (lower === "hotel") return "accommodation";
    if (lower === "restaurant") return "food";
    if (lower === "transport" || lower === "flight") return "transport";
    if (lower === "activity") return "activity";
    return "other";
}

export function EditEventSheet({ event, open, onOpenChange, tripId }: EditEventSheetProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    const form = useForm<EventFormValues>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: {
            title: event.title,
            type: eventTypeToForm(event.type),
            location: event.location || "",
            startDate: new Date(event.startTime ?? Date.now()),
            startTime: format(new Date(event.startTime ?? Date.now()), "HH:mm"),
            description: event.description || "",
            coverImage: event.coverImage || "",
            cost: event.cost ? String(event.cost) : "",
            url: event.url || "",
        },
    });

    async function onSubmit(data: EventFormValues) {
        setIsLoading(true);
        try {
            const result = await updateEvent(tripId, event.id, data);
            if (result.success) {
                toast.success("Event updated");
                setIsEditing(false);
                router.refresh();
            } else {
                toast.error(result.error || "Failed to update event");
            }
        } catch {
            toast.error("An error occurred");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDelete() {
        setIsLoading(true);
        try {
            const result = await deleteEvent(tripId, event.id);
            if (result.success) {
                toast.success("Event deleted");
                onOpenChange(false);
                router.refresh();
            } else {
                toast.error(result.error || "Failed to delete");
            }
        } catch {
            toast.error("Failed to delete event");
        } finally {
            setIsLoading(false);
        }
    }

    const getGoogleMapsUrl = () => {
        const displayLocation = event.address || event.location || event.title;
        if (event.lat && event.lng) {
            return `https://www.google.com/maps?q=${event.lat},${event.lng}`;
        }
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayLocation ?? "")}`;
    };

    const theme = getEventTypeStyle((event.type ?? "OTHER").toUpperCase());
    const typeMeta = getTypeMeta(event.type);
    const TypeIcon = typeMeta.icon;

    const startDate = new Date(event.startTime ?? Date.now());
    const hasEndTime = event.endTime && new Date(event.endTime).getTime() !== startDate.getTime();

    return (
        <Sheet open={open} onOpenChange={(v) => {
            if (!v) setIsEditing(false);
            onOpenChange(v);
        }}>
            <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-0 gap-0 border-l-2 border-border">
                {/* ── Hero section ──────────────────────────────────────── */}
                <div className={cn("relative w-full shrink-0", theme.card)}>
                    {isEditing ? (
                        /* Edit mode — cover upload */
                        <div className="relative w-full h-48 bg-sticker-foreground/5">
                            {form.watch("coverImage") ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={form.watch("coverImage")}
                                    alt="Event cover"
                                    className="w-full h-full object-cover opacity-60"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <TypeIcon className="h-16 w-16 text-sticker-foreground/10" strokeWidth={1} />
                                </div>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center z-10">
                                <Button
                                    variant="outline"
                                    className="rounded-full border-2 border-border bg-card font-bold shadow-sticker-sm"
                                    onClick={() => document.getElementById("cover-upload-trigger-edit")?.click()}
                                >
                                    <Pencil className="mr-2 h-4 w-4" /> Change Cover
                                </Button>
                            </div>
                            <div className="hidden">
                                <ImageUpload
                                    value={form.watch("coverImage")}
                                    onChange={(url) => form.setValue("coverImage", url)}
                                    endpoint="trip-covers"
                                    folder={tripId}
                                />
                                <input id="cover-upload-trigger-edit" type="button" onClick={() => {}} />
                            </div>
                        </div>
                    ) : (
                        /* View mode — cover or type placeholder */
                        event.coverImage ? (
                            <div className="relative h-48">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={event.coverImage}
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                            </div>
                        ) : (
                            <div className="h-32 flex items-center justify-center">
                                <TypeIcon className="h-16 w-16 text-sticker-foreground/10" strokeWidth={1} />
                            </div>
                        )
                    )}

                    {/* Top-right actions */}
                    <div className="absolute top-3 right-3 flex gap-2 z-20">
                        {isEditing ? (
                            <>
                                <DestructiveAlertDialog
                                    trigger={
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-9 w-9 rounded-full border-2 border-border bg-card shadow-sticker-badge hover:bg-destructive hover:text-white hover:border-destructive transition-all"
                                        >
                                            <Trash2 className="h-4 w-4" strokeWidth={2.5} />
                                        </Button>
                                    }
                                    title="Delete event?"
                                    description="This event will be permanently deleted from your itinerary."
                                    confirmLabel="Delete"
                                    onConfirm={handleDelete}
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-9 w-9 rounded-full border-2 border-border bg-card shadow-sticker-badge hover:-translate-y-px transition-all"
                                    onClick={() => setIsEditing(false)}
                                >
                                    <X className="h-4 w-4" strokeWidth={2.5} />
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 rounded-full border-2 border-border bg-card shadow-sticker-badge hover:shadow-sticker-sm hover:-translate-y-px transition-all"
                                onClick={() => setIsEditing(true)}
                            >
                                <Pencil className="h-4 w-4" strokeWidth={2.5} />
                            </Button>
                        )}
                    </div>

                    {/* Type badge — top-left */}
                    <div className="absolute top-3 left-3 z-20">
                        <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-black tracking-widest rounded-full px-3 py-1 bg-card border-2 border-border text-sticker-foreground shadow-sticker-badge backdrop-blur-sm">
                            <TypeIcon className="h-3 w-3" strokeWidth={3} />
                            {typeMeta.label}
                        </span>
                    </div>
                </div>

                {/* ── Content ──────────────────────────────────────────── */}
                <div className="px-5 py-5 pb-24">
                    {/* ── View mode ────────────────────────────────────── */}
                    {!isEditing && (
                        <div className="space-y-5 animate-in fade-in duration-300">
                            {/* Title + cost */}
                            <div>
                                <div className="flex items-start justify-between gap-3 mb-2">
                                    <h2 className="text-xl font-black tracking-tight leading-tight text-foreground">
                                        {event.title}
                                    </h2>
                                    {Number(event.cost ?? 0) > 0 && (
                                        <span className="text-xs font-black px-3 py-1 rounded-full border-2 border-border bg-card shadow-sticker-badge shrink-0">
                                            {event.currency} {Number(event.cost).toLocaleString()}
                                        </span>
                                    )}
                                </div>

                                {/* Date & time */}
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm font-bold text-muted-foreground">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-4 w-4" strokeWidth={2.5} />
                                        <span>
                                            {format(startDate, "EEE, MMM d")} &middot; {format(startDate, "HH:mm")}
                                            {hasEndTime && ` → ${format(new Date(event.endTime!), "HH:mm")}`}
                                        </span>
                                    </div>
                                    {event.allDay && (
                                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted border border-border">
                                            All day
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* ── Info cards ──────────────────────────────── */}
                            <div className="space-y-2.5">
                                {/* Location */}
                                {(event.address || event.location) && (
                                    <a
                                        href={getGoogleMapsUrl()}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-3 p-3 rounded-2xl border-2 border-border bg-card shadow-sticker-badge hover:shadow-sticker-sm hover:-translate-y-px transition-all group"
                                    >
                                        <div className="h-10 w-10 rounded-xl bg-sticker-green/30 border-2 border-border flex items-center justify-center shrink-0 shadow-sticker-badge group-hover:scale-105 transition-transform">
                                            <MapPin className="h-5 w-5 text-sticker-foreground" strokeWidth={2.5} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-black text-sm text-foreground">Get Directions</p>
                                            <p className="text-xs font-bold text-muted-foreground truncate">
                                                {event.address || event.location}
                                            </p>
                                        </div>
                                        <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2.5} />
                                    </a>
                                )}

                                {/* External link */}
                                {event.url && (
                                    <a
                                        href={event.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-3 p-3 rounded-2xl border-2 border-border bg-card shadow-sticker-badge hover:shadow-sticker-sm hover:-translate-y-px transition-all group"
                                    >
                                        <div className="h-10 w-10 rounded-xl bg-sticker-lilac/30 border-2 border-border flex items-center justify-center shrink-0 shadow-sticker-badge group-hover:scale-105 transition-transform">
                                            <LinkIcon className="h-5 w-5 text-sticker-foreground" strokeWidth={2.5} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-black text-sm text-foreground">Visit Website</p>
                                            <p className="text-xs font-bold text-muted-foreground truncate">
                                                {(() => {
                                                    try { return new URL(event.url).hostname; } catch { return event.url; }
                                                })()}
                                            </p>
                                        </div>
                                        <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2.5} />
                                    </a>
                                )}
                            </div>

                            {/* Description / Notes */}
                            {event.description && (
                                <div className="space-y-2">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <StickyNote className="h-3.5 w-3.5" strokeWidth={2.5} />
                                        Notes
                                    </h3>
                                    <div className="text-sm font-medium text-foreground leading-relaxed whitespace-pre-wrap p-4 bg-muted/30 rounded-2xl border-2 border-border shadow-sticker-badge">
                                        {event.description}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Edit mode form ───────────────────────────────── */}
                    {isEditing && (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 animate-in slide-in-from-bottom-2 duration-300">
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-black text-xs uppercase tracking-widest">Title</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Event title"
                                                        className="text-base font-bold border-2 border-border rounded-xl shadow-sticker-badge focus:shadow-sticker-sm transition-shadow"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-2 gap-3">
                                        <FormField
                                            control={form.control}
                                            name="type"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-black text-xs uppercase tracking-widest">Type</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="border-2 border-border rounded-xl shadow-sticker-badge">
                                                                <SelectValue placeholder="Select type" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className="border-2 border-border rounded-xl shadow-sticker-elevated">
                                                            {eventTypes.map((type) => (
                                                                <SelectItem key={type.value} value={type.value}>
                                                                    <div className="flex items-center gap-2 font-bold">
                                                                        <type.icon className="h-4 w-4" strokeWidth={2.5} />
                                                                        {type.label}
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="cost"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-black text-xs uppercase tracking-widest">Cost</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                            <Input
                                                                type="number"
                                                                className="pl-9 border-2 border-border rounded-xl shadow-sticker-badge"
                                                                placeholder="0.00"
                                                                {...field}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="location"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-black text-xs uppercase tracking-widest">Location</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                        <Input
                                                            className="pl-9 border-2 border-border rounded-xl shadow-sticker-badge"
                                                            placeholder="Add a location"
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-2 gap-3">
                                        <FormField
                                            control={form.control}
                                            name="startDate"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col">
                                                    <FormLabel className="font-black text-xs uppercase tracking-widest">Date</FormLabel>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant="outline"
                                                                    className={cn(
                                                                        "w-full pl-3 text-left font-bold border-2 border-border rounded-xl shadow-sticker-badge",
                                                                        !field.value && "text-muted-foreground"
                                                                    )}
                                                                >
                                                                    {field.value ? format(field.value, "MMM d, yyyy") : <span>Pick a date</span>}
                                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0 border-2 border-border rounded-2xl shadow-sticker-elevated" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={field.value}
                                                                onSelect={field.onChange}
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="startTime"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-black text-xs uppercase tracking-widest">Time</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="time"
                                                            className="border-2 border-border rounded-xl shadow-sticker-badge"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="url"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-black text-xs uppercase tracking-widest">Link URL</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <LinkIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                        <Input
                                                            className="pl-9 border-2 border-border rounded-xl shadow-sticker-badge"
                                                            placeholder="https://..."
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-black text-xs uppercase tracking-widest">Notes</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Add details, reservation numbers, or notes..."
                                                        className="min-h-[100px] resize-none border-2 border-border rounded-xl shadow-sticker-badge"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Sticky footer */}
                                <div className="sticky bottom-0 left-0 right-0 -mx-5 -mb-6 px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] bg-background border-t-2 border-border flex items-center justify-end gap-3 z-10">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsEditing(false)}
                                        className="rounded-full border-2 border-border font-bold shadow-sticker-sm hover:-translate-y-px transition-all"
                                    >
                                        <X className="h-4 w-4 mr-1.5" strokeWidth={2.5} />
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="rounded-full border-2 border-border font-bold bg-primary text-primary-foreground shadow-sticker-sm hover:-translate-y-px transition-all gap-2"
                                    >
                                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" strokeWidth={2.5} />}
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
