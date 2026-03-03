"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Link as LinkIcon, Plus, Trash2, MapPin, ExternalLink, Instagram, Youtube, TreePine, Utensils, Landmark, Camera, Sparkles, Navigation, Film } from "lucide-react";
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
    if (t.includes("instagram")) return { icon: Camera, color: "text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-900 bg-pink-50 dark:bg-pink-900/20" };
    if (t.includes("tiktok")) return { icon: Film, color: "text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-900 bg-cyan-50 dark:bg-cyan-900/20" };
    if (t.includes("youtube")) return { icon: Youtube, color: "text-red-500 dark:text-red-400 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20" };
    if (t.includes("nature") || t.includes("park") || t.includes("unusual")) return { icon: TreePine, color: "text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-900/20" };
    if (t.includes("food") || t.includes("restaurant") || t.includes("cafe")) return { icon: Utensils, color: "text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-900/20" };
    if (t.includes("must see") || t.includes("attraction")) return { icon: Star, color: "text-amber-500 dark:text-amber-400 border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/20" };
    if (t.includes("culture") || t.includes("history") || t.includes("museum")) return { icon: Landmark, color: "text-rose-500 dark:text-rose-400 border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-900/20" };
    if (t.includes("ai rec") || t.includes("ai_recommendation")) return { icon: Sparkles, color: "text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-900 bg-violet-50 dark:bg-violet-900/20" };
    if (t.includes("imported")) return { icon: LinkIcon, color: "text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/20" };

    return { icon: Navigation, color: "text-muted-foreground border-border bg-muted/50" };
}

interface PlaceCardProps {
    place: Place | {
        id: string | number;
        title: string;
        type?: string;
        rating?: number;
        image: string;
        description: string | null;
        url?: string;
        location?: string | null;
    };
    isRecommendation?: boolean;
    onAddToTrip?: (id: string) => void;
}

export function PlaceCard({ place, isRecommendation = false, onAddToTrip }: PlaceCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const title = 'name' in place ? place.name : (place as any).title;
    // For My List, display the category if available, otherwise fallback
    let sourceType = 'source' in place ? place.source : (place as any).type;

    // If it lacks a proper category (legacy data), try to derive platform from URL
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
    const googleMapsUrl = buildGoogleMapsUrl(title, location);

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
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <Card className="overflow-hidden group hover:shadow-md transition-all border-border/50 h-full flex flex-col relative p-4 bg-card/60 backdrop-blur-sm">
            {!isRecommendation && 'id' in place && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity z-10 text-muted-foreground hover:text-destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </Button>
            )}

            <div className="flex flex-col h-full gap-2">
                <div className="flex items-start justify-between gap-2 pr-6">
                    <div>
                        <Badge variant="outline" className={`mb-2 text-[10px] uppercase font-semibold h-5 px-2 flex items-center w-fit gap-1.5 ${getCategoryInfo(sourceType).color}`}>
                            {(() => {
                                const Icon = getCategoryInfo(sourceType).icon;
                                return <Icon className="h-3 w-3" />;
                            })()}
                            {sourceType}
                        </Badge>
                        <h3 className="font-bold text-base leading-tight line-clamp-1">{title}</h3>
                    </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 mt-1 flex-1">
                    {place.description || "No description available."}
                </p>

                {location && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-violet-500" />
                        <span className="line-clamp-1">{location}</span>
                    </p>
                )}

                {rating && (
                    <div className="flex items-center text-amber-500 text-xs font-bold gap-1 mt-1">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        {rating}
                    </div>
                )}

                <div className="pt-3 flex flex-wrap gap-2 mt-auto border-t">
                    <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs" asChild>
                        <a href={googleMapsUrl} target="_blank" rel="noreferrer">
                            <MapPin className="h-3 w-3" />
                            Maps
                        </a>
                    </Button>
                    {place.url && (
                        <Button variant="ghost" size="sm" className="gap-1.5 h-8 text-xs text-muted-foreground" asChild>
                            <a href={place.url} target="_blank" rel="noreferrer">
                                <LinkIcon className="h-3 w-3" />
                                Source
                            </a>
                        </Button>
                    )}
                    <div className="flex-1" />
                    <Button size="sm" onClick={() => onAddToTrip?.(String(place.id))} className="h-8 gap-1.5 text-xs">
                        <Plus className="h-3 w-3" />
                        Add to Trip
                    </Button>
                </div>
            </div>
        </Card>
    );
}
