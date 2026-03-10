"use client";

import { WifiOff, Plane, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StickerBadge } from "@/components/ui/StickerBadge";
import { StickerSurface } from "@/components/ui/StickerSurface";

export default function OfflinePage() {
  return (
    <div className="min-h-dvh bg-background flex items-center justify-center p-6">
      {/* Decorative sticker top-left */}
      <div className="pointer-events-none fixed top-8 left-6 rotate-[-8deg] opacity-40 select-none hidden sm:block">
        <div className="bg-sticker-yellow border-2 border-border rounded-full p-3 shadow-sticker-card">
          <Plane className="h-5 w-5 text-foreground" />
        </div>
      </div>

      {/* Decorative sticker bottom-right */}
      <div className="pointer-events-none fixed bottom-10 right-8 rotate-[6deg] opacity-30 select-none hidden sm:block">
        <div className="bg-sticker-pink border-2 border-border rounded-full p-3 shadow-sticker-card">
          <Plane className="h-4 w-4 text-foreground" />
        </div>
      </div>

      <div className="w-full max-w-sm">
        <StickerSurface className="bg-card p-8 flex flex-col items-center gap-5 text-center">
          {/* Icon block */}
          <div className="bg-sticker-blue border-2 border-border rounded-2xl p-5 shadow-sticker-card">
            <WifiOff className="h-10 w-10 text-foreground" strokeWidth={2.5} />
          </div>

          {/* Badge */}
          <StickerBadge color="pink" uppercase>
            No connection
          </StickerBadge>

          {/* Copy */}
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-black tracking-tighter text-foreground leading-[0.9]">
              You are offline
            </h1>
            <p className="text-sm font-bold text-muted-foreground">
              Check your Wi-Fi or mobile data, then try again.
            </p>
          </div>

          {/* Retry */}
          <Button
            onClick={() => window.location.reload()}
            className="w-full rounded-full font-black border-2 border-border shadow-sticker-card hover:-translate-y-0.5 hover:shadow-sticker-card-hover transition-all"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </StickerSurface>

        {/* Footer label */}
        <p className="text-center text-xs font-bold text-muted-foreground mt-4 opacity-60">
          TripWeave · Plan Together Beautifully
        </p>
      </div>
    </div>
  );
}
