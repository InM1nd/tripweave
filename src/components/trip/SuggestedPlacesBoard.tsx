"use client";

import { Event, Vote } from "@prisma/client";
import { SuggestedPlaceCard } from "./SuggestedPlaceCard";
import { Lightbulb, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SuggestedEvent extends Event {
    votes: Vote[];
    trip: {
        members: {
            user: {
                id: string;
                name: string;
                avatar: string | null;
            }
        }[];
    };
}

interface SuggestedPlacesBoardProps {
    tripId: string;
    events: SuggestedEvent[];
    currentUserId: string;
}

export function SuggestedPlacesBoard({ tripId, events, currentUserId }: SuggestedPlacesBoardProps) {
    if (events.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center h-[50vh] border-2 border-dashed rounded-xl bg-muted/10">
                <div className="h-16 w-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-4">
                    <Lightbulb className="h-8 w-8 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">No suggested places yet</h3>
                <p className="text-muted-foreground mb-6 max-w-sm">
                    Anyone in the trip can add places here from the Explore tab for the group to vote on.
                </p>
                <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                    <Link href="/explore">
                        <Plus className="mr-2 h-4 w-4" />
                        Find Places
                    </Link>
                </Button>
            </div>
        );
    }

    // Sort by vote count descending
    const sortedEvents = [...events].sort((a, b) => b.votes.length - a.votes.length);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedEvents.map((event) => (
                <SuggestedPlaceCard
                    key={event.id}
                    event={event}
                    currentUserId={currentUserId}
                    tripId={tripId}
                />
            ))}
        </div>
    );
}
