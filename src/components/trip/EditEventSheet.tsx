"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, MapPin, Loader2, Plane, Hotel, Utensils, Activity, MoreHorizontal, Settings, Trash2, X } from "lucide-react";

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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

import { updateEvent, deleteEvent } from "@/actions/event"; // Needs to be created
import { eventFormSchema, EventFormValues } from "@/lib/validations/event";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/ui/image-upload";

interface EditEventSheetProps {
    event: any; // Ideally properly typed
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tripId: string;
}

export function EditEventSheet({ event, open, onOpenChange, tripId }: EditEventSheetProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const form = useForm<EventFormValues>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: {
            title: event.title,
            type: event.type.toLowerCase(), // Ensure casing matches enum
            location: event.location || "",
            startDate: new Date(event.startTime),
            startTime: format(new Date(event.startTime), "HH:mm"),
            description: event.description || "",
            coverImage: event.coverImage || "",
            cost: event.cost ? String(event.cost) : "",
        },
    });

    async function onSubmit(data: EventFormValues) {
        setIsLoading(true);
        try {
            const result = await updateEvent(tripId, event.id, data);
            if (result.success) {
                toast.success("Event updated");
                onOpenChange(false);
                router.refresh();
            } else {
                toast.error(result.error || "Failed decrease event");
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
                toast.error(result.error);
            }
        } catch (e) {
            toast.error("Failed to delete event");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Edit Event</SheetTitle>
                    <SheetDescription>
                        Modify event details or settings.
                    </SheetDescription>
                </SheetHeader>

                <Tabs defaultValue="details" className="mt-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="pt-4">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                {/* Reuse form fields similar to AddEventModal, simplified for brevity here, or extract FormFields component */}
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* ... Add other fields: Type, Location, Date, Time, Cost, Description ... */}
                                <div className="flex justify-end pt-4">
                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </TabsContent>

                    <TabsContent value="settings" className="space-y-6 pt-4">
                        {/* Cover Image Section */}
                        <div className="space-y-4">
                            <h3 className="font-medium">Event Cover Image</h3>
                            <div className="border rounded-lg p-4 space-y-4">
                                <ImageUpload
                                    value={form.getValues("coverImage")}
                                    onChange={(url) => {
                                        form.setValue("coverImage", url);
                                        // Auto-save logic could go here, but for now we rely on explicit update button below or in future
                                    }}
                                    endpoint="trip-covers"
                                    folder={tripId}
                                />

                                <Button
                                    onClick={async () => {
                                        const url = form.getValues("coverImage");
                                        if (url === event.coverImage) return; // No change

                                        setIsLoading(true);
                                        try {
                                            const result = await updateEvent(tripId, event.id, {
                                                coverImage: url
                                            });

                                            if (result.success) {
                                                toast.success("Cover image updated");
                                                // setPreview updated via optimistic UI in ImageUpload if needed, 
                                                // or strictly relying on router refresh
                                                router.refresh();
                                            } else {
                                                toast.error("Failed to update event");
                                            }
                                        } catch (e) {
                                            toast.error("Update failed");
                                        } finally {
                                            setIsLoading(false);
                                        }
                                    }}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Saving..." : "Save Image Change"}
                                </Button>
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="font-medium text-destructive">Danger Zone</h3>
                            <Button variant="destructive" className="w-full" onClick={handleDelete} disabled={isLoading}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Event
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>

            </SheetContent>
        </Sheet>
    );
}
