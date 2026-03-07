"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const GlobalMap = dynamic(() => import("@/components/map/GlobalMap").then(mod => mod.GlobalMap), {
    loading: () => (
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    ),
    ssr: false,
});

export default function MapsPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6 h-full flex flex-col p-4 md:p-0">
                <div className="flex flex-col items-start gap-1.5">
                    <div className="bg-sticker-green text-foreground px-3 py-1 rounded-full font-black text-xs border-2 border-border shadow-[0_3px_0_rgba(0,0,0,0.08)] inline-block mb-1 -rotate-1">
                        🌍 Global View
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-foreground leading-[0.9]">
                        World Map
                    </h1>
                    <p className="text-muted-foreground font-bold text-sm mt-1">View all your adventures on the globe.</p>
                </div>

                <div className="flex-1 min-h-[500px] border-4 border-border rounded-3xl overflow-hidden shadow-[0_8px_0_rgba(0,0,0,0.1)] relative bg-card/50">
                    <GlobalMap />
                </div>
            </div>
        </DashboardLayout>
    );
}
