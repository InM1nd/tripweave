"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Plane,
  MapPin,
  Users,
  Compass,
  ArrowRight,
  Sun,
  Moon,
  Camera,
  Coffee,
  Globe2,
  CalendarDays,
  Star,
  Luggage,
  Map,
  Stamp,
  Ticket,
  Heart,
  Shield,
  Zap,
  MessageCircle,
  ChevronDown,
  Sparkles,
  Clock,
  DollarSign,
  Bookmark,
  TrendingUp,
  GripVertical,
  Navigation,
  Plus,
  Utensils,
  TreePine,
  Landmark,
} from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { RevealOnScroll, RevealItem } from "@/components/landing/RevealOnScroll";
import { StickerCard, StampBadge, TicketButton } from "@/components/landing/StickerCard";
import { WorldMapBg } from "@/components/landing/WorldMap";
import { useRef, useState, useEffect } from "react";

/* ─── Parallax background helper ──────────────────────────────── */
function ParallaxDecor({
  children,
  speed = 0.1,
  className,
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * -120]);
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

/* ─── Theme toggle for landing header ─────────────────────────── */
function LandingThemeToggle() {
  const [theme, setTheme] = useState<string>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      const current = document.documentElement.getAttribute("data-theme") || "light";
      setTheme(current);
      setMounted(true);
    });
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch { }
  };

  if (!mounted) {
    return <div className="h-10 w-10 rounded-full bg-secondary/50" />;
  }

  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="h-10 w-10 rounded-full border-2 border-border bg-card flex items-center justify-center shadow-[0_3px_0_rgba(0,0,0,0.08)] hover:shadow-[0_5px_0_rgba(0,0,0,0.10)] transition-shadow"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === "dark" ? (
          <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
            <Moon className="h-4 w-4" />
          </motion.div>
        ) : (
          <motion.div key="sun" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
            <Sun className="h-4 w-4" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

/* ─── FAQ Accordion Item ──────────────────────────────────────── */
function FaqItem({
  q,
  a,
  defaultOpen = false,
}: {
  q: string;
  a: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-2 border-border rounded-3xl bg-card shadow-[0_4px_0_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left font-bold text-lg hover:bg-secondary/40 transition-colors rounded-3xl"
      >
        <span>{q}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
      >
        <p className="px-5 pb-5 text-muted-foreground leading-relaxed">
          {a}
        </p>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*  LANDING PAGE                                                  */
/* ═══════════════════════════════════════════════════════════════ */

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground font-sans transition-colors duration-300 overflow-x-hidden">
      {/* ── Navbar (fixed so it stays visible on scroll) ─────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 lg:px-12 h-16 flex items-center justify-between border-b-2 border-border bg-background/95 backdrop-blur-md transition-colors duration-300 shadow-[0_4px_0_rgba(0,0,0,0.06)]">
        <Link className="flex items-center gap-2.5 group" href="/">
          <div className="h-9 w-9 rounded-2xl bg-primary flex items-center justify-center shadow-[0_3px_0_rgba(0,0,0,0.10)]">
            <Plane className="h-5 w-5 text-primary-foreground" strokeWidth={3} />
          </div>
          <span className="font-extrabold text-xl tracking-tighter text-foreground">
            TripWeave
          </span>
        </Link>
        <nav className="flex items-center gap-3">
          <LandingThemeToggle />
          <Link href="/login" className="hidden sm:inline-block">
            <span className="font-bold text-sm text-muted-foreground hover:text-foreground transition-colors px-4">
              Log in
            </span>
          </Link>
          <Link href="/login?signup=true">
            <Button className="font-bold px-6 h-10 rounded-full shadow-[0_4px_0_rgba(0,0,0,0.10)] hover:-translate-y-px hover:shadow-[0_6px_0_rgba(0,0,0,0.10)] transition-all border-2 border-border">
              Start Free
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 relative z-10 flex flex-col items-center w-full pt-16">
        {/* ── HERO ──────────────────────────────────────────────── */}
        <section className="w-full relative px-4 sm:px-6 lg:px-8 pt-20 pb-28 md:pt-28 md:pb-36 flex flex-col items-center justify-center min-h-[90vh] overflow-hidden">

          {/* World map background — fills entire hero */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <WorldMapBg className="opacity-60" />
          </div>

          {/* ── Hero stickers — distributed around the headline ── */}

          {/* Top-left: weather badge */}
          <ParallaxDecor speed={0.15} className="absolute top-[10%] left-4 sm:left-8 lg:left-[8%] pointer-events-none z-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 6 }}
              animate={{ opacity: 1, scale: 1, rotate: 6 }}
              transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="bg-sticker-yellow rounded-full px-4 py-3 flex items-center gap-2 text-foreground font-bold text-xl shadow-[0_5px_0_rgba(0,0,0,0.10)] border-2 border-border animate-float-y"
            >
              <Sun className="h-7 w-7" strokeWidth={2.5} />
              34°C
            </motion.div>
          </ParallaxDecor>

          {/* Top-right: gate ticket */}
          <ParallaxDecor speed={0.06} className="absolute top-[10%] right-4 sm:right-8 lg:right-[8%] pointer-events-none z-20">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="bg-sticker-coral text-white font-black text-xl sm:text-2xl px-4 py-2.5 rounded-full shadow-[0_5px_0_rgba(0,0,0,0.10)] border-2 border-border -rotate-2"
            >
              <span className="flex items-center gap-2">
                <Ticket className="h-5 w-5" strokeWidth={3} /> GATE B26
              </span>
            </motion.div>
          </ParallaxDecor>

          {/* Left middle: trip card */}
          <ParallaxDecor speed={0.18} className="absolute top-[34%] left-4 sm:left-6 lg:left-[5%] pointer-events-none z-20 hidden md:block">
            <motion.div
              initial={{ opacity: 0, x: -30, rotate: -6 }}
              animate={{ opacity: 1, x: 0, rotate: -6 }}
              transition={{ delay: 0.6, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="bg-sticker-lilac rounded-3xl p-4 text-foreground shadow-[0_6px_0_rgba(0,0,0,0.10)] border-2 border-border w-44 lg:w-52"
            >
              <Plane className="h-5 w-5 mb-2" strokeWidth={3} />
              <div className="font-black text-base lg:text-lg leading-tight">Barcelona Trip</div>
              <div className="text-xs font-bold opacity-80 mt-1">Jun 12 — Jun 18</div>
              <div className="flex -space-x-2 mt-3">
                <div className="w-6 h-6 rounded-full bg-sticker-yellow border-2 border-sticker-lilac text-[10px] font-black flex items-center justify-center text-foreground">A</div>
                <div className="w-6 h-6 rounded-full bg-sticker-coral border-2 border-sticker-lilac text-[10px] font-black flex items-center justify-center text-white">B</div>
                <div className="w-6 h-6 rounded-full bg-sticker-olive border-2 border-sticker-lilac text-[10px] font-black flex items-center justify-center text-white">C</div>
              </div>
            </motion.div>
          </ParallaxDecor>

          {/* Right middle: compass card */}
          <ParallaxDecor speed={0.08} className="absolute top-[36%] right-4 sm:right-6 lg:right-[5%] pointer-events-none z-20 hidden md:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: -4 }}
              transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="bg-sticker-blue rounded-3xl p-4 text-foreground font-bold text-sm lg:text-base shadow-[0_5px_0_rgba(0,0,0,0.10)] max-w-[140px] text-center leading-tight border-2 border-border"
            >
              <Compass className="h-8 w-8 lg:h-9 lg:w-9 mx-auto mb-2" strokeWidth={2.5} />
              Explore new<br />horizons
            </motion.div>
          </ParallaxDecor>

          {/* Bottom-left: camera icon */}
          <ParallaxDecor speed={0.2} className="absolute bottom-[14%] left-4 sm:left-10 lg:left-[12%] pointer-events-none z-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: -8 }}
              transition={{ delay: 0.8, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="bg-sticker-olive rounded-full h-14 w-14 sm:h-16 sm:w-16 flex items-center justify-center text-white shadow-[0_5px_0_rgba(0,0,0,0.10)] border-2 border-border"
            >
              <Camera className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={2.5} />
            </motion.div>
          </ParallaxDecor>

          {/* Bottom-center-left: coffee icon (hidden on small) */}
          <ParallaxDecor speed={0.12} className="absolute bottom-[8%] left-[30%] pointer-events-none z-20 hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
              animate={{ opacity: 1, scale: 1, rotate: 10 }}
              transition={{ delay: 1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="bg-sticker-pink rounded-full h-14 w-14 flex items-center justify-center text-foreground shadow-[0_5px_0_rgba(0,0,0,0.10)] border-2 border-border animate-float-y"
              style={{ animationDelay: "1s" }}
            >
              <Coffee className="h-7 w-7" strokeWidth={2.5} />
            </motion.div>
          </ParallaxDecor>

          {/* Bottom-center-right: BCN stamp */}
          <ParallaxDecor speed={0.14} className="absolute bottom-[8%] right-[28%] pointer-events-none z-20 hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-24 h-24 rounded-full border-4 border-dashed border-sticker-coral flex flex-col items-center justify-center text-sticker-coral font-black rotate-12"
            >
              <span className="text-[9px] uppercase tracking-[0.2em]">Approved</span>
              <span className="text-lg leading-none mt-0.5">BCN</span>
              <span className="text-[9px] uppercase tracking-[0.15em]">2026</span>
            </motion.div>
          </ParallaxDecor>

          {/* Bottom-right: globe icon */}
          <ParallaxDecor speed={0.1} className="absolute bottom-[14%] right-4 sm:right-10 lg:right-[12%] pointer-events-none z-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 8 }}
              animate={{ opacity: 1, scale: 1, rotate: 8 }}
              transition={{ delay: 0.9, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="bg-sticker-green rounded-full h-14 w-14 sm:h-16 sm:w-16 flex items-center justify-center text-foreground shadow-[0_5px_0_rgba(0,0,0,0.10)] border-2 border-border"
            >
              <Globe2 className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={2.5} />
            </motion.div>
          </ParallaxDecor>

          {/* Main Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center relative z-30 flex flex-col items-center max-w-4xl mx-auto"
          >
            <div className="mb-6">
              <span className="text-muted-foreground font-bold tracking-wide text-base md:text-lg">
                The collaborative travel planner. Real-time, beautiful, free.
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[100px] font-black tracking-tighter leading-[0.92] mb-10 text-foreground">
              Plan<br />
              Together<br />
              Beautifully
            </h1>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-4 relative z-10">
              <Link href="/dashboard" className="inline-block">
                <TicketButton>
                  <Plane className="h-5 w-5 shrink-0" strokeWidth={3} />
                  Create a Trip
                  <ArrowRight className="h-5 w-5 shrink-0" strokeWidth={3} />
                </TicketButton>
              </Link>
              <Link href="/explore" className="inline-block">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 h-14 text-lg font-bold rounded-full border-2 shadow-[0_4px_0_rgba(0,0,0,0.08)] transition-all text-foreground bg-card hover:bg-secondary hover:-translate-y-px hover:shadow-[0_6px_0_rgba(0,0,0,0.10)] border-border"
                >
                  <MapPin className="mr-2 h-5 w-5" strokeWidth={3} /> Explore Places
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* ── HOW IT WORKS ──────────────────────────────────────── */}
        <section className="section-raised w-full bg-landing-yellow py-24 md:py-32 border-t-2 border-border relative overflow-hidden">
          <ParallaxDecor speed={0.05} className="absolute top-8 right-12 opacity-20 pointer-events-none hidden md:block">
            <Map className="h-32 w-32 text-sticker-olive" strokeWidth={1} />
          </ParallaxDecor>
          <div className="absolute bottom-10 left-10 w-20 h-20 rounded-full bg-landing-coral-blur blur-2xl pointer-events-none" />
          <div className="absolute top-1/3 left-6 w-12 h-12 rounded-full bg-landing-blue-blur blur-xl pointer-events-none" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="text-center mb-16">
                <StampBadge color="yellow">
                  <Sparkles className="h-4 w-4" /> How it works
                </StampBadge>
                <h2 className="text-4xl md:text-5xl font-black mt-6 text-foreground">
                  Three steps to your dream trip
                </h2>
              </div>
            </RevealOnScroll>

            <RevealOnScroll stagger className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              <RevealItem>
                <StickerCard color="green" rotate={-1.5} className="h-full">
                  <div className="bg-foreground text-background w-10 h-10 rounded-full flex items-center justify-center font-black text-lg mb-4 shadow-[0_3px_0_rgba(0,0,0,0.15)]">
                    1
                  </div>
                  <Globe2 className="h-10 w-10 mb-3" strokeWidth={2.5} />
                  <h3 className="font-black text-2xl mb-2">Create a trip</h3>
                  <p className="font-bold opacity-80 leading-relaxed">
                    Pick a destination, set the dates, and share an invite link with your crew.
                  </p>
                </StickerCard>
              </RevealItem>

              <RevealItem>
                <StickerCard color="blue" rotate={1} className="h-full md:mt-6">
                  <div className="bg-foreground text-background w-10 h-10 rounded-full flex items-center justify-center font-black text-lg mb-4 shadow-[0_3px_0_rgba(0,0,0,0.15)]">
                    2
                  </div>
                  <Heart className="h-10 w-10 mb-3" strokeWidth={2.5} />
                  <h3 className="font-black text-2xl mb-2">Vote & collect</h3>
                  <p className="font-bold opacity-80 leading-relaxed">
                    Everyone suggests spots, votes on favorites, and saves places from social media.
                  </p>
                </StickerCard>
              </RevealItem>

              <RevealItem>
                <StickerCard color="lilac" rotate={-2} className="h-full">
                  <div className="bg-foreground text-background w-10 h-10 rounded-full flex items-center justify-center font-black text-lg mb-4 shadow-[0_3px_0_rgba(0,0,0,0.15)]">
                    3
                  </div>
                  <CalendarDays className="h-10 w-10 mb-3" strokeWidth={2.5} />
                  <h3 className="font-black text-2xl mb-2">Build a plan</h3>
                  <p className="font-bold opacity-80 leading-relaxed">
                    Drag & drop events into a day-by-day timeline. Done — go explore!
                  </p>
                </StickerCard>
              </RevealItem>
            </RevealOnScroll>
          </div>
        </section>

        {/* ── FEATURES ──────────────────────────────────────────── */}
        <section className="section-inset w-full bg-landing-surface py-24 md:py-32 border-t-2 border-border relative overflow-hidden">
          <div className="absolute top-12 left-8 w-16 h-16 rounded-full bg-landing-coral-blur blur-2xl pointer-events-none" />
          <div className="absolute bottom-16 right-12 w-24 h-24 rounded-full bg-landing-lilac-blur blur-2xl pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 w-20 h-20 rounded-full bg-landing-olive-blur blur-2xl pointer-events-none" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="text-center mb-16">
                <StampBadge color="coral">
                  <Zap className="h-4 w-4" /> Features
                </StampBadge>
                <h2 className="text-4xl md:text-5xl font-black mt-6 text-foreground">
                  Organize the chaos
                </h2>
                <p className="text-muted-foreground font-bold text-lg mt-3 max-w-xl mx-auto">
                  Everything your group needs — from brainstorming to boarding.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { icon: Users, title: "Real-time collab", desc: "Everyone edits together. See changes instantly.", color: "green" as const, r: 1 },
                { icon: CalendarDays, title: "Smart schedule", desc: "Drag-and-drop timeline to build the perfect itinerary.", color: "blue" as const, r: -1.5 },
                { icon: DollarSign, title: "Budget tracker", desc: "Split expenses, track costs per event and per person.", color: "yellow" as const, r: 2 },
                { icon: MapPin, title: "Interactive maps", desc: "See all your pins on a map. Plan routes visually.", color: "coral" as const, r: -1 },
                { icon: Sparkles, title: "AI suggestions", desc: "Get smart place recommendations based on your vibe.", color: "lilac" as const, r: 1.5 },
                { icon: Shield, title: "Private & secure", desc: "Invite-only trips. Your data stays yours.", color: "olive" as const, r: -2 },
              ].map((feat) => (
                <RevealItem key={feat.title}>
                  <StickerCard color={feat.color} rotate={feat.r} className="h-full icon-bounce">
                    <feat.icon className="h-8 w-8 mb-3" strokeWidth={2.5} />
                    <h3 className="font-black text-xl mb-1">{feat.title}</h3>
                    <p className="font-bold opacity-75 text-sm leading-relaxed">{feat.desc}</p>
                  </StickerCard>
                </RevealItem>
              ))}
            </RevealOnScroll>
          </div>
        </section>

        {/* ── DASHBOARD PREVIEW ────────────────────────────────── */}
        <section className="section-raised w-full bg-landing-blue py-24 md:py-32 border-t-2 border-border relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="text-center mb-16">
                <StampBadge color="blue">
                  <Sparkles className="h-4 w-4" /> Your Dashboard
                </StampBadge>
                <h2 className="text-4xl md:text-5xl font-black mt-6 text-foreground">
                  All your trips in one place
                </h2>
                <p className="text-muted-foreground font-bold text-lg mt-3 max-w-xl mx-auto">
                  Track stats, manage adventures, and start new trips with one click.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll>
              <div className="relative max-w-5xl mx-auto">
                {/* Browser chrome */}
                <div className="bg-card rounded-3xl border-2 border-border shadow-[0_8px_0_rgba(0,0,0,0.08),0_4px_32px_rgba(0,0,0,0.06)] overflow-hidden">
                  {/* Browser bar */}
                  <div className="flex items-center gap-2 px-5 py-3 border-b-2 border-border bg-secondary/30">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-sticker-coral" />
                      <div className="w-3 h-3 rounded-full bg-sticker-yellow" />
                      <div className="w-3 h-3 rounded-full bg-sticker-green" />
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="bg-background rounded-full px-4 py-1 text-xs font-bold text-muted-foreground border border-border max-w-xs w-full text-center">
                        tripweave.app/dashboard
                      </div>
                    </div>
                  </div>

                  {/* Dashboard content mockup */}
                  <div className="p-5 md:p-8">
                    {/* Stats row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                      {[
                        { label: "Total Trips", value: "12", icon: Plane, color: "bg-sticker-blue" },
                        { label: "Upcoming", value: "3", icon: CalendarDays, color: "bg-sticker-green" },
                        { label: "Countries", value: "8", icon: Globe2, color: "bg-sticker-lilac" },
                        { label: "Places Saved", value: "47", icon: Bookmark, color: "bg-sticker-yellow" },
                      ].map((stat) => (
                        <div key={stat.label} className="bg-background rounded-2xl border-2 border-border p-4 shadow-[0_3px_0_rgba(0,0,0,0.05)]">
                          <div className={`w-8 h-8 ${stat.color} rounded-xl flex items-center justify-center mb-2`}>
                            <stat.icon className="h-4 w-4 text-foreground" strokeWidth={2.5} />
                          </div>
                          <div className="font-black text-2xl">{stat.value}</div>
                          <div className="text-xs font-bold text-muted-foreground">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Trip cards row */}
                    <div className="text-sm font-black text-foreground mb-3 flex items-center gap-2">
                      <Luggage className="h-4 w-4" /> Your Adventures
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[
                        { name: "Barcelona", dates: "Jun 12-18", color: "bg-sticker-coral", members: 3 },
                        { name: "Tokyo", dates: "Aug 3-14", color: "bg-sticker-blue", members: 2 },
                        { name: "Bali", dates: "Sep 20-28", color: "bg-sticker-green", members: 4 },
                      ].map((trip) => (
                        <div key={trip.name} className={`${trip.color} rounded-2xl p-4 border-2 border-border shadow-[0_4px_0_rgba(0,0,0,0.08)] relative overflow-hidden`}>
                          <Plane className="absolute bottom-2 right-2 h-16 w-16 opacity-10" strokeWidth={1.5} />
                          <div className="relative z-10">
                            <div className="font-black text-lg text-foreground">{trip.name}</div>
                            <div className="text-xs font-bold opacity-70 mt-0.5 flex items-center gap-1">
                              <CalendarDays className="h-3 w-3" /> {trip.dates}
                            </div>
                            <div className="flex -space-x-1.5 mt-3">
                              {Array.from({ length: trip.members }).map((_, i) => (
                                <div key={i} className="w-6 h-6 rounded-full bg-card border-2 border-current/10 text-[10px] font-black flex items-center justify-center">
                                  {String.fromCharCode(65 + i)}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating decoration */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="absolute -top-5 -right-5 md:-right-10 bg-sticker-yellow rounded-full px-4 py-2 shadow-[0_4px_0_rgba(0,0,0,0.10)] border-2 border-border font-black text-sm rotate-6 z-20"
                >
                  <TrendingUp className="h-4 w-4 inline mr-1" /> 12 trips!
                </motion.div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ── FEATURE DEEP DIVES (Collab + Timeline) ──────────── */}
        <section className="section-inset w-full bg-landing-pink py-24 md:py-32 border-t-2 border-border relative overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {/* Collab */}
              <RevealOnScroll direction="left">
                <div className="bg-sticker-green rounded-3xl p-10 flex flex-col items-start min-h-[400px] border-2 border-border shadow-[0_8px_0_rgba(0,0,0,0.10),0_4px_24px_rgba(0,0,0,0.06)] -rotate-[1.5deg] transition-transform hover:rotate-0 hover:-translate-y-1">
                  <div className="bg-black/10 text-foreground px-6 py-2 rounded-full font-bold text-lg mb-8 uppercase tracking-widest inline-flex items-center gap-2 shadow-[0_2px_0_rgba(0,0,0,0.06)]">
                    <Globe2 className="w-5 h-5" /> Collab
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black text-foreground leading-[1.1] mb-6">
                    Real-time<br />sync
                  </h3>
                  <p className="text-foreground/80 font-bold text-lg max-w-sm">
                    Invite your friends. Vote on places, split the budget, and make decisions together — all live.
                  </p>
                  <div className="mt-auto flex -space-x-4 pt-6">
                    <div className="w-14 h-14 rounded-full border-4 border-sticker-green bg-sticker-yellow text-foreground flex items-center justify-center font-bold text-xl shadow-[0_3px_0_rgba(0,0,0,0.10)]">A</div>
                    <div className="w-14 h-14 rounded-full border-4 border-sticker-green bg-sticker-coral text-white flex items-center justify-center font-bold text-xl shadow-[0_3px_0_rgba(0,0,0,0.10)]">B</div>
                    <div className="w-14 h-14 rounded-full border-4 border-sticker-green bg-sticker-lilac text-foreground flex items-center justify-center font-bold text-xl shadow-[0_3px_0_rgba(0,0,0,0.10)]">C</div>
                  </div>
                </div>
              </RevealOnScroll>

              {/* Schedule */}
              <RevealOnScroll direction="right">
                <div className="bg-sticker-blue rounded-3xl p-10 flex flex-col items-start min-h-[400px] border-2 border-border shadow-[0_8px_0_rgba(0,0,0,0.10),0_4px_24px_rgba(0,0,0,0.06)] rotate-[1.5deg] transition-transform hover:rotate-0 hover:-translate-y-1 mt-8 md:mt-0">
                  <div className="bg-black/10 text-foreground px-6 py-2 rounded-full font-bold text-lg mb-8 uppercase tracking-widest inline-flex items-center gap-2 shadow-[0_2px_0_rgba(0,0,0,0.06)]">
                    <CalendarDays className="w-5 h-5" /> Timeline
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black text-foreground leading-[1.1] mb-6">
                    Smart<br />schedule
                  </h3>
                  <p className="text-foreground/80 font-bold text-lg max-w-sm">
                    Visual timeline. Drag and drop events to build the perfect day-by-day itinerary.
                  </p>
                  <div className="mt-8 w-full space-y-3">
                    <div className="bg-sticker-coral h-12 w-full flex items-center px-4 rounded-2xl shadow-[0_3px_0_rgba(0,0,0,0.08)] border-2 border-border">
                      <span className="text-white font-bold text-sm">10:00 — Breakfast at La Boqueria</span>
                    </div>
                    <div className="bg-sticker-yellow h-12 w-4/5 flex items-center px-4 rounded-2xl shadow-[0_3px_0_rgba(0,0,0,0.08)] border-2 border-border">
                      <span className="text-foreground font-bold text-sm">12:30 — Sagrada Familia</span>
                    </div>
                    <div className="bg-sticker-pink h-12 w-full flex items-center px-4 rounded-2xl shadow-[0_3px_0_rgba(0,0,0,0.08)] border-2 border-border">
                      <span className="text-foreground font-bold text-sm">15:00 — Park Guell</span>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* ── TIMELINE PREVIEW ─────────────────────────────────── */}
        <section className="section-raised w-full bg-landing-lilac py-24 md:py-32 border-t-2 border-border relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="text-center mb-16">
                <StampBadge color="lilac">
                  <CalendarDays className="h-4 w-4" /> Timeline View
                </StampBadge>
                <h2 className="text-4xl md:text-5xl font-black mt-6 text-foreground">
                  Day-by-day itinerary
                </h2>
                <p className="text-muted-foreground font-bold text-lg mt-3 max-w-xl mx-auto">
                  Drag, drop, and organize every hour of your trip.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll>
              <div className="relative max-w-3xl mx-auto">
                <div className="bg-card rounded-3xl border-2 border-border shadow-[0_8px_0_rgba(0,0,0,0.08),0_4px_32px_rgba(0,0,0,0.06)] p-6 md:p-8">
                  {/* Day header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-14 w-14 rounded-2xl bg-primary/15 flex flex-col items-center justify-center shadow-[0_2px_0_rgba(0,0,0,0.06)]">
                      <span className="font-black text-lg leading-none text-primary">12</span>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">Jun</span>
                    </div>
                    <div>
                      <div className="font-black text-lg">Day 1 — Barcelona</div>
                      <div className="text-sm font-bold text-muted-foreground">4 events planned</div>
                    </div>
                  </div>

                  {/* Timeline events */}
                  <div className="space-y-3">
                    {[
                      { time: "09:00", title: "Breakfast", place: "La Boqueria Market", icon: Utensils, color: "bg-sticker-coral" },
                      { time: "11:00", title: "Sightseeing", place: "Sagrada Familia", icon: Landmark, color: "bg-sticker-yellow" },
                      { time: "14:00", title: "Lunch", place: "El Nacional", icon: Utensils, color: "bg-sticker-green" },
                      { time: "16:30", title: "Nature Walk", place: "Park Güell", icon: TreePine, color: "bg-sticker-lilac" },
                    ].map((event, i) => (
                      <motion.div
                        key={event.title + i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * i + 0.2, duration: 0.4 }}
                        className={`${event.color} rounded-2xl p-4 border-2 border-border shadow-[0_4px_0_rgba(0,0,0,0.08)] flex items-center gap-3`}
                      >
                        <div className="flex items-center gap-2 shrink-0">
                          <GripVertical className="h-4 w-4 opacity-30" />
                          <div className="w-8 h-8 rounded-xl bg-black/10 flex items-center justify-center">
                            <event.icon className="h-4 w-4" strokeWidth={2.5} />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-black text-sm">{event.title}</div>
                          <div className="text-xs font-bold opacity-60 flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {event.place}
                          </div>
                        </div>
                        <div className="text-xs font-black opacity-50 shrink-0 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {event.time}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Floating stickers */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="absolute -top-4 -left-4 md:-left-14 bg-sticker-pink rounded-full px-4 py-2 shadow-[0_4px_0_rgba(0,0,0,0.10)] border-2 border-border font-black text-sm -rotate-6 z-20"
                >
                  <GripVertical className="h-4 w-4 inline mr-1" /> Drag & drop
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="absolute -bottom-4 -right-4 md:-right-12 bg-sticker-olive rounded-full px-4 py-2 shadow-[0_4px_0_rgba(0,0,0,0.10)] border-2 border-border font-black text-sm text-white rotate-3 z-20"
                >
                  <Clock className="h-4 w-4 inline mr-1" /> Auto schedule
                </motion.div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ── EXPLORE PREVIEW ──────────────────────────────────── */}
        <section className="section-inset w-full bg-landing-green py-24 md:py-32 border-t-2 border-border relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="text-center mb-16">
                <StampBadge color="green">
                  <Compass className="h-4 w-4" /> Explore Places
                </StampBadge>
                <h2 className="text-4xl md:text-5xl font-black mt-6 text-foreground">
                  Discover hidden gems
                </h2>
                <p className="text-muted-foreground font-bold text-lg mt-3 max-w-xl mx-auto">
                  AI recommendations, saved spots from social media, and a personalized discovery feed.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll>
              <div className="relative max-w-5xl mx-auto">
                <div className="bg-card rounded-3xl border-2 border-border shadow-[0_8px_0_rgba(0,0,0,0.08),0_4px_32px_rgba(0,0,0,0.06)] p-5 md:p-8">
                  {/* Tabs mock */}
                  <div className="flex items-center gap-2 mb-6">
                    <div className="bg-primary text-primary-foreground rounded-full px-4 py-1.5 text-sm font-black flex items-center gap-1.5 shadow-[0_2px_0_rgba(0,0,0,0.10)]">
                      <Sparkles className="h-3.5 w-3.5" /> For You
                    </div>
                    <div className="bg-secondary rounded-full px-4 py-1.5 text-sm font-bold text-muted-foreground flex items-center gap-1.5">
                      <Bookmark className="h-3.5 w-3.5" /> My List
                    </div>
                  </div>

                  {/* Place cards grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { name: "Shibuya Crossing", cat: "Culture", catIcon: Landmark, color: "bg-sticker-lilac", location: "Tokyo, Japan", rating: "4.8" },
                      { name: "Cenote Suytun", cat: "Nature", catIcon: TreePine, color: "bg-sticker-green", location: "Valladolid, Mexico", rating: "4.9" },
                      { name: "Trastevere", cat: "Food", catIcon: Utensils, color: "bg-sticker-yellow", location: "Rome, Italy", rating: "4.7" },
                    ].map((place) => (
                      <motion.div
                        key={place.name}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className={`${place.color} rounded-2xl p-5 border-2 border-border shadow-[0_4px_0_rgba(0,0,0,0.08)] relative overflow-hidden`}
                      >
                        <place.catIcon className="absolute bottom-3 right-3 h-20 w-20 opacity-10" strokeWidth={1} />
                        <div className="relative z-10">
                          <div className="inline-flex items-center gap-1 bg-black/10 rounded-full px-2.5 py-0.5 text-xs font-bold mb-3">
                            <place.catIcon className="h-3 w-3" /> {place.cat}
                          </div>
                          <div className="font-black text-xl mb-1">{place.name}</div>
                          <div className="text-xs font-bold opacity-60 flex items-center gap-1 mb-2">
                            <MapPin className="h-3 w-3" /> {place.location}
                          </div>
                          <div className="flex items-center gap-3 mt-3">
                            <div className="flex items-center gap-1 text-xs font-black">
                              <Star className="h-3.5 w-3.5 fill-foreground" strokeWidth={0} /> {place.rating}
                            </div>
                            <div className="ml-auto flex items-center gap-1.5">
                              <div className="w-7 h-7 rounded-full bg-black/10 flex items-center justify-center">
                                <Navigation className="h-3.5 w-3.5" />
                              </div>
                              <div className="w-7 h-7 rounded-full bg-black/10 flex items-center justify-center">
                                <Plus className="h-3.5 w-3.5" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, rotate: -10, scale: 0.9 }}
                  whileInView={{ opacity: 1, rotate: -6, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="absolute -top-5 -left-4 md:-left-10 bg-sticker-coral text-white rounded-full px-4 py-2 shadow-[0_4px_0_rgba(0,0,0,0.10)] border-2 border-border font-black text-sm z-20"
                >
                  <Sparkles className="h-4 w-4 inline mr-1" /> AI picks
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="absolute -bottom-4 -right-4 md:-right-10 bg-sticker-blue rounded-full px-4 py-2 shadow-[0_4px_0_rgba(0,0,0,0.10)] border-2 border-border font-black text-sm rotate-3 z-20"
                >
                  <Heart className="h-4 w-4 inline mr-1" /> 47 saved
                </motion.div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ── SOCIAL PROOF ──────────────────────────────────────── */}
        <section className="section-raised w-full bg-landing-yellow py-24 md:py-32 border-t-2 border-border relative overflow-hidden">
          <div className="absolute top-20 right-16 w-32 h-32 rounded-full bg-landing-lilac-blur blur-3xl pointer-events-none opacity-80" />
          <ParallaxDecor speed={0.04} className="absolute bottom-8 left-8 opacity-15 pointer-events-none hidden md:block">
            <Stamp className="h-40 w-40 text-sticker-lilac rotate-12" strokeWidth={1} />
          </ParallaxDecor>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="text-center mb-16">
                <StampBadge color="pink">
                  <MessageCircle className="h-4 w-4" /> Testimonials
                </StampBadge>
                <h2 className="text-4xl md:text-5xl font-black mt-6 text-foreground">
                  Loved by travelers
                </h2>
              </div>
            </RevealOnScroll>

            <RevealOnScroll stagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  text: "TripWeave saved our group trip to Japan. Everyone added spots, we voted, and boom — perfect itinerary.",
                  name: "Maria K.",
                  role: "5 trips planned",
                  color: "yellow" as const,
                  rotate: -2,
                },
                {
                  text: "The timeline drag-and-drop is genius. Beats any spreadsheet we've ever used for trip planning.",
                  name: "Alex T.",
                  role: "Digital nomad",
                  color: "pink" as const,
                  rotate: 1.5,
                },
                {
                  text: "I love importing spots from Instagram and TikTok straight into our trip board. So smooth!",
                  name: "Priya S.",
                  role: "Content creator",
                  color: "green" as const,
                  rotate: -1,
                },
              ].map((review) => (
                <RevealItem key={review.name}>
                  <StickerCard color={review.color} rotate={review.rotate} tape className="h-full">
                    <Star className="h-5 w-5 mb-3 fill-foreground" strokeWidth={0} />
                    <p className="font-bold text-base leading-relaxed mb-6 opacity-90">
                      &ldquo;{review.text}&rdquo;
                    </p>
                    <div className="mt-auto border-t-2 border-black/10 pt-4">
                      <div className="font-black text-base">{review.name}</div>
                      <div className="text-sm font-bold opacity-60">{review.role}</div>
                    </div>
                  </StickerCard>
                </RevealItem>
              ))}
            </RevealOnScroll>
          </div>
        </section>

        {/* ── FAQ ────────────────────────────────────────────────── */}
        <section className="section-inset w-full bg-landing-olive py-24 md:py-32 border-t-2 border-border relative overflow-hidden">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="text-center mb-12">
                <StampBadge color="olive">
                  <MessageCircle className="h-4 w-4" /> FAQ
                </StampBadge>
                <h2 className="text-4xl md:text-5xl font-black mt-6 text-foreground">
                  Got questions?
                </h2>
              </div>
            </RevealOnScroll>

            <RevealOnScroll stagger>
              <div className="space-y-3">
                {[
                  { q: "Is TripWeave free?", a: "Yes! The core features — collaborative planning, timeline, maps, voting — are all free. We may offer premium add-ons in the future." },
                  { q: "Can I plan a trip solo?", a: "Absolutely. TripWeave works great for solo trips too. Collect places, build your timeline, and keep everything organized." },
                  { q: "How does the voting system work?", a: "Anyone in the trip can suggest a place. All members can then upvote their favorites with a single tap. The most-voted spots bubble to the top." },
                  { q: "Can I import spots from Instagram / TikTok?", a: "Yes! Just paste a link and we'll extract the place details automatically. You can also bulk-import from spreadsheets." },
                  { q: "Is my data private?", a: "All trips are invite-only by default. Your data is encrypted and we never sell it to third parties." },
                ].map((item, i) => (
                  <RevealItem key={item.q}>
                    <FaqItem q={item.q} a={item.a} defaultOpen={i === 0} />
                  </RevealItem>
                ))}
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ── FINAL CTA ─────────────────────────────────────────── */}
        <section className="section-raised w-full bg-landing-blue py-24 md:py-32 border-t-2 border-border text-center relative overflow-hidden">
          <ParallaxDecor speed={0.06} className="absolute top-6 left-[10%] opacity-15 pointer-events-none hidden md:block">
            <Compass className="h-24 w-24 text-sticker-blue rotate-12" strokeWidth={1.5} />
          </ParallaxDecor>
          <ParallaxDecor speed={0.08} className="absolute bottom-8 right-[12%] opacity-15 pointer-events-none hidden md:block">
            <Globe2 className="h-28 w-28 text-sticker-coral -rotate-6" strokeWidth={1.5} />
          </ParallaxDecor>

          <RevealOnScroll className="relative z-10">
            <h2 className="text-5xl md:text-6xl font-black text-foreground mb-4">
              TripWeave
            </h2>
            <p className="text-muted-foreground font-bold text-lg mb-10 max-w-lg mx-auto">
              Your next adventure starts here. Plan it together, beautifully.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Link href="/dashboard">
                <TicketButton>
                  <Plane className="h-5 w-5" strokeWidth={3} />
                  Start Planning — Free
                </TicketButton>
              </Link>
            </div>
            <a
              href="#"
              className="inline-block mt-8 text-base text-primary underline decoration-2 underline-offset-8 hover:text-foreground transition-colors font-bold"
            >
              tripweave.app
            </a>
          </RevealOnScroll>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t-2 border-border py-8 px-4 md:px-8 bg-background">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-bold">
            <div className="h-6 w-6 rounded-lg bg-primary flex items-center justify-center">
              <Plane className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={3} />
            </div>
            <span>&copy; {new Date().getFullYear()} TripWeave</span>
          </div>
          <div className="flex items-center gap-6 text-sm font-bold text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
