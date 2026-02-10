"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  Home,
  Bell,
  Compass,
  Settings,
  Map,
  Plus,
  Plane,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/explore", icon: Compass, label: "Explore" },
  { href: "/maps", icon: Map, label: "Maps" },
  { href: "/notifications", icon: Bell, label: "Notifications" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <div className="min-h-screen flex bg-background">
        {/* Desktop Sidebar */}
        <aside
          className="hidden md:flex flex-col border-r border-border/40 bg-sidebar/50 backdrop-blur-sm sticky top-0 h-screen w-64 lg:w-72 shrink-0 transition-all duration-300 ease-in-out"
        >
          {/* Logo */}
          <div className="h-16 flex items-center justify-between border-b border-border/40 px-6 shrink-0">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
                <Plane className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-none">TripWeave</span>
                <span className="text-[10px] text-muted-foreground">Plan together</span>
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
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
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
                <div className="h-px bg-border/40" />
              </div>

              {/* Quick Create */}
              <Link
                href="#"
                className="flex items-center gap-3 px-3.5 py-3.5 rounded-xl text-sm font-medium bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="h-5 w-5 flex-shrink-0" />
                <span>New Trip</span>
              </Link>
            </nav>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-border/40 shrink-0 space-y-1">
            <Link
              href="/settings"
              className={cn(
                "flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all",
                pathname === "/settings"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Settings className="h-5 w-5 flex-shrink-0" />
              <span>Settings</span>
            </Link>

            <div className="flex items-center gap-2 px-3 py-3 rounded-xl bg-muted/30 mt-2">
              <UserButton afterSignOutUrl="/" />
              <div className="flex-1" />
              <ThemeToggle />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen pb-20 md:pb-0">
          {/* Mobile Header */}
          <header className="md:hidden sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border/40">
            <div className="px-4 h-14 flex items-center justify-between">
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white">
                  <Plane className="h-4 w-4" />
                </div>
                <span className="font-bold">TripWeave</span>
              </Link>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-[1600px] mx-auto w-full">
            {children}
          </main>

          {/* Mobile Bottom Navigation */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border/40 bg-background/90 backdrop-blur-xl z-50">
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
        active ? "text-primary" : "text-muted-foreground"
      )}
    >
      <div className={cn(
        "p-2 rounded-xl transition-colors",
        active && "bg-primary/10"
      )}>
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}
