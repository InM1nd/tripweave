"use client";

import { memo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const STICKER_FILLS = [
  "var(--sticker-pink)",
  "var(--sticker-blue)",
  "var(--sticker-green)",
  "var(--sticker-lilac)",
  "var(--sticker-yellow)",
  "var(--sticker-coral)",
  "var(--sticker-olive)",
];

function pickFill(index: number) {
  return STICKER_FILLS[index % STICKER_FILLS.length];
}

export const WorldMapBg = memo(function WorldMapBg({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={`absolute inset-0 w-full h-full ${className ?? ""}`} aria-hidden>
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{ scale: 160, center: [10, 10] }}
        width={960}
        height={500}
        style={{ width: "100%", height: "100%" }}
        className="hero-map-cover"
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }: { geographies: { rsmKey: string }[] }) =>
            geographies.map((geo: { rsmKey: string }, i: number) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={pickFill(i)}
                fillOpacity={0.12}
                stroke="var(--border)"
                strokeWidth={0.8}
                strokeLinejoin="round"
                strokeLinecap="round"
                style={{
                  default: { outline: "none" },
                  hover: { outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>

      {/* Edge fade — radial gradient so the map dissolves into the bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 40%, var(--background) 100%)",
        }}
      />
    </div>
  );
});
