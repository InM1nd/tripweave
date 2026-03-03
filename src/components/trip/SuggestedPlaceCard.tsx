"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, ExternalLink, CalendarPlus, Navigation, Trash2 } from "lucide-react";
import { Event, Vote } from "@prisma/client";
import { toggleVote, deleteEvent } from "@/actions/event";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AddEventModal } from "./AddEventModal";
import Image from "next/image";

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

interface SuggestedPlaceCardProps {
    event: SuggestedEvent;
    currentUserId: string;
    tripId: string;
}

const eventTypeColors: Record<string, string> = {
    TRANSPORT: "bg-teal/10 text-teal border-teal/20",
    HOTEL: "bg-violet/10 text-violet border-violet/20",
    ACTIVITY: "bg-accent]/10 text-accent] border-accent]/20",
    RESTAURANT: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    OTHER: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

export function SuggestedPlaceCard({ event, currentUserId, tripId }: SuggestedPlaceCardProps) {
    const [isVoting, setIsVoting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const hasVoted = event.votes.some(v => v.userId === currentUserId);
    const voteCount = event.votes.length;

    const handleToggleVote = async () => {
        setIsVoting(true);
        try {
            const result = await toggleVote(event.id);
            if (!result.success) {
                toast.error(result.error);
            }
        } catch {
            toast.error("Failed to vote");
        } finally {
            setIsVoting(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to remove this suggestion?")) return;
        setIsDeleting(true);
        try {
            const result = await deleteEvent(tripId, event.id);
            if (result.success) {
                toast.success("Place removed");
            } else {
                toast.error(result.error || "Failed to delete");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsDeleting(false);
        }
    };

    // Build Google Maps URL
    let mapsUrl = event.url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.title)}`;
    if (event.lat && event.lng) {
        mapsUrl = `https://www.google.com/maps?q=${event.lat},${event.lng}`;
    } else if (event.address || event.location) {
        mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address || event.location || "")}`;
    }

    const displayLocation = event.address || event.location || null;

    return (
        <Card className="overflow-hidden group flex flex-col hover:shadow-lg transition-all border-border/50 h-full relative">
            <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                onClick={handleDelete}
                disabled={isDeleting}
            >
                <Trash2 className="h-4 w-4" />
            </Button>

            {/* Image Area */}
            <div className="aspect-video relative overflow-hidden bg-muted">
                {event.coverImage ? (
                    <Image
                        src={event.coverImage}
                        alt={event.title}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400">
                        <MapPin className="h-12 w-12 opacity-20" />
                    </div>
                )}
                <Badge className={cn("absolute top-3 left-3 backdrop-blur-md", eventTypeColors[event.type] || eventTypeColors.OTHER)}>
                    {event.type}
                </Badge>
            </div>

            <CardContent className="p-4 flex flex-col flex-1 gap-3">
                {/* Title and votes */}
                <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-lg leading-tight line-clamp-1 flex-1" title={event.title}>{event.title}</h3>

                    <Button
                        variant={hasVoted ? "default" : "secondary"}
                        size="sm"
                        onClick={handleToggleVote}
                        disabled={isVoting}
                        className={cn("h-8 gap-1.5 shrink-0 transition-all", hasVoted && "bg-rose-500 hover:bg-rose-600 text-white")}
                    >
                        <Heart className={cn("h-3.5 w-3.5", hasVoted && "fill-current")} />
                        <span>{voteCount}</span>
                    </Button>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                    {event.description || "No description provided."}
                </p>

                {/* Location string */}
                {displayLocation && (
                    <div className="flex items-start gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{displayLocation}</span>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-2">
                    <Button variant="outline" size="sm" className="gap-1.5" asChild>
                        <a href={mapsUrl} target="_blank" rel="noreferrer">
                            <Navigation className="h-3 w-3" />
                            Maps
                        </a>
                    </Button>

                    {event.url && (
                        <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" asChild>
                            <a href={event.url} target="_blank" rel="noreferrer">
                                <ExternalLink className="h-3 w-3" />
                                Source
                            </a>
                        </Button>
                    )}

                    <div className="flex-1" />

                    <AddEventModal tripId={tripId} defaultDate={undefined}>
                        <Button size="sm" className="gap-1.5">
                            <CalendarPlus className="h-3 w-3" />
                            Schedule
                        </Button>
                    </AddEventModal>
                </div>

                {/* Voters Avatars */}
                {voteCount > 0 && (
                    <div className="flex items-center gap-2 pt-2 border-t mt-1">
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold">Voted by:</span>
                        <div className="flex -space-x-1.5 overflow-hidden">
                            {event.votes.slice(0, 5).map(vote => {
                                // Find user details for this vote from the nested members structure. 
                                // In a real app we'd load the full user object with the vote. We will just use placeholders if not loaded.
                                let userAvatar = null;
                                const member = event.trip.members.find(m => m.user.id === vote.userId);
                                if (member && member.user.avatar) userAvatar = member.user.avatar;

                                return (
                                    <div key={vote.id} className="inline-block relative h-5 w-5 rounded-full ring-1 ring-background bg-muted overflow-hidden flex items-center justify-center shrink-0">
                                        {userAvatar ? (
                                            <Image src={userAvatar} alt="Voter" fill className="object-cover" unoptimized />
                                        ) : (
                                            <span className="text-[8px] font-bold">😊</span>
                                        )}
                                    </div>
                                )
                            })}
                            {voteCount > 5 && (
                                <div className="inline-block h-5 w-5 rounded-full ring-1 ring-background bg-muted flex items-center justify-center text-[8px] font-bold">
                                    +{voteCount - 5}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
