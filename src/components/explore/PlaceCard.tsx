"use client";

import { Star, Link as LinkIcon, Plus, Trash2, MapPin, Youtube, TreePine, Utensils, Landmark, Camera, Sparkles, Navigation, Film } from "lucide-react";
import { DestructiveAlertDialog } from "@/components/ui/alert-dialog";
import { Place } from "@prisma/client";
import { getStickerBgClass } from "@/lib/design-tokens";
import { deletePlace } from "@/actions/place";
import { toast } from "sonner";
import { useState } from "react";

function buildGoogleMapsUrl(name: string, location?: string | null): string {
    const query = [name, location].filter(Boolean).join(", ");
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function getCategoryInfo(type: string): { icon: typeof Camera; colorClass: string } {
    const t = type?.toLowerCase() || "";
    if (t.includes("instagram") || t.includes("media") || t.includes("camera")) return { icon: Camera, colorClass: getStickerBgClass("lilac") };
    if (t.includes("tiktok")) return { icon: Film, colorClass: getStickerBgClass("lilac") };
    if (t.includes("youtube")) return { icon: Youtube, colorClass: getStickerBgClass("lilac") };
    if (t.includes("nature") || t.includes("park") || t.includes("unusual")) return { icon: TreePine, colorClass: getStickerBgClass("green") };
    if (t.includes("food") || t.includes("restaurant") || t.includes("cafe")) return { icon: Utensils, colorClass: getStickerBgClass("yellow") };
    if (t.includes("must see") || t.includes("attraction")) return { icon: Star, colorClass: "bg-primary text-primary-foreground" };
    if (t.includes("culture") || t.includes("history") || t.includes("museum")) return { icon: Landmark, colorClass: getStickerBgClass("blue") };
    if (t.includes("ai rec") || t.includes("ai_recommendation")) return { icon: Sparkles, colorClass: getStickerBgClass("pink") };
    if (t.includes("imported")) return { icon: LinkIcon, colorClass: getStickerBgClass("pink") };
    return { icon: Navigation, colorClass: getStickerBgClass("pink") };
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

    const location = 'location' in place ? place.location : null;
    const googleMapsUrl = buildGoogleMapsUrl(title ?? "", location);
    const categoryInfo = getCategoryInfo(sourceType ?? "");
    const Icon = categoryInfo.icon;

    const handleDelete = async () => {
        if (!('id' in place) || typeof place.id !== 'string') return;

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
        <div className={`overflow-hidden group flex flex-col rounded-2xl p-5 md:p-4 border-2 border-border relative h-full flex-1 min-h-[280px] cursor-pointer shadow-sticker-card ${categoryInfo.colorClass}`}>
            {/* Background decorative icon — same position as Suggested */}
            <Icon className="absolute -bottom-6 -right-6 h-32 w-32 md:h-28 md:w-28 opacity-10 pointer-events-none" strokeWidth={3} />

            {!isRecommendation && "id" in place && (
                <DestructiveAlertDialog
                    trigger={
                        <button
                            className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-full bg-black/10 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 text-foreground hover:bg-black/25 hover:scale-110"
                            onClick={(e) => e.stopPropagation()}
                            disabled={isDeleting}
                        >
                            <Trash2 className="h-5 w-5" strokeWidth={2.5} />
                        </button>
                    }
                    title="Delete place?"
                    description="This place will be permanently removed from your list. This action cannot be undone."
                    confirmLabel="Delete"
                    onConfirm={handleDelete}
                />
            )}

            <div className="flex flex-col flex-1 gap-4 relative z-10 min-h-0">
                <div className="flex justify-between items-start gap-2">
                    <div className="uppercase tracking-widest font-black text-[10px] md:text-[9px] bg-black/10 px-2.5 py-0.5 rounded-full border border-black/5 w-fit flex items-center gap-1.5">
                        <Icon className="h-3.5 w-3.5 md:h-3 md:w-3" strokeWidth={3} />
                        {sourceType}
                    </div>
                </div>

                <h3 className="font-black text-2xl md:text-xl leading-[1.05] line-clamp-2 mt-1" title={title ?? undefined}>
                    {title}
                </h3>

                <p className="text-sm md:text-xs font-bold opacity-80 line-clamp-2 flex-1 min-h-0 pt-1">
                    {place.description || "No description available."}
                </p>

                {location && (
                    <div className="flex items-start gap-2 text-sm font-bold opacity-90 mt-2">
                        <MapPin className="h-5 w-5 shrink-0" strokeWidth={3} />
                        <span className="line-clamp-1">{location}</span>
                    </div>
                )}

                <div className="flex flex-wrap items-center gap-2 pt-4 mt-auto border-t-2 border-black/10 shrink-0">
                    <a href={googleMapsUrl} target="_blank" rel="noreferrer" title="Open in Maps" className={`flex items-center justify-center h-9 w-9 rounded-full font-bold ${getStickerBgClass("green")} border-2 border-border shadow-sticker-sm hover:-translate-y-1 hover:shadow-sticker-card-hover hover:scale-105 transition-all duration-200`}>
                        <MapPin className="h-4 w-4" strokeWidth={3} />
                    </a>
                    {place.url && (
                        <a href={place.url} target="_blank" rel="noreferrer" title="Open source" className={`flex items-center justify-center h-9 w-9 rounded-full font-bold ${getStickerBgClass("blue")} border-2 border-border shadow-sticker-sm hover:-translate-y-1 hover:shadow-sticker-card-hover hover:scale-105 transition-all duration-200`}>
                            <LinkIcon className="h-4 w-4" strokeWidth={3} />
                        </a>
                    )}
                    <button type="button" onClick={() => onAddToTrip?.(String(place.id))} className="flex items-center justify-center h-9 w-9 rounded-full font-black bg-primary text-primary-foreground border-2 border-border shadow-sticker-sm hover:-translate-y-1 hover:shadow-sticker-card-hover hover:scale-105 hover:bg-primary/90 transition-all duration-200 ml-auto" title="Add to Trip">
                        <Plus className="h-4 w-4" strokeWidth={3} />
                    </button>
                </div>
            </div>
        </div>
    );
}
