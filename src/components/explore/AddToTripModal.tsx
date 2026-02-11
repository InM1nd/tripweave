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
    place: any; // Place or Recommendation
    trips: any[];
}

export function AddToTripModal({ isOpen, onClose, place, trips }: AddToTripModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSelectTrip = async (tripId: string) => {
        setIsSubmitting(true);
        try {
            const result = await convertPlaceToEvent(tripId, place);
            if (result.success) {
                toast.success(`Added "${place.title || place.name}" to trip!`);
                onClose();
                router.push(`/trip/${tripId}/timeline`);
            } else {
                toast.error(result.error || "Failed to add to trip");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    const upcomingTrips = trips.filter(t => new Date(t.endDate) >= new Date());
    const pastTrips = trips.filter(t => new Date(t.endDate) < new Date());

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add to Trip</DialogTitle>
                    <DialogDescription>
                        Select a trip to add "{place?.title || place?.name}" to.
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
                                        className="w-full justify-between h-auto py-3 px-4 group hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-950/20"
                                        onClick={() => handleSelectTrip(trip.id)}
                                        disabled={isSubmitting}
                                    >
                                        <div className="flex flex-col items-start gap-1 text-left">
                                            <span className="font-semibold group-hover:text-violet-600 dark:group-hover:text-violet-400">{trip.name}</span>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
                                            </span>
                                        </div>
                                        {isSubmitting ? (
                                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                        ) : (
                                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-violet-600" />
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
