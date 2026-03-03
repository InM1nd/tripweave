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
  Luggage
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { getTrips } from "@/actions/trip";
import { Skeleton } from "@/components/ui/skeleton";

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [trips, setTrips] = useState<any[]>([]);
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
      <div className="min-h-screen flex bg-bg-base">
        {/* Desktop Sidebar */}
        <aside
          className="hidden md:flex flex-col border-r border-border bg-bg-surface-2 sticky top-0 h-screen w-56 lg:w-60 shrink-0 transition-all duration-300 ease-in-out"
        >
          {/* Logo */}
          <div className="h-16 flex items-center justify-between border-b border-border px-6 shrink-0">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-md bg-accent flex items-center justify-center text-accent-text">
                <Plane className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-none text-text-primary">
                  TripWeave
                </span>
                <span className="text-[10px] text-text-muted">
                  Plan together
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1">
            <nav className="p-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all group",
                    pathname === item.href
                      ? "bg-accent-subtle text-accent rounded-pill"
                      : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {pathname === item.href && (
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  )}
                </Link>
              ))}

              <div className="my-6 px-2">
                <div className="h-px bg-border" />
              </div>

              {/* Quick Create */}
              <Link
                href="#"
                className="flex items-center gap-3 px-3.5 py-3.5 rounded-md text-sm font-medium bg-accent text-accent-text hover:bg-accent-hover transition-all hover:scale-[1.02] active:scale-[0.98] mb-4"
              >
                <Plus className="h-5 w-5 flex-shrink-0" />
                <span>New Trip</span>
              </Link>

              {/* Trips List */}
              <div className="space-y-1">
                <h4 className="px-4 text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider">
                  My Trips
                </h4>
                {loading ? (
                  <div className="px-4 space-y-2">
                    <Skeleton className="h-8 w-full rounded-lg bg-color-surface-3" />
                    <Skeleton className="h-8 w-3/4 rounded-lg bg-color-surface-3" />
                  </div>
                ) : trips.length > 0 ? (
                  trips.map((trip) => {
                    const isActive = pathname.startsWith(`/trip/${trip.id}`);
                    return (
                      <Link
                        key={trip.id}
                        href={`/trip/${trip.id}`}
                        className={cn(
                          "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group",
                          isActive
                            ? "bg-accent-subtle text-accent rounded-pill"
                            : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
                        )}
                      >
                        <Luggage className="h-4 w-4 flex-shrink-0 opacity-70" />
                        <span className="flex-1 truncate">{trip.name}</span>
                        {isActive && (
                          <ChevronRight className="h-3 w-3 opacity-50" />
                        )}
                      </Link>
                    );
                  })
                ) : (
                  <div className="px-4 py-2 text-xs text-text-muted italic">
                    No trips yet
                  </div>
                )}
              </div>
            </nav>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-border shrink-0 space-y-1">
            <Link
              href="/settings"
              className={cn(
                "flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all",
                pathname === "/settings"
                  ? "bg-accent-subtle text-accent rounded-pill"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
              )}
            >
              <Settings className="h-5 w-5 flex-shrink-0" />
              <span>Settings</span>
            </Link>

            <div className="flex items-center gap-2 px-3 py-3 rounded-xl bg-bg-hover mt-2">
              {/* <UserButton afterSignOutUrl="/" /> */}
              <div className="flex-1 flex justify-center">
                <UserButton afterSignOutUrl="/" />
              </div>
              <div className="flex-1" />
              <ThemeToggle />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen pb-20 md:pb-0">
          {/* Mobile Header */}
          <header className="md:hidden sticky top-0 z-20 bg-bg-base/80 backdrop-blur-xl border-b border-border">
            <div className="px-4 h-14 flex items-center justify-between">
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center text-accent-text">
                  <Plane className="h-4 w-4" />
                </div>
                <span className="font-bold text-text-primary">
                  TripWeave
                </span>
              </Link>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                {/* <UserButton afterSignOutUrl="/" /> */}
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </header>

          <main className="flex-1 p-0 md:p-8 lg:p-10 max-w-[1600px] mx-auto w-full">
            {children}
          </main>

          {/* Mobile Bottom Navigation */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-bg-base/90 backdrop-blur-xl z-50">
            <div className="flex items-center justify-around h-16 px-2">
              {navItems.slice(0, 4).map((item) => (
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
    </TooltipProvider>
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
        "flex flex-col items-center justify-center flex-1 h-full gap-1 active:scale-95 transition-all",
        active
          ? "text-accent"
          : "text-text-muted"
      )}
    >
      <div
        className={cn(
          "p-2 rounded-xl transition-colors",
          active && "bg-accent-subtle"
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}
