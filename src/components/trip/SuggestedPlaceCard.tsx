"use client";

import { Heart, MapPin, ExternalLink, Navigation, Trash2 } from "lucide-react";
import { Event, Vote } from "@prisma/client";
import { toggleVote, deleteEvent } from "@/actions/event";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AssignToDayPopover } from "./AssignToDayPopover";
import Image from "next/image";
import { getPlaceTypeStyle, getStickerBgClass } from "@/lib/design-tokens";
import { Button } from "@/components/ui/button";
import { DestructiveAlertDialog } from "@/components/ui/alert-dialog";

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
    tripStartDate: Date | string | null;
    tripEndDate: Date | string | null;
}

export function SuggestedPlaceCard({ event, currentUserId, tripId, tripStartDate, tripEndDate }: SuggestedPlaceCardProps) {
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

    let mapsUrl = event.url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.title)}`;
    if (event.lat && event.lng) {
        mapsUrl = `https://www.google.com/maps?q=${event.lat},${event.lng}`;
    } else if (event.address || event.location) {
        mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address || event.location || "")}`;
    }

    const displayLocation = event.address || event.location || null;
    const displayType = event.placeType ?? event.type;
    const cardColorClass = getPlaceTypeStyle(event.placeType, event.type).card;

    return (
        <div className={cn("overflow-hidden group flex flex-col transition-transform duration-300 rounded-2xl p-5 md:p-4 border-2 border-border hover:-translate-y-2 relative h-full flex-1 min-h-[280px] cursor-pointer shadow-sticker-card hover:shadow-sticker-elevated", cardColorClass)}>

            <MapPin className="absolute -bottom-6 -left-6 h-32 w-32 md:h-28 md:w-28 opacity-10 pointer-events-none" strokeWidth={3} />

            <DestructiveAlertDialog
                trigger={
                    <Button
                        variant="stickerIcon"
                        size="icon"
                        className="absolute top-4 right-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-20"
                        onClick={(e) => e.stopPropagation()}
                        disabled={isDeleting}
                        aria-label="Remove suggestion"
                    >
                        <Trash2 className="h-4 w-4" strokeWidth={2.5} />
                    </Button>
                }
                title="Remove suggestion?"
                description="This suggestion will be removed from the board. This action cannot be undone."
                confirmLabel="Remove"
                onConfirm={handleDelete}
            />

            <div className="flex flex-col flex-1 gap-4 relative z-10 min-h-0">
                <div className="flex justify-between items-start gap-2">
                    <div className="uppercase tracking-widest font-black text-[10px] md:text-[9px] bg-black/10 inline-block px-2.5 py-0.5 rounded-full border border-black/5 w-fit">
                        {displayType}
                    </div>
                </div>

                <h3 className="font-black text-2xl md:text-xl leading-[1.05] line-clamp-2 mt-1" title={event.title}>{event.title}</h3>

                <p className="text-sm md:text-xs font-bold opacity-80 line-clamp-2 flex-1 min-h-0 pt-1">
                    {event.description || "No description provided."}
                </p>

                {displayLocation && (
                    <div className="flex items-start gap-2 text-sm font-bold opacity-90 mt-2">
                        <Navigation className="h-5 w-5 shrink-0" strokeWidth={3} />
                        <span className="line-clamp-1">{displayLocation}</span>
                    </div>
                )}

                <div className="flex flex-col gap-4 pt-5 mt-auto border-t-2 border-black/10 shrink-0">
                    {/* Row 1: Voters (left), Like button (right) */}
                    <div className="flex items-center gap-3 flex-wrap justify-between min-h-9">
                        {voteCount > 0 ? (
                            <div className="flex items-center gap-2 min-w-0">
                                <span className="text-[10px] font-black uppercase tracking-wider text-foreground/70 bg-black/5 px-2.5 py-1.5 rounded-full border border-black/10 shrink-0">
                                    Votes
                                </span>
                                <div className="flex -space-x-2 overflow-hidden">
                                    {event.votes.slice(0, 5).map(vote => {
                                        let userAvatar = null;
                                        const member = event.trip.members.find(m => m.user.id === vote.userId);
                                        if (member && member.user.avatar) userAvatar = member.user.avatar;

                                        return (
                                            <div key={vote.id} className="relative h-7 w-7 rounded-full border-2 border-border bg-background flex items-center justify-center shrink-0 overflow-hidden shadow-none">
                                                {userAvatar ? (
                                                    <Image src={userAvatar} alt="Voter" fill className="object-cover" unoptimized />
                                                ) : (
                                                    <span className="text-[10px] font-black text-foreground">U</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                    {voteCount > 5 && (
                                        <div className="h-7 w-7 rounded-full border-2 border-foreground/20 flex items-center justify-center text-[10px] font-black text-foreground bg-background">
                                            +{voteCount - 5}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div />
                        )}
                        <button
                            onClick={(e) => { e.stopPropagation(); handleToggleVote(); }}
                            disabled={isVoting}
                            className={cn(
                                "flex items-center gap-1.5 rounded-full font-black text-sm border-2 border-border shadow-sticker-sm hover:-translate-y-px hover:shadow-sticker-card transition-all pl-3 pr-3.5 py-2 min-w-10 justify-center shrink-0",
                                hasVoted ? getStickerBgClass("pink") : "bg-card/90 text-foreground hover:bg-sticker-lilac/30 border-border"
                            )}
                            title={hasVoted ? "Remove vote" : "Vote"}
                        >
                            <Heart className={cn("h-4 w-4", hasVoted && "fill-current")} strokeWidth={3} />
                            <span className="tabular-nums">{voteCount}</span>
                        </button>
                    </div>

                    {/* Row 2: Map + Link (left), Calendar (right) — actions separated from voting */}
                    <div className="flex items-center gap-3 flex-wrap justify-between pt-1 border-t border-black/5">
                        <div className="flex items-center gap-2">
                            <a href={mapsUrl} target="_blank" rel="noreferrer" title="Open in Maps" className={`flex items-center justify-center h-9 w-9 rounded-full font-bold ${getStickerBgClass("green")} border-2 border-border shadow-sticker-sm hover:-translate-y-px hover:shadow-sticker-card transition-all`} onClick={(e) => e.stopPropagation()}>
                                <MapPin className="h-4 w-4" strokeWidth={3} />
                            </a>
                            {event.url && (
                                <a href={event.url} target="_blank" rel="noreferrer" title="Open source" className={`flex items-center justify-center h-9 w-9 rounded-full font-bold ${getStickerBgClass("blue")} border-2 border-border shadow-sticker-sm hover:-translate-y-px hover:shadow-sticker-card transition-all`} onClick={(e) => e.stopPropagation()}>
                                    <ExternalLink className="h-4 w-4" strokeWidth={3} />
                                </a>
                            )}
                        </div>
                        <AssignToDayPopover
                            tripId={tripId}
                            eventId={event.id}
                            tripStartDate={tripStartDate}
                            tripEndDate={tripEndDate}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
