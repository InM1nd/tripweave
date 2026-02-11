"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, MapPin, Loader2, Plane, Hotel, Utensils, Activity, MoreHorizontal, Settings, Trash2, X, Globe, DollarSign, Clock, Link as LinkIcon, Pencil, Check, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
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
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
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
import { Badge } from "@/components/ui/badge";

interface EditEventSheetProps {
    event: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tripId: string;
}

const eventTypes = [
    { value: "activity", label: "Activity", icon: Activity },
    { value: "hotel", label: "Hotel", icon: Hotel },
    { value: "flight", label: "Transport", icon: Plane },
    { value: "restaurant", label: "Restaurant", icon: Utensils },
    { value: "other", label: "Other", icon: MoreHorizontal },
];

export function EditEventSheet({ event, open, onOpenChange, tripId }: EditEventSheetProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // Toggle between View and Edit mode
    const router = useRouter();

    const form = useForm<EventFormValues>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: {
            title: event.title,
            type: event.type.toLowerCase(),
            location: event.location || "",
            startDate: new Date(event.startTime),
            startTime: format(new Date(event.startTime), "HH:mm"),
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
                setIsEditing(false); // Switch back to view mode
                router.refresh();
            } else {
                toast.error(result.error || "Failed update event");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDelete() {
        if (!confirm("Are you sure you want to delete this event?")) return;

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
        } catch (e) {
            toast.error("Failed to delete event");
        } finally {
            setIsLoading(false);
        }
    }

    // Helper to generate Google Maps URL
    const getGoogleMapsUrl = () => {
        const displayLocation = event.address || event.location || event.title;
        if (event.lat && event.lng) {
            return `https://www.google.com/maps?q=${event.lat},${event.lng}`;
        }
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayLocation)}`;
    };

    const currentType = eventTypes.find(t => t.value === event.type.toLowerCase()) || eventTypes[4];

    return (
        <Sheet open={open} onOpenChange={(v) => {
            if (!v) setIsEditing(false); // Reset mode when closing
            onOpenChange(v);
        }}>
            <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-0 gap-0 border-l border-border/50">
                {/* Hero / Cover Image Section */}
                <div className="relative h-56 w-full shrink-0 bg-muted/30">
                    {/* Image handling */}
                    {isEditing ? (
                        <div className="relative w-full h-full group bg-muted">
                            {/* In edit mode, we show the upload control overlaying the image or placeholder */}
                            {form.watch("coverImage") ? (
                                <img
                                    src={form.watch("coverImage")}
                                    alt="Event cover"
                                    className="w-full h-full object-cover opacity-50"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                    <Settings className="h-6 w-6 mb-2 opacity-20" />
                                </div>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center z-10">
                                <Button variant="secondary" className="shadow-lg" onClick={() => document.getElementById("cover-upload-trigger-edit")?.click()}>
                                    <Settings className="mr-2 h-4 w-4" /> Change Cover Image
                                </Button>
                            </div>
                            {/* Hidden trigger for edit mode upload */}
                            <div className="hidden">
                                <ImageUpload
                                    value={form.watch("coverImage")}
                                    onChange={(url) => form.setValue("coverImage", url)}
                                    endpoint="trip-covers"
                                    folder={tripId}
                                />
                                <input id="cover-upload-trigger-edit" type="button" onClick={() => { }} />
                            </div>
                        </div>
                    ) : (
                        // View mode image
                        event.coverImage ? (
                            <img
                                src={event.coverImage}
                                alt={event.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-gradient-to-br from-violet-50/50 to-indigo-50/50 dark:from-violet-950/10 dark:to-indigo-950/10">
                                <currentType.icon className="h-10 w-10 mb-2 opacity-10" />
                            </div>
                        )
                    )}

                    {/* Navbar Actions (Top Right) */}
                    <div className="absolute top-4 right-4 flex gap-2 z-20">
                        {isEditing ? (
                            <>
                                <Button
                                    variant="outline" size="sm"
                                    className="h-8 bg-background/80 backdrop-blur-md border-transparent hover:bg-destructive hover:text-destructive-foreground transition-colors"
                                    onClick={() => handleDelete()}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline" size="sm"
                                    className="h-8 bg-background/80 backdrop-blur-md"
                                    onClick={() => setIsEditing(false)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="outline" size="sm"
                                className="h-8 w-8 p-0 bg-background/60 backdrop-blur-md rounded-full shadow-sm hover:bg-background"
                                onClick={() => setIsEditing(true)}
                            >
                                <Pencil className="h-3.5 w-3.5 text-foreground/80" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-6 pb-20">
                    {/* Header - View Mode */}
                    {!isEditing && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div>
                                <div className="flex items-start justify-between gap-4 mb-1">
                                    <h2 className="text-2xl font-bold leading-tight">{event.title}</h2>
                                    {event.cost > 0 && (
                                        <Badge variant="secondary" className="text-sm px-2 py-0.5 shrink-0 whitespace-nowrap">
                                            {event.currency} {event.cost}
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mt-2">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-4 w-4 text-violet-500" />
                                        <span>
                                            {format(new Date(event.startTime), "EEEE, MMMM d")} at {format(new Date(event.startTime), "HH:mm")}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <currentType.icon className="h-4 w-4 text-indigo-500" />
                                        <span className="capitalize">{event.type.toLowerCase()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions / Links */}
                            <div className="flex flex-col gap-3">
                                {(event.address || event.location) && (
                                    <a
                                        href={getGoogleMapsUrl()}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-start gap-3 p-3 rounded-lg border bg-card/50 hover:bg-accent/50 hover:border-accent transition-colors group"
                                    >
                                        <div className="mt-0.5 bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-md text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                            <MapPin className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm text-foreground">Get Directions</p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {event.address || event.location}
                                            </p>
                                        </div>
                                    </a>
                                )}

                                {event.url && (
                                    <a
                                        href={event.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-start gap-3 p-3 rounded-lg border bg-card/50 hover:bg-accent/50 hover:border-accent transition-colors group"
                                    >
                                        <div className="mt-0.5 bg-purple-100 dark:bg-purple-900/30 p-1.5 rounded-md text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                                            <LinkIcon className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm text-foreground">Visit Website</p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {new URL(event.url).hostname}
                                            </p>
                                        </div>
                                    </a>
                                )}
                            </div>

                            {/* Description / Notes */}
                            {event.description && (
                                <div className="space-y-2">
                                    <h3 className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4" />
                                        Notes
                                    </h3>
                                    <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap p-4 bg-muted/30 rounded-lg border border-border/50">
                                        {event.description}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Edit Mode Form */}
                    {isEditing && (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 animate-in slide-in-from-bottom-2 duration-300">
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Event title" className="text-lg font-medium" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="type"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Type</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select type" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {eventTypes.map((type) => (
                                                                <SelectItem key={type.value} value={type.value}>
                                                                    <div className="flex items-center gap-2">
                                                                        <type.icon className="h-4 w-4" />
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
                                                    <FormLabel>Cost (Est.)</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                            <Input type="number" className="pl-9" placeholder="0.00" {...field} />
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
                                                <FormLabel>Location</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                        <Input className="pl-9" placeholder="Add a location" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Date and Time Row */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="startDate"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col">
                                                    <FormLabel>Date</FormLabel>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant={"outline"}
                                                                    className={cn(
                                                                        "w-full pl-3 text-left font-normal",
                                                                        !field.value && "text-muted-foreground"
                                                                    )}
                                                                >
                                                                    {field.value ? (
                                                                        format(field.value, "PPP")
                                                                    ) : (
                                                                        <span>Pick a date</span>
                                                                    )}
                                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
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
                                                    <FormLabel>Time</FormLabel>
                                                    <FormControl>
                                                        <Input type="time" {...field} />
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
                                                <FormLabel>Link URL</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <LinkIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                        <Input className="pl-9" placeholder="https://..." {...field} />
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
                                                <FormLabel>Notes / Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Add details, reservation numbers, or notes..."
                                                        className="min-h-[100px] resize-none"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Footer Actions for Edit Mode */}
                                <div className="sticky bottom-0 left-0 right-0 -mx-6 -mb-6 p-4 bg-background border-t border-border flex items-center justify-end gap-3 z-10">
                                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isLoading} className="gap-2 bg-primary">
                                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
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
