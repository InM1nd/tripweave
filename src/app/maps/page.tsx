"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const GlobalMap = dynamic(() => import("@/components/map/GlobalMap"), {
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
            <div className="space-y-4 h-full flex flex-col p-4 md:p-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">World Map</h1>
                    <p className="text-muted-foreground">View all your adventures on the globe.</p>
                </div>
                <GlobalMap />
            </div>
        </DashboardLayout>
    );
}
