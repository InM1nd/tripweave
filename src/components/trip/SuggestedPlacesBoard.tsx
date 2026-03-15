"use client";

import { Event, Vote } from "@prisma/client";
import { SuggestedPlaceCard } from "./SuggestedPlaceCard";
import { StickerAnimator } from "@/components/ui/StickerAnimator";
import { EmptyState } from "@/components/ui/empty-state";
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
    tripStartDate: Date | string | null;
    tripEndDate: Date | string | null;
}

export function SuggestedPlacesBoard({ tripId, events, currentUserId, tripStartDate, tripEndDate }: SuggestedPlacesBoardProps) {
    if (events.length === 0) {
        return (
            <EmptyState
                variant="sticker"
                icon={Lightbulb}
                iconBgColor="yellow"
                title="No suggested places yet"
                description="Anyone in the trip can add places here from the Explore tab for the group to vote on."
                action={
                    <Button variant="default" asChild>
                        <Link href="/explore">
                            <Plus className="mr-1.5 h-3.5 w-3.5" strokeWidth={3} />
                            Find Places
                        </Link>
                    </Button>
                }
                className="h-[40vh]"
            />
        );
    }

    // Sort by vote count descending
    const sortedEvents = [...events].sort((a, b) => b.votes.length - a.votes.length);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 items-stretch min-w-0 overflow-hidden">
            {sortedEvents.map((event, i) => (
                <StickerAnimator key={event.id} delay={i * 0.06} className="h-full flex min-w-0">
                    <SuggestedPlaceCard
                        event={event}
                        currentUserId={currentUserId}
                        tripId={tripId}
                        tripStartDate={tripStartDate}
                        tripEndDate={tripEndDate}
                    />
                </StickerAnimator>
            ))}
        </div>
    );
}
