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
  Lightbulb
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "timeline", icon: Calendar, label: "Timeline" },
  { href: "suggested", icon: Lightbulb, label: "Suggested Places" },
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
    <div className="sticky top-14 md:top-0 z-30 bg-background/80 backdrop-blur-xl transition-all pt-0 pb-2 overflow-visible">
      {/* Segmented bar: space for shadow below */}
      <div className="rounded-2xl border-2 border-border bg-muted/30 shadow-[0_3px_0_rgba(0,0,0,0.08)] p-1.5">
        <nav className="flex items-center gap-1.5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full p-1">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.href;
            return (
              <Link
                key={tab.href}
                href={`/trip/${tripId}/${tab.href}`}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap select-none shrink-0 min-w-0",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-[0_4px_0_rgba(0,0,0,0.15)] border-2 border-border"
                    : "bg-transparent text-muted-foreground hover:bg-muted/70 hover:text-foreground border-2 border-transparent"
                )}
              >
                <tab.icon className="h-4 w-4 shrink-0" />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
