"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Calendar,
  Map,
  Wallet,
  FileText,
  Users,
  Settings,
  Lightbulb,
  LayoutGrid,
  X,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes (e.g. after tapping a section or browser back)
  useEffect(() => {
    const id = requestAnimationFrame(() => setMobileMenuOpen(false));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return (
    <>
      {/* Desktop: sticky folder-style tabs */}
      <div className="hidden md:block sticky top-0 z-30 bg-background transition-all w-full min-w-0 overflow-x-auto overflow-y-hidden border-b border-border/50">
        <nav className="flex items-end justify-start gap-0.5 w-max min-w-full px-2 pt-2" aria-label="Trip sections">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.href;
            return (
              <Link
                key={tab.href}
                href={`/trip/${tripId}/${tab.href}`}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-bold transition-all whitespace-nowrap select-none shrink-0 relative",
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
        <div className="h-[2px] bg-border" />
      </div>

      {/* Mobile: floating trigger + grid menu */}
      <div className="md:hidden">
        {/* Trigger dot — above bottom nav */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open trip sections"
          className={cn(
            "fixed z-40 right-4 rounded-full border-2 border-border bg-card shadow-sticker-card hover:shadow-sticker-card-hover active:scale-95 transition-all flex items-center justify-center",
            "bottom-[calc(4rem+env(safe-area-inset-bottom))]",
            "h-12 w-12"
          )}
        >
          <LayoutGrid className="h-5 w-5 text-foreground" strokeWidth={2.5} />
        </button>

        {/* Overlay when menu open */}
        {mobileMenuOpen && (
          <>
            <button
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div
              className="fixed left-4 right-4 z-50 rounded-2xl border-2 border-border bg-card shadow-sticker-modal p-4 pb-6"
              style={{
                bottom: "calc(4rem + env(safe-area-inset-bottom) + 0.5rem)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Sections
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close"
                  className="h-8 w-8 rounded-full border-2 border-border bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4" strokeWidth={2.5} />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {tabs.map((tab) => {
                  const isActive = currentTab === tab.href;
                  return (
                    <Link
                      key={tab.href}
                      href={`/trip/${tripId}/${tab.href}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border-2 font-bold text-sm transition-all active:scale-[0.98]",
                        "border-border shadow-sticker-sm hover:-translate-y-px hover:shadow-sticker-card",
                        isActive
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted/30 text-foreground hover:bg-muted/50"
                      )}
                    >
                      <tab.icon className="h-5 w-5 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                      <span className="text-center leading-tight">{tab.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Mobile: compact label of current section (so user knows where they are) — no tabs row, just a thin strip or nothing */}
      <div className="md:hidden h-0" aria-hidden />
    </>
  );
}
