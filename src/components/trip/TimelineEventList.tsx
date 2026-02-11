"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation, DollarSign } from "lucide-react";
import { EditEventSheet } from "@/components/trip/EditEventSheet";
// Removed unused imports: MapPin, Clock, ExternalLink, Button

const eventTypeColors: Record<string, string> = {
    TRANSPORT: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    HOTEL: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    ACTIVITY: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    RESTAURANT: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    OTHER: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

interface TimelineEventListProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    groupedEvents: Record<string, any[]>;
    tripId: string;
}

export function TimelineEventList({ groupedEvents, tripId }: TimelineEventListProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

    return (
        <div className="space-y-8 pb-20">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {Object.entries(groupedEvents).map(([dateKey, events]: [string, any[]]) => {
                const date = new Date(dateKey);
                return (
                    <div key={dateKey} className="relative">
                        {/* Date Header - Sticky */}
                        <div className="flex items-center gap-3 md:gap-4 mb-4 sticky top-28 z-20 bg-background/95 backdrop-blur-sm py-3 border-b border-border/40">
                            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex flex-col items-center justify-center shrink-0 shadow-sm">
                                <span className="text-xl font-bold text-primary leading-none">
                                    {date.getDate()}
                                </span>
                                <span className="text-[10px] text-primary font-medium uppercase tracking-wider">
                                    {date.toLocaleDateString("en-US", { month: "short" })}
                                </span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-foreground">
                                    {date.toLocaleDateString("en-US", { weekday: "long" })}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {events.length} {events.length === 1 ? "activity" : "activities"} planned
                                </p>
                            </div>
                        </div>

                        {/* Events Line */}
                        <div className="ml-6 pl-6 border-l-2 border-border/50 space-y-4">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {events.map((event: any) => {
                                // Build Google Maps URL logic
                                let mapsUrl: string;
                                const displayLocation = event.address || event.location || event.title;
                                if (event.lat && event.lng) {
                                    mapsUrl = `https://www.google.com/maps?q=${event.lat},${event.lng}`;
                                } else if (event.address) {
                                    mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`;
                                } else if (event.location) {
                                    mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`;
                                } else {
                                    mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.title)}`;
                                }

                                return (
                                    <Card
                                        key={event.id}
                                        className="relative border-border/40 bg-card/60 backdrop-blur-sm hover:bg-card hover:shadow-md transition-all cursor-pointer overflow-hidden group"
                                        onClick={() => setSelectedEvent(event)}
                                    >
                                        {event.coverImage && (
                                            <div className="relative h-32 w-full overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={event.coverImage}
                                                    alt={event.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <Badge
                                                    variant="secondary"
                                                    className={`absolute top-3 left-3 z-20 backdrop-blur-md border-white/20 text-white bg-black/40 ${eventTypeColors[event.type]?.replace('bg-', 'data-').replace('text-', 'data-')}`}
                                                >
                                                    {event.type}
                                                </Badge>
                                                {event.cost > 0 && (
                                                    <Badge className="absolute bottom-3 right-3 z-20 bg-green-500/90 hover:bg-green-600 text-white border-0 font-medium">
                                                        {event.currency} {event.cost}
                                                    </Badge>
                                                )}
                                            </div>
                                        )}

                                        <CardContent className="p-4">
                                            <div className="flex gap-4">
                                                {/* Time Column */}
                                                <div className="flex flex-col items-center gap-1 shrink-0 w-12 pt-0.5">
                                                    <span className="text-sm font-semibold text-foreground">{event.time}</span>
                                                    <div className="h-full w-px bg-border/50 my-1 group-hover:bg-primary/50 transition-colors" />
                                                </div>

                                                {/* Main Content */}
                                                <div className="flex-1 min-w-0 space-y-2">
                                                    <div>
                                                        {!event.coverImage && (
                                                            <Badge variant="outline" className={`mb-2 w-fit text-[10px] px-2 py-0 h-5 ${eventTypeColors[event.type] || eventTypeColors.OTHER}`}>
                                                                {event.type}
                                                            </Badge>
                                                        )}
                                                        <h4 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors pr-8">
                                                            {event.title}
                                                        </h4>
                                                    </div>

                                                    {event.description && (
                                                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                                            {event.description}
                                                        </p>
                                                    )}

                                                    <div className="flex items-center gap-2 pt-1">
                                                        <a
                                                            href={mapsUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/30 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                                                        >
                                                            <Navigation className="h-3 w-3" />
                                                            {displayLocation || "Map"}
                                                        </a>

                                                        {(!event.coverImage && event.cost > 0) && (
                                                            <div className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-2 py-1.5 rounded-full">
                                                                <DollarSign className="h-3 w-3" />
                                                                {event.cost}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                );
            })}

            {selectedEvent && (
                <EditEventSheet
                    event={selectedEvent}
                    open={!!selectedEvent}
                    onOpenChange={(open) => !open && setSelectedEvent(null)}
                    tripId={tripId}
                />
            )}
        </div>
    );
}
