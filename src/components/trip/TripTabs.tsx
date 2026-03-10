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
  { href: "suggested", icon: Lightbulb, label: "Suggested" },
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
    <div className="sticky top-12 md:top-0 z-30 bg-background/80 backdrop-blur-xl transition-all overflow-visible">
      {/* Folder-style tabs row — pills stay left, don't stretch full width */}
      <nav className="flex items-end justify-start gap-0.5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full px-2 pt-2">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.href;
          return (
            <Link
              key={tab.href}
              href={`/trip/${tripId}/${tab.href}`}
              className={cn(
                "flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold transition-all whitespace-nowrap select-none shrink-0 relative",
                "rounded-t-xl border-2 border-b-0",
                isActive
                  ? "bg-card text-foreground border-border shadow-sticker-top z-10 -mb-[2px] pb-[calc(0.625rem+2px)]"
                  : "bg-muted/30 text-muted-foreground border-border/40 hover:bg-muted/60 hover:text-foreground hover:border-border/70"
              )}
            >
              <tab.icon className="h-4 w-4 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </nav>
      {/* Full-width border that active tab "sits on" */}
      <div className="h-[2px] bg-border" />
    </div>
  );
}
