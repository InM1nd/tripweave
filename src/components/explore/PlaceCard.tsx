"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Link as LinkIcon, Plus, Trash2 } from "lucide-react";
import { Place } from "@prisma/client";
import { deletePlace } from "@/actions/place";
import { toast } from "sonner";
import { useState } from "react";

interface PlaceCardProps {
    place: Place | {
        id: string | number;
        title: string;
        type?: string;
        rating?: number;
        image: string;
        description: string | null;
        url?: string
    };
    isRecommendation?: boolean;
    onAddToTrip?: (id: string) => void;
}

export function PlaceCard({ place, isRecommendation = false, onAddToTrip }: PlaceCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    // Normalize data structure since we use both Prisma Place and Mock Recommendations
    const title = 'name' in place ? place.name : (place as any).title;
    const type = 'source' in place ? (place.source === 'LINK_PARSER' ? 'Saved Link' : 'AI Rec') : (place as any).type;
    const rating = place.rating;

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
        <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all border-border/50 h-full flex flex-col relative">
            {!isRecommendation && 'id' in place && (
                <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    onClick={handleDelete}
                    disabled={isDeleting}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            )}
            <div className="aspect-video relative overflow-hidden bg-muted">
                {place.image ? (
                    <img
                        src={place.image}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                        <LinkIcon className="h-12 w-12 opacity-20" />
                    </div>
                )}
                <Badge className="absolute top-3 left-3 bg-background/80 backdrop-blur-md text-foreground hover:bg-background/90 shadow-sm">
                    {type}
                </Badge>
            </div>
            <CardContent className="p-4 space-y-3 flex-1 flex flex-col">
                <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-lg leading-tight line-clamp-1">{title}</h3>
                    {rating && (
                        <div className="flex items-center text-amber-500 text-xs font-bold gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full shrink-0">
                            <Star className="h-3 w-3 fill-current" />
                            {rating}
                        </div>
                    )}
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                    {place.description || "No description available."}
                </p>

                <div className="pt-2 flex gap-2">
                    {place.url && (
                        <Button variant="outline" size="sm" className="flex-1" asChild>
                            <a href={place.url} target="_blank" rel="noreferrer">
                                <LinkIcon className="mr-2 h-3 w-3" />
                                Visit
                            </a>
                        </Button>
                    )}
                    <Button size="sm" className="flex-1" onClick={() => onAddToTrip?.(String(place.id))}>
                        <Plus className="mr-2 h-3 w-3" />
                        Add to Trip
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
