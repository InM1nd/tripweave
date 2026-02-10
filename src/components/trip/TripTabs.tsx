"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  Map,
  Wallet,
  FileText,
  Users,
  Settings,
  LayoutGrid
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const tabs = [
  { href: "timeline", icon: Calendar, label: "Timeline" },
  { href: "itinerary", icon: LayoutGrid, label: "Itinerary" },
  { href: "map", icon: Map, label: "Map" },
  { href: "budget", icon: Wallet, label: "Budget" },
  { href: "documents", icon: FileText, label: "Docs" },
  { href: "members", icon: Users, label: "Members" },
  { href: "settings", icon: Settings, label: "Settings" },
];

interface TripTabsProps {
  tripId: string;
}

export function TripTabs({ tripId }: TripTabsProps) {
  const pathname = usePathname();
  const currentTab = pathname.split("/").pop();

  return (
    <div className="sticky top-14 md:top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/40 transition-all">
      <div className="w-full max-w-[100vw] overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <nav className="flex items-center gap-2 px-4 md:px-6 py-2 w-max min-w-full">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.href;
            return (
              <Link
                key={tab.href}
                href={`/trip/${tripId}/${tab.href}`}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap select-none shrink-0",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
