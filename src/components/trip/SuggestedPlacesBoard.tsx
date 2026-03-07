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
            <div className="flex flex-col items-center justify-center p-8 text-center h-[40vh] border-2 border-dashed border-border rounded-2xl bg-muted/10 shadow-[0_4px_0_rgba(0,0,0,0.04)]">
                <div className="h-12 w-12 rounded-xl bg-sticker-yellow/30 border-2 border-border flex items-center justify-center mb-3">
                    <Lightbulb className="h-6 w-6 text-foreground" strokeWidth={2.5} />
                </div>
                <h3 className="text-lg font-black mb-1">No suggested places yet</h3>
                <p className="text-muted-foreground text-sm mb-4 max-w-sm">
                    Anyone in the trip can add places here from the Explore tab for the group to vote on.
                </p>
                <Button asChild className="font-bold border-2 border-border rounded-xl bg-sticker-coral text-white hover:bg-sticker-coral/90">
                    <Link href="/explore">
                        <Plus className="mr-1.5 h-3.5 w-3.5" strokeWidth={3} />
                        Find Places
                    </Link>
                </Button>
            </div>
        );
    }

    // Sort by vote count descending
    const sortedEvents = [...events].sort((a, b) => b.votes.length - a.votes.length);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
