"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { convertPlaceToEvent } from "@/actions/place";
import { toast } from "sonner";
import { Loader2, ArrowRight, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

interface AddToTripModalProps {
    isOpen: boolean;
    onClose: () => void;
    place: { title?: string; name?: string; id?: string | number; type?: string; source?: string; description?: string | null; image?: string | null; url?: string | null; location?: string | null; address?: string | null; lat?: number | null; lng?: number | null };
    trips: { id: string; name: string; startDate: string | Date; endDate: string | Date }[];
}

export function AddToTripModal({ isOpen, onClose, place, trips }: AddToTripModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSelectTrip = async (tripId: string) => {
        if (!tripId?.trim()) {
            toast.error("Please select a trip");
            return;
        }
        const payload = {
            title: place?.title || place?.name || "",
            name: place?.name || place?.title,
            description: place?.description ?? null,
            image: place?.image ?? null,
            url: place?.url ?? null,
            address: place?.address ?? null,
            location: place?.location ?? null,
            lat: place?.lat ?? null,
            lng: place?.lng ?? null,
            type: place?.type ?? undefined,
            source: place?.source ?? undefined,
        };
        setIsSubmitting(true);
        try {
            const result = await convertPlaceToEvent(tripId, payload);
            if (result.success) {
                toast.success(`Added to Idea Board! Assign it to a day from the Suggested tab.`);
                onClose();
                router.push(`/trip/${tripId}/suggested`);
            } else {
                console.error("Add to trip failed:", result.error);
                toast.error(result.error || "Failed to add to trip");
            }
        } catch (e) {
            console.error("Add to trip error:", e);
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    const upcomingTrips = trips.filter(t => new Date(t.endDate) >= new Date());
    const pastTrips = trips.filter(t => new Date(t.endDate) < new Date());

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] border-2 border-border rounded-2xl shadow-sticker-modal">
                <DialogHeader className="border-b-2 border-border pb-3">
                    <DialogTitle>Add to Trip</DialogTitle>
                    <DialogDescription>
                        Select a trip to add &quot;{place?.title || place?.name}&quot; to.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-4">
                        {upcomingTrips.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium text-muted-foreground sticky top-0 bg-background py-1">Upcoming Trips</h4>
                                {upcomingTrips.map((trip) => (
                                    <Button
                                        key={trip.id}
                                        variant="outline"
                                        className="w-full justify-between h-auto py-3 px-4 group hover:border-primary hover:bg-accent/20 dark:hover:bg-muted/50"
                                        onClick={() => handleSelectTrip(trip.id)}
                                        disabled={isSubmitting}
                                    >
                                        <div className="flex flex-col items-start gap-1 text-left">
                                            <span className="font-semibold group-hover:text-primary">{trip.name}</span>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
                                            </span>
                                        </div>
                                        {isSubmitting ? (
                                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                        ) : (
                                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                        )}
                                    </Button>
                                ))}
                            </div>
                        )}

                        {pastTrips.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium text-muted-foreground sticky top-0 bg-background py-1">Past Trips</h4>
                                {pastTrips.map((trip) => (
                                    <Button
                                        key={trip.id}
                                        variant="ghost"
                                        className="w-full justify-between h-auto py-3 px-4 border border-dashed text-muted-foreground"
                                        onClick={() => handleSelectTrip(trip.id)}
                                        disabled={isSubmitting}
                                    >
                                        <div className="flex flex-col items-start gap-1 text-left">
                                            <span className="font-medium">{trip.name}</span>
                                        </div>
                                        <div className="text-xs">Past</div>
                                    </Button>
                                ))}
                            </div>
                        )}

                        {upcomingTrips.length === 0 && pastTrips.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                No trips found. Create a trip first!
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
