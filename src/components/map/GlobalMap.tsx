"use client";

import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

// Fix for default marker icons in Next.js
const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

const customIcon = new L.Icon({
    iconUrl: iconUrl,
    iconRetinaUrl: iconRetinaUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

// Mock data for global map (cities/countries)
const globalLocations = [
    {
        id: "trip_1",
        title: "Japan 2026",
        type: "Upcoming",
        position: [35.6762, 139.6503] as [number, number], // Tokyo
        description: "Tokyo, Kyoto, Osaka",
        date: "April 2026",
    },
    {
        id: "trip_2",
        title: "Weekend in Paris",
        type: "Past",
        position: [48.8566, 2.3522] as [number, number], // Paris
        description: "Romantic getaway",
        date: "June 2025",
    },
    {
        id: "trip_3",
        title: "New York Christmas",
        type: "Planning",
        position: [40.7128, -74.0060] as [number, number], // NYC
        description: "Holiday season in NYC",
        date: "Dec 2025",
    },
];

function MapUpdater({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, 4); // Zoom level 4 for global view
    }, [center, map]);
    return null;
}

export default function GlobalMap() {
    const [activeLocation, setActiveLocation] = useState(globalLocations[0]);

    return (
        <div className="flex flex-col gap-4 h-[calc(100dvh-130px)] md:h-[calc(100vh-140px)] w-full">
            <div className="flex-1 rounded-2xl overflow-hidden border border-border/40 relative z-0">
                <MapContainer
                    center={[30, 0]} // Global center
                    zoom={2}
                    scrollWheelZoom={true}
                    className="h-full w-full"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {/* <MapUpdater center={activeLocation.position} /> */}

                    {globalLocations.map((location) => (
                        <Marker
                            key={location.id}
                            position={location.position}
                            icon={customIcon}
                            eventHandlers={{
                                click: () => setActiveLocation(location),
                            }}
                        >
                            <Popup className="min-w-[200px]">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Badge variant={location.type === "Upcoming" ? "default" : "secondary"}>
                                            {location.type}
                                        </Badge>
                                    </div>
                                    <h3 className="font-bold text-base">{location.title}</h3>
                                    <p className="text-sm text-muted-foreground">{location.description}</p>
                                    <p className="text-xs text-muted-foreground pt-1 flex items-center">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        {location.date}
                                    </p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {/* Horizontal cards for locations */}
            <div className="flex gap-4 overflow-x-auto pb-2 px-1">
                {globalLocations.map((location) => (
                    <Card
                        key={location.id}
                        className={`min-w-[250px] cursor-pointer transition-all hover:bg-muted/50 ${activeLocation.id === location.id ? "border-primary bg-primary/5" : ""}`}
                        onClick={() => setActiveLocation(location)}
                    >
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold">{location.title}</h4>
                                <Badge variant="outline" className="text-[10px]">{location.type}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">{location.description}</p>
                            <div className="flex items-center text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3 mr-1" />
                                {location.position[0].toFixed(2)}, {location.position[1].toFixed(2)}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
