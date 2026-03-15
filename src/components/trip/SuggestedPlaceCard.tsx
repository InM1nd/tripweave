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
        <div className={cn("overflow-hidden group flex flex-col rounded-2xl p-4 sm:p-5 md:p-4 border-2 border-border relative h-full flex-1 min-h-[220px] sm:min-h-[260px] md:min-h-[280px] cursor-pointer shadow-sticker-card w-full min-w-0", cardColorClass)}>

            <MapPin className="absolute -bottom-6 -left-6 h-24 w-24 sm:h-32 sm:w-32 md:h-28 md:w-28 opacity-10 pointer-events-none" strokeWidth={3} />

                <DestructiveAlertDialog
                trigger={
                    <Button
                        variant="stickerIcon"
                        size="icon"
                        className="absolute top-3 right-3 sm:top-4 sm:right-4 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 sm:h-9 sm:w-9 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-20 touch-manipulation"
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

            <div className="flex flex-col flex-1 gap-3 sm:gap-4 relative z-10 min-h-0 min-w-0">
                <div className="flex justify-between items-start gap-2 min-w-0">
                    <div className="uppercase tracking-widest font-black text-[10px] md:text-[9px] bg-black/10 inline-block px-2.5 py-0.5 rounded-full border border-black/5 w-fit shrink-0">
                        {displayType}
                    </div>
                </div>

                <h3 className="font-black text-xl sm:text-2xl md:text-xl leading-[1.05] line-clamp-2 mt-1 min-w-0" title={event.title}>{event.title}</h3>

                <p className="text-xs sm:text-sm md:text-xs font-bold opacity-80 line-clamp-2 flex-1 min-h-0 pt-1 min-w-0">
                    {event.description || "No description provided."}
                </p>

                {displayLocation && (
                    <div className="flex items-start gap-2 text-xs sm:text-sm font-bold opacity-90 mt-2 min-w-0">
                        <Navigation className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" strokeWidth={3} />
                        <span className="line-clamp-1 truncate">{displayLocation}</span>
                    </div>
                )}

                <div className="flex flex-col gap-3 sm:gap-4 pt-4 sm:pt-5 mt-auto border-t-2 border-black/10 shrink-0 min-w-0">
                    {/* Row 1: Voters (left), Like button (right) */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-between min-h-9">
                        {voteCount > 0 ? (
                            <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                                <div className="flex items-center gap-1.5 bg-muted/60 text-muted-foreground border-2 border-border rounded-full px-2 sm:px-2.5 py-1 sm:py-1.5 shadow-sticker-badge shrink-0">
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Votes</span>
                                </div>
                                <div className="flex -space-x-2 overflow-hidden min-w-0">
                                    {event.votes.slice(0, 5).map(vote => {
                                        let userAvatar = null;
                                        const member = event.trip.members.find(m => m.user.id === vote.userId);
                                        if (member && member.user.avatar) userAvatar = member.user.avatar;

                                        return (
                                            <div key={vote.id} className="relative h-6 w-6 sm:h-7 sm:w-7 rounded-full border-2 border-border bg-background flex items-center justify-center shrink-0 overflow-hidden shadow-none">
                                                {userAvatar ? (
                                                    <Image src={userAvatar} alt="Voter" fill className="object-cover" unoptimized />
                                                ) : (
                                                    <span className="text-[9px] sm:text-[10px] font-black text-foreground">U</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                    {voteCount > 5 && (
                                        <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-full border-2 border-foreground/20 flex items-center justify-center text-[9px] sm:text-[10px] font-black text-foreground bg-background shrink-0">
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
                                "flex items-center gap-1.5 rounded-full font-black text-xs sm:text-sm border-2 border-border shadow-sticker-sm hover:-translate-y-1 hover:shadow-sticker-card-hover hover:scale-[1.03] transition-all duration-200 pl-2.5 sm:pl-3 pr-3 sm:pr-3.5 py-1.5 sm:py-2 min-h-[44px] sm:min-h-0 min-w-[44px] sm:min-w-0 justify-center shrink-0 touch-manipulation",
                                hasVoted ? getStickerBgClass("pink") : "bg-card/90 text-foreground hover:bg-sticker-lilac/40 hover:border-sticker-lilac/50 border-border"
                            )}
                            title={hasVoted ? "Remove vote" : "Vote"}
                        >
                            <Heart className={cn("h-3.5 w-3.5 sm:h-4 sm:w-4", hasVoted && "fill-current")} strokeWidth={3} />
                            <span className="tabular-nums">{voteCount}</span>
                        </button>
                    </div>

                    {/* Row 2: Map + Link (left), Calendar (right) */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-between pt-1 border-t border-black/5">
                        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                            <a href={mapsUrl} target="_blank" rel="noreferrer" title="Open in Maps" className={`flex items-center justify-center h-10 w-10 sm:h-9 sm:w-9 rounded-full font-bold ${getStickerBgClass("green")} border-2 border-border shadow-sticker-sm hover:-translate-y-1 hover:shadow-sticker-card-hover hover:scale-105 transition-all duration-200 shrink-0 touch-manipulation`} onClick={(e) => e.stopPropagation()}>
                                <MapPin className="h-4 w-4" strokeWidth={3} />
                            </a>
                            {event.url && (
                                <a href={event.url} target="_blank" rel="noreferrer" title="Open source" className={`flex items-center justify-center h-10 w-10 sm:h-9 sm:w-9 rounded-full font-bold ${getStickerBgClass("blue")} border-2 border-border shadow-sticker-sm hover:-translate-y-1 hover:shadow-sticker-card-hover hover:scale-105 transition-all duration-200 shrink-0 touch-manipulation`} onClick={(e) => e.stopPropagation()}>
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
