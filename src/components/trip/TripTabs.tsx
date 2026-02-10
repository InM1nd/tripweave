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
    <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/40">
      <ScrollArea className="w-full">
        <nav className="flex items-center gap-1 px-4 md:px-6 py-2 min-w-max">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.href;
            return (
              <Link
                key={tab.href}
                href={`/trip/${tripId}/${tab.href}`}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </nav>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  );
}
