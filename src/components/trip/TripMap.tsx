"use client";

import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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

// Mock data for map
const mockLocations = [
  {
    id: "1",
    title: "Senso-ji Temple",
    type: "activity",
    position: [35.7147, 139.7963] as [number, number],
    description: "Ancient Buddhist temple in Asakusa",
    time: "09:00",
  },
  {
    id: "2",
    title: "Park Hyatt Tokyo",
    type: "accommodation",
    position: [35.6856, 139.6909] as [number, number],
    description: "Luxury hotel with city views",
    time: "Check-in 14:00",
  },
  {
    id: "3",
    title: "Tsukiji Outer Market",
    type: "food",
    position: [35.6655, 139.7707] as [number, number],
    description: "Fresh seafood and street food",
    time: "12:30",
  },
];

const eventTypeColors: Record<string, string> = {
  transport: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  accommodation: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  activity: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  food: "bg-orange-500/10 text-orange-500 border-orange-500/20",
};

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 13);
  }, [center, map]);
  return null;
}

export default function TripMap() {
  const [activeLocation, setActiveLocation] = useState(mockLocations[0]);

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Mobile: horizontal scrollable location cards */}
      <div className="block lg:hidden">
        <ScrollArea className="w-full">
          <div className="flex gap-3 px-1 pb-2 min-w-max">
            {mockLocations.map((location) => (
              <Card
                key={location.id}
                className={`cursor-pointer transition-all hover:bg-muted/50 w-[200px] shrink-0 ${activeLocation.id === location.id ? "border-emerald-500 bg-emerald-500/5" : ""}`}
                onClick={() => setActiveLocation(location)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-5 ${eventTypeColors[location.type]}`}>
                      {location.type}
                    </Badge>
                    <div className="flex items-center text-[10px] text-muted-foreground">
                      <Clock className="h-3 w-3 mr-0.5" />
                      {location.time}
                    </div>
                  </div>
                  <h4 className="font-semibold text-sm truncate">{location.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                    {location.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>
      </div>

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row gap-6 h-[50vh] lg:h-[calc(100vh-200px)] min-h-[300px] lg:min-h-[500px]">
        {/* Desktop sidebar list */}
        <div className="hidden lg:flex w-80 flex-col gap-4 overflow-y-auto pr-2">
          {mockLocations.map((location) => (
            <Card
              key={location.id}
              className={`cursor-pointer transition-all hover:bg-muted/50 ${activeLocation.id === location.id ? "border-emerald-500 bg-emerald-500/5" : ""}`}
              onClick={() => setActiveLocation(location)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className={eventTypeColors[location.type]}>
                    {location.type}
                  </Badge>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {location.time}
                  </div>
                </div>
                <h4 className="font-semibold">{location.title}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {location.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Map Container */}
        <div className="flex-1 rounded-2xl overflow-hidden border border-border/40 relative z-0">
          <MapContainer
            center={activeLocation.position}
            zoom={13}
            scrollWheelZoom={true}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater center={activeLocation.position} />

            {mockLocations.map((location) => (
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
                      <Badge variant="outline" className={`h-5 ${eventTypeColors[location.type]}`}>
                        {location.type}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-base">{location.title}</h3>
                    <p className="text-sm text-muted-foreground">{location.description}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
