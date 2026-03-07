"use client";

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
    TRANSPORT: "bg-sticker-blue text-foreground",
    HOTEL: "bg-sticker-lilac text-foreground",
    ACTIVITY: "bg-sticker-yellow text-foreground",
    RESTAURANT: "bg-sticker-pink text-foreground",
    OTHER: "bg-sticker-green text-foreground",
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

    let mapsUrl = event.url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.title)}`;
    if (event.lat && event.lng) {
        mapsUrl = `https://www.google.com/maps?q=${event.lat},${event.lng}`;
    } else if (event.address || event.location) {
        mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address || event.location || "")}`;
    }

    const displayLocation = event.address || event.location || null;
    const cardColorClass = eventTypeColors[event.type] || eventTypeColors.OTHER;

    return (
        <div className={cn("overflow-hidden group flex flex-col transition-transform duration-300 rounded-2xl p-5 md:p-4 border-2 border-border hover:-translate-y-2 relative min-h-[220px] md:min-h-[200px] cursor-pointer shadow-[0_6px_0_rgba(0,0,0,0.08)]", cardColorClass)}>

            <MapPin className="absolute -bottom-6 -left-6 h-32 w-32 md:h-28 md:w-28 opacity-10 pointer-events-none" strokeWidth={3} />

            <button
                className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-full bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity z-10 text-foreground hover:bg-black/20"
                onClick={handleDelete}
                disabled={isDeleting}
            >
                <Trash2 className="h-5 w-5" strokeWidth={2.5} />
            </button>

            <div className="flex flex-col flex-1 gap-4 relative z-10">
                <div className="flex justify-between items-start gap-2">
                    <div className="uppercase tracking-widest font-black text-[10px] md:text-[9px] bg-black/10 inline-block px-2.5 py-0.5 rounded-full border border-black/5 w-fit">
                        {event.type}
                    </div>

                    <button
                        onClick={handleToggleVote}
                        disabled={isVoting}
                        className={cn("flex items-center gap-2 px-4 py-2 rounded-sticker font-black text-sm transition-all border-2 text-foreground shadow-none border-transparent", hasVoted ? "bg-foreground text-background" : "bg-black/10 hover:bg-black/20")}
                    >
                        <Heart className={cn("h-4 w-4", hasVoted && "fill-current")} strokeWidth={3} />
                        {voteCount}
                    </button>
                </div>

                <h3 className="font-black text-2xl md:text-xl leading-[1.05] line-clamp-2 mt-1" title={event.title}>{event.title}</h3>

                <p className="text-sm md:text-xs font-bold opacity-80 line-clamp-2 flex-1 pt-1">
                    {event.description || "No description provided."}
                </p>

                {displayLocation && (
                    <div className="flex items-start gap-2 text-sm font-bold opacity-90 mt-2">
                        <Navigation className="h-5 w-5 shrink-0" strokeWidth={3} />
                        <span className="line-clamp-1">{displayLocation}</span>
                    </div>
                )}

                <div className="flex flex-wrap gap-2 pt-4 mt-auto border-t-2 border-black/10">
                    <a href={mapsUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 font-bold bg-background text-foreground px-3 py-1.5 rounded-xl text-xs border-2 border-border hover:border-foreground transition-all">
                        <MapPin className="h-3.5 w-3.5" strokeWidth={3} />
                        Maps
                    </a>

                    {event.url && (
                        <a href={event.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 font-bold bg-black/10 text-foreground px-3 py-1.5 rounded-xl text-xs hover:bg-black/20 transition-all">
                            <ExternalLink className="h-3.5 w-3.5" strokeWidth={3} />
                            Source
                        </a>
                    )}

                    <div className="flex-1" />

                    <AddEventModal tripId={tripId} defaultDate={undefined}>
                        <button className="flex items-center gap-1.5 font-black bg-foreground text-background px-3.5 py-1.5 rounded-xl text-xs hover:translate-y-[1px] transition-transform shadow-stickerSoft">
                            <CalendarPlus className="h-4 w-4" strokeWidth={3} />
                            Schedule
                        </button>
                    </AddEventModal>
                </div>

                {/* Voters Avatars */}
                {voteCount > 0 && (
                    <div className="flex items-center gap-3 pt-4 border-t-2 border-black/10 mt-2">
                        <span className="text-xs font-black uppercase tracking-widest bg-black/10 px-2 py-1 rounded-sm">Votes</span>
                        <div className="flex -space-x-2 overflow-hidden">
                            {event.votes.slice(0, 5).map(vote => {
                                let userAvatar = null;
                                const member = event.trip.members.find(m => m.user.id === vote.userId);
                                if (member && member.user.avatar) userAvatar = member.user.avatar;

                                return (
                                    <div key={vote.id} className="relative h-8 w-8 rounded-full border-2 border-transparent bg-background flex items-center justify-center shrink-0 overflow-hidden shadow-none">
                                        {userAvatar ? (
                                            <Image src={userAvatar} alt="Voter" fill className="object-cover" unoptimized />
                                        ) : (
                                            <span className="text-xs font-black text-foreground">U</span>
                                        )}
                                    </div>
                                )
                            })}
                            {voteCount > 5 && (
                                <div className="h-8 w-8 rounded-full border-2 border-foreground flex items-center justify-center text-xs font-black text-foreground bg-background">
                                    +{voteCount - 5}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
