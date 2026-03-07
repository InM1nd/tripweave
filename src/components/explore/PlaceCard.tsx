"use client";

import { Star, Link as LinkIcon, Plus, Trash2, MapPin, Youtube, TreePine, Utensils, Landmark, Camera, Sparkles, Navigation, Film } from "lucide-react";
import { Place } from "@prisma/client";
import { deletePlace } from "@/actions/place";
import { toast } from "sonner";
import { useState } from "react";

function buildGoogleMapsUrl(name: string, location?: string | null): string {
    const query = [name, location].filter(Boolean).join(", ");
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function getCategoryInfo(type: string) {
    const t = type?.toLowerCase() || "";
    if (t.includes("instagram") || t.includes("media") || t.includes("camera")) return { icon: Camera, color: "bg-sticker-lilac text-foreground" };
    if (t.includes("tiktok")) return { icon: Film, color: "bg-sticker-lilac text-foreground" };
    if (t.includes("youtube")) return { icon: Youtube, color: "bg-sticker-lilac text-foreground" };
    if (t.includes("nature") || t.includes("park") || t.includes("unusual")) return { icon: TreePine, color: "bg-sticker-green text-foreground" };
    if (t.includes("food") || t.includes("restaurant") || t.includes("cafe")) return { icon: Utensils, color: "bg-sticker-yellow text-foreground" };
    if (t.includes("must see") || t.includes("attraction")) return { icon: Star, color: "bg-primary text-primary-foreground" };
    if (t.includes("culture") || t.includes("history") || t.includes("museum")) return { icon: Landmark, color: "bg-sticker-blue text-foreground" };
    if (t.includes("ai rec") || t.includes("ai_recommendation")) return { icon: Sparkles, color: "bg-sticker-pink text-foreground" };
    if (t.includes("imported")) return { icon: LinkIcon, color: "bg-sticker-pink text-foreground" };

    return { icon: Navigation, color: "bg-sticker-pink text-foreground" };
}

interface PlaceCardProps {
    place: Place | {
        id?: string | number;
        title?: string;
        name?: string;
        type?: string;
        rating?: number | null;
        image?: string | null;
        description?: string | null;
        url?: string | null;
        location?: string | null;
        source?: string;
    };
    isRecommendation?: boolean;
    onAddToTrip?: (id: string) => void;
}

export function PlaceCard({ place, isRecommendation = false, onAddToTrip }: PlaceCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const title = 'name' in place ? place.name : (place as { title?: string }).title;
    let sourceType = 'source' in place ? place.source : (place as { type?: string }).type;

    if (!sourceType || sourceType === 'LINK_PARSER' || sourceType === 'SOCIAL_IMPORT' || sourceType === 'AI_RECOMMENDATION') {
        if (place.url) {
            if (place.url.includes("instagram.com")) sourceType = "Instagram";
            else if (place.url.includes("tiktok.com")) sourceType = "TikTok";
            else if (place.url.includes("youtube.com")) sourceType = "YouTube";
            else sourceType = "Imported Place";
        } else {
            sourceType = sourceType === 'AI_RECOMMENDATION' ? 'AI Rec' : 'Imported Place';
        }
    }

    const rating = place.rating;
    const location = 'location' in place ? place.location : null;
    const googleMapsUrl = buildGoogleMapsUrl(title ?? "", location);
    const categoryInfo = getCategoryInfo(sourceType ?? "");
    const Icon = categoryInfo.icon;

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!('id' in place) || typeof place.id !== 'string') return;

        if (!confirm("Are you sure you want to delete this place?")) return;

        setIsDeleting(true);
        try {
            const result = await deletePlace(place.id);
            if (result.success) {
                toast.success("Place removed from your list");
            } else {
                toast.error(result.error || "Failed to delete");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <div className={`overflow-hidden group transition-transform duration-300 hover:-translate-y-2 p-5 md:p-4 flex flex-col relative rounded-2xl border-2 border-border min-h-[220px] md:min-h-[200px] cursor-pointer shadow-[0_6px_0_rgba(0,0,0,0.08)] ${categoryInfo.color}`}>
            {/* Background decorative Icon */}
            <Icon className="absolute -bottom-6 -right-6 h-36 w-36 md:h-28 md:w-28 opacity-[0.12] pointer-events-none" strokeWidth={3} />

            {!isRecommendation && 'id' in place && (
                <button
                    className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-full bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity z-10 text-foreground hover:bg-black/20"
                    onClick={handleDelete}
                    disabled={isDeleting}
                >
                    <Trash2 className="h-5 w-5" strokeWidth={2.5} />
                </button>
            )}

            <div className="flex flex-col h-full gap-4 relative z-10">
                <div className="flex items-start justify-between gap-2 pr-12">
                    <div>
                        <div className="uppercase tracking-widest font-black text-[10px] md:text-[9px] mb-2 bg-black/10 px-2.5 py-0.5 rounded-full border border-black/5 flex items-center gap-1.5 w-fit">
                            <Icon className="h-3.5 w-3.5 md:h-3 md:w-3" strokeWidth={3} />
                            {sourceType}
                        </div>
                        <h3 className="font-black text-2xl md:text-xl leading-[1.05] line-clamp-3 mb-1">{title}</h3>
                    </div>
                </div>

                <p className="text-sm md:text-xs font-bold opacity-80 line-clamp-2 mt-1 flex-1">
                    {place.description || "No description available."}
                </p>

                {location && (
                    <p className="text-xs font-bold opacity-90 flex items-center gap-1.5 mt-1">
                        <MapPin className="h-4 w-4 md:h-3.5 md:w-3.5 shrink-0" strokeWidth={2.5} />
                        <span className="line-clamp-1">{location}</span>
                    </p>
                )}

                {rating && (
                    <div className="flex items-center text-foreground text-xs font-black gap-1 mt-1">
                        <Star className="h-3.5 w-3.5 fill-current" strokeWidth={2.5} />
                        {rating}
                    </div>
                )}

                <div className="pt-3 flex flex-wrap gap-2 mt-auto border-t-2 border-black/10">
                    <a href={googleMapsUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 font-bold bg-background text-foreground px-3 py-1.5 rounded-xl text-xs border-2 border-border hover:border-foreground transition-all">
                        <MapPin className="h-3.5 w-3.5" strokeWidth={3} />
                        Maps
                    </a>
                    {place.url && (
                        <a href={place.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 font-bold bg-black/10 text-foreground px-3 py-1.5 rounded-xl text-xs hover:bg-black/20 transition-all">
                            <LinkIcon className="h-3.5 w-3.5" strokeWidth={3} />
                            Source
                        </a>
                    )}
                    <div className="flex-1" />
                    <button onClick={() => onAddToTrip?.(String(place.id))} className="flex items-center gap-1.5 font-black bg-foreground text-background px-3.5 py-1.5 rounded-xl text-xs hover:scale-105 transition-transform shadow-stickerSoft">
                        <Plus className="h-4 w-4" strokeWidth={3} />
                        Add to Trip
                    </button>
                </div>
            </div>
        </div>
    );
}
