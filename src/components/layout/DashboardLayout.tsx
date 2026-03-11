"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@/components/auth/UserButton";
import {
  Home,
  Bell,
  Compass,
  Settings,
  Map,
  Plus,
  Plane,
  ChevronRight,
  Luggage,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { getTrips } from "@/actions/trip";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/explore", icon: Compass, label: "Explore" },
  { href: "/maps", icon: Map, label: "Maps" },
  { href: "/notifications", icon: Bell, label: "Notifications" },
];

export function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isTrip = pathname.startsWith("/trip/");
  // Layout key: same for all tabs of a trip so tab switch doesn't remount header/tabs
  const layoutKey = isTrip
    ? "/" + pathname.split("/").slice(1, 3).join("/")
    : pathname;
  const [trips, setTrips] = useState<Awaited<ReturnType<typeof getTrips>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrips() {
      try {
        const data = await getTrips();
        setTrips(data);
      } catch (error) {
        console.error("Failed to load trips", error);
      } finally {
        setLoading(false);
      }
    }
    loadTrips();
  }, []);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="min-h-[100dvh] flex bg-bg-base">
        {/* Desktop Sidebar */}
        <aside
          className="hidden md:flex flex-col border-r-2 border-border bg-bg-surface-2 sticky top-0 h-screen w-52 lg:w-56 shrink-0 transition-all duration-300 ease-in-out"
        >
          <div className="h-16 flex items-center justify-between border-b-2 border-border px-4 shrink-0 bg-bg-surface-3">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="h-9 w-9 flex items-center justify-center">
                <Plane className="h-6 w-6 text-accent" strokeWidth={3} />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg leading-none text-foreground tracking-wide">
                  TripWeave
                </span>
                <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider mt-0.5">
                  Plan together
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1">
            <nav className="p-3 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold transition-all group border-2 relative",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sticker-sm border-border"
                        : "text-text-secondary hover:text-text-primary hover:bg-bg-surface-3 hover:border-border border-transparent"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-sticker"
                        className="absolute inset-0 bg-primary rounded-xl shadow-sticker-sm border-2 border-border -z-10"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <item.icon className="h-5 w-5 shrink-0" strokeWidth={2} />
                    <span className="flex-1 text-sm">{item.label}</span>
                    {isActive && (
                      <ChevronRight className="h-4 w-4 opacity-70" strokeWidth={2.5} />
                    )}
                  </Link>
                );
              })}

              <div className="my-4 px-2">
                <div className="h-px bg-border" />
              </div>

              {/* Quick Create */}
              <Link
                href="#"
                className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-sm font-black bg-accent text-accent-text hover:bg-accent-hover transition-transform hover:scale-105 active:scale-95 mb-3 shadow-none uppercase tracking-wide border-2 border-transparent"
              >
                <Plus className="h-5 w-5 shrink-0" strokeWidth={3} />
                <span>New Trip</span>
              </Link>

              {/* Trips List */}
              <div className="space-y-1 mt-3">
                <h4 className="px-3 text-[10px] font-black text-text-secondary mb-2 uppercase tracking-widest bg-bg-surface-3 inline-block py-0.5 rounded-lg ml-2">
                  My Trips
                </h4>
                {loading ? (
                  <div className="px-3 space-y-2">
                    <Skeleton className="h-9 w-full rounded-xl" />
                    <Skeleton className="h-9 w-3/4 rounded-xl" />
                  </div>
                ) : trips.length > 0 ? (
                  trips.map((trip) => {
                    const isActive = pathname.startsWith(`/trip/${trip.id}`);
                    return (
                      <Link
                        key={trip.id}
                        href={`/trip/${trip.id}`}
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold transition-all group border-2 border-transparent",
                          isActive
                            ? "bg-accent/20 text-accent border-accent/20 shadow-sticker-sm-soft"
                            : "text-text-secondary hover:text-foreground hover:bg-bg-surface-3 hover:border-border"
                        )}
                      >
                        <Luggage className="h-4 w-4 shrink-0 opacity-80" strokeWidth={2.5} />
                        <span className="flex-1 truncate text-sm">{trip.name}</span>
                        {isActive && (
                          <ChevronRight className="h-4 w-4 opacity-70" strokeWidth={3} />
                        )}
                      </Link>
                    );
                  })
                ) : (
                  <div className="px-3 py-1.5 text-[11px] text-text-muted italic">
                    No trips yet
                  </div>
                )}
              </div>
            </nav>
          </ScrollArea>

          {/* Footer */}
          <div className="p-3 border-t-2 border-border shrink-0 space-y-1">
            <Link
              href="/settings"
              className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold transition-all border-2 border-transparent",
                pathname === "/settings"
                  ? "bg-accent text-accent-text shadow-sticker-sm-soft"
                  : "text-text-secondary hover:text-foreground hover:bg-bg-surface-3 hover:border-border"
              )}
            >
              <Settings className="h-5 w-5 shrink-0" strokeWidth={2} />
              <span className="text-sm">Settings</span>
            </Link>

            <div className="flex items-center gap-2 px-2.5 py-2 rounded-xl bg-bg-hover mt-1.5 shadow-sticker-sm-soft">
              <div className="flex-1 flex justify-center">
                <UserButton afterSignOutUrl="/" />
              </div>
              <div className="flex-1" />
              <ThemeToggle />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-[100dvh] min-w-0 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
          {/* Mobile Header */}
          <header className="md:hidden sticky top-0 z-20 bg-background border-b-2 border-border">
            <div className="px-4 h-14 flex items-center justify-between">
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-accent flex items-center justify-center text-accent-text border-2 border-border shadow-sticker-sm">
                  <Plane className="h-4.5 w-4.5" strokeWidth={3} />
                </div>
                <span className="font-black text-base text-text-primary">
                  TripWeave
                </span>
              </Link>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </header>

          <main className="flex-1 min-w-0 px-4 py-4 md:p-5 lg:p-6 max-w-[1600px] mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={layoutKey}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="min-w-0"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Mobile Bottom Navigation */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t-2 border-border bg-background z-50 pb-[env(safe-area-inset-bottom)]">
            <div className="flex items-stretch justify-around h-16 px-1">
              {navItems.slice(0, 2).map((item) => (
                <MobileNavLink
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  active={pathname === item.href}
                />
              ))}

              {/* Centre Sections slot — always in DOM to prevent layout shift */}
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent("open-trip-sections"))}
                aria-label="Open trip sections"
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full gap-0.5 active:scale-95 transition-all",
                  isTrip ? "visible" : "invisible pointer-events-none"
                )}
              >
                <div className="p-2 rounded-xl bg-primary/15 border-2 border-primary/30">
                  <LayoutGrid className="h-5 w-5 text-primary" strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-black text-primary">Sections</span>
              </button>

              {navItems.slice(2, 4).map((item) => (
                <MobileNavLink
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  active={pathname === item.href}
                />
              ))}
            </div>
          </nav>
        </div>
      </div>
    </TooltipProvider >
  );
}

function MobileNavLink({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center justify-center flex-1 h-full gap-1 active:scale-95 transition-all relative",
        active
          ? "text-primary"
          : "text-text-muted"
      )}
    >
      <div
        className={cn(
          "p-2 rounded-xl transition-all duration-200",
          active && "bg-primary/15 border-2 border-primary/30 scale-105"
        )}
      >
        <Icon className="h-[22px] w-[22px]" strokeWidth={active ? 2.5 : 2} />
      </div>
      <span className={cn("text-[11px]", active ? "font-black" : "font-medium")}>{label}</span>
    </Link>
  );
}
