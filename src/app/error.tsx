"use client";

import { useEffect, useState } from "react";
import { WifiOff, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StickerSurface } from "@/components/ui/StickerSurface";
import { StickerBadge } from "@/components/ui/StickerBadge";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    setIsOffline(!navigator.onLine);

    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  useEffect(() => {
    if (!isOffline) {
      console.error("[ErrorBoundary]", error);
    }
  }, [error, isOffline]);

  const title = isOffline ? "You are offline" : "Something went wrong";
  const description = isOffline
    ? "Check your Wi-Fi or mobile data, then try again."
    : "An unexpected error occurred. Try refreshing the page.";
  const badgeLabel = isOffline ? "No connection" : "Error";
  const BadgeIcon = isOffline ? WifiOff : AlertTriangle;

  return (
    <div className="min-h-dvh bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <StickerSurface className="bg-card p-8 flex flex-col items-center gap-5 text-center">
          <div className="bg-sticker-blue border-2 border-border rounded-2xl p-5 shadow-sticker-card">
            <BadgeIcon className="h-10 w-10 text-foreground" strokeWidth={2.5} />
          </div>

          <StickerBadge color="pink" uppercase>
            {badgeLabel}
          </StickerBadge>

          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-black tracking-tighter text-foreground leading-[0.9]">
              {title}
            </h1>
            <p className="text-sm font-bold text-muted-foreground">
              {description}
            </p>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Button
              onClick={reset}
              className="w-full rounded-full font-black border-2 border-border shadow-sticker-card hover:-translate-y-0.5 hover:shadow-sticker-card-hover transition-all"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try again
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="w-full rounded-full font-black border-2 border-border shadow-sticker-card hover:-translate-y-0.5 hover:shadow-sticker-card-hover transition-all"
            >
              Reload page
            </Button>
          </div>
        </StickerSurface>

        <p className="text-center text-xs font-bold text-muted-foreground mt-4 opacity-60">
          TripWeave · Plan Together Beautifully
        </p>
      </div>
    </div>
  );
}
