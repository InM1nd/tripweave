"use client";

import { PageHeader } from "@/components/ui/PageHeader";
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
                <PageHeader
                    badge={{ label: "🌍 Global View", color: "green" }}
                    title="World Map"
                    description="View all your adventures on the globe."
                />

                <div className="flex-1 min-h-[500px] border-4 border-border rounded-3xl overflow-hidden shadow-sticker-modal relative bg-card/50">
                    <GlobalMap />
                </div>
            </div>
        </DashboardLayout>
    );
}
