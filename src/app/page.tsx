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
import { motion, useScroll, useTransform } from "framer-motion";
import { RevealOnScroll, RevealItem } from "@/components/landing/RevealOnScroll";
import { SectionHeader } from "@/components/landing/SectionHeader";
import { StickerCard, TicketButton } from "@/components/landing/StickerCard";
import { getStickerBgClass } from "@/lib/design-tokens";
import { WorldMapBg } from "@/components/landing/WorldMap";
import { SectionTape } from "@/components/landing/SectionTape";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { HeroSticker } from "@/components/landing/HeroSticker";
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

/* ─── FAQ Accordion Item — ticket style ───────────────────────── */
function FaqItem({
  q,
  a,
  defaultOpen = false,
  showStamp = false,
}: {
  q: string;
  a: string;
  defaultOpen?: boolean;
  showStamp?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="relative border-2 border-border rounded-3xl bg-card shadow-sticker-card overflow-hidden transition-all hover:-translate-y-px hover:shadow-sticker-card-hover flex">
      {/* Ticket perforation strip */}
      <div className="ticket-perforation-v w-4 shrink-0" aria-hidden="true" />

      {/* Content area */}
      <div className="flex-1 min-w-0 relative">
        {/* Decorative stamp on first item */}
        {showStamp && (
          <span
            aria-hidden="true"
            className={`absolute top-3 right-12 pointer-events-none z-10 inline-block rotate-3 ${getStickerBgClass("yellow")} text-[9px] font-black tracking-widest px-2 py-0.5 rounded-full border-2 border-border shadow-sticker-badge`}
          >
            FAQ
          </span>
        )}
        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="w-full flex items-center justify-between p-5 text-left font-bold text-lg hover:bg-secondary/40 transition-colors"
        >
          <span className="pr-2">{q}</span>
          <ChevronDown
            className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>
        <motion.div
          initial={false}
          animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          {/* Dashed tear line — appears as the ticket "tears open" */}
          <div className="mx-5 border-t-2 border-dashed border-border" aria-hidden="true" />
          <motion.p
            initial={false}
            animate={{ y: open ? 0 : -8, scale: open ? 1 : 0.99 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="px-5 pt-4 pb-5 text-muted-foreground leading-relaxed"
          >
            {a}
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*  LANDING PAGE                                                  */
/* ═══════════════════════════════════════════════════════════════ */

/* ─── Polaroid flip sticker (Testimonials section) ────────────── */
function PolaroidFlip() {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, rotate: 8 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 6 }}
      viewport={{ once: true }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="absolute bottom-16 right-8 md:right-20 z-10 hidden lg:block"
      style={{ perspective: 600 }}
    >
      <motion.button
        onClick={() => setFlipped((f) => !f)}
        aria-label="Flip polaroid"
        className="relative w-20 cursor-pointer focus-visible:outline-none"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ y: -3, scale: 1.06, transition: { duration: 0.18 } }}
      >
        {/* Front face */}
        <div
          className="bg-card border-2 border-border rounded-lg shadow-sticker-elevated p-1.5 w-20"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className={`${getStickerBgClass("blue")} rounded-sm h-16 flex items-center justify-center`}>
            <Camera className="h-7 w-7 text-foreground/60" strokeWidth={2} />
          </div>
          <div className="text-center mt-1">
            <span className="text-[8px] font-black text-muted-foreground">Memories</span>
          </div>
        </div>

        {/* Back face */}
        <div
          className={`absolute inset-0 ${getStickerBgClass("yellow")} border-2 border-border rounded-lg shadow-sticker-elevated p-2 w-20 flex flex-col items-center justify-center gap-1`}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <Heart className="h-5 w-5 text-foreground fill-foreground" strokeWidth={0} />
          <span className="text-[7px] font-black text-foreground text-center leading-tight">
            Thanks for the memories!
          </span>
        </div>
      </motion.button>
    </motion.div>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-background text-foreground font-sans transition-colors duration-300 overflow-x-hidden">
      {/* ── Header ─────────────────────────────────────────────── */}
      <LandingHeader />

      <main className="flex-1 relative z-10 flex flex-col items-center w-full pt-[67px]">
        {/* ── HERO ──────────────────────────────────────────────── */}
        <section className="w-full relative px-4 sm:px-6 lg:px-8 pt-20 pb-28 md:pt-28 md:pb-36 flex flex-col items-center justify-center min-h-[90dvh] overflow-hidden">

          {/* World map background — fills entire hero */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <WorldMapBg className="opacity-60" />
          </div>

          {/* ── Hero stickers — shuffled positions ── */}

          {/* Top-left: gate ticket (moved from top-right) */}
          <HeroSticker
            color="coral"
            shape="stadium"
            rotate={3}
            parallax
            parallaxSpeed={0.06}
            className="absolute top-[10%] left-4 sm:left-8 lg:left-[8%] pointer-events-none z-20"
            animate={{ delay: 0.4 }}
          >
            <span className="flex items-center gap-2 font-black text-lg sm:text-xl px-4 py-2.5">
              <Ticket className="h-5 w-5" strokeWidth={3} /> GATE B26
            </span>
          </HeroSticker>

          {/* Top-right: coffee (moved from bottom-center-left) */}
          <HeroSticker
            color="pink"
            shape="rect"
            rotate={10}
            parallax
            parallaxSpeed={0.12}
            className="absolute top-[12%] right-4 sm:right-8 lg:right-[8%] pointer-events-none z-20"
            animate={{ delay: 0.35, scale: 0.8 }}
          >
            <div className="h-14 w-14 flex items-center justify-center text-foreground animate-float-y">
              <Coffee className="h-7 w-7" strokeWidth={2.5} />
            </div>
          </HeroSticker>

          {/* Left: BCN stamp rectangular (moved from bottom-center-right) */}
          <ParallaxDecor speed={0.14} className="absolute top-[20%] left-4 sm:left-6 lg:left-[6%] pointer-events-none z-20 hidden sm:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-24 min-h-20 rounded-md border-2 border-dashed border-sticker-coral flex flex-col items-center justify-center py-2 px-2 text-sticker-coral font-black -rotate-8 bg-background/90 overflow-visible"
            >
              <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-8 border-t-sticker-coral" aria-hidden />
              <span className="text-[8px] uppercase tracking-[0.2em]">Approved</span>
              <span className="text-sm leading-none mt-0.5">BCN</span>
              <span className="text-[8px] uppercase tracking-widest">2026</span>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-8 border-b-sticker-coral" aria-hidden />
            </motion.div>
          </ParallaxDecor>

          {/* Left middle: compass — tag shape */}
          <HeroSticker
            color="blue"
            shape="tag"
            rotate={-4}
            parallax
            parallaxSpeed={0.18}
            className="absolute top-[38%] left-4 sm:left-6 lg:left-[5%] pointer-events-none z-20 hidden md:block"
            animate={{ delay: 0.6, scale: 0.8 }}
          >
            <div className="p-4 text-foreground font-bold text-sm lg:text-base max-w-[140px] text-center leading-tight">
              <Compass className="h-8 w-8 lg:h-9 lg:w-9 mx-auto mb-2" strokeWidth={2.5} />
              Explore new<br />horizons
            </div>
          </HeroSticker>

          {/* Right middle: trip card Barcelona (moved from left) */}
          <ParallaxDecor speed={0.08} className="absolute top-[32%] right-4 sm:right-6 lg:right-[5%] pointer-events-none z-20 hidden md:block">
            <motion.div
              initial={{ opacity: 0, x: 30, rotate: 6 }}
              animate={{ opacity: 1, x: 0, rotate: 6 }}
              transition={{ delay: 0.55, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={`${getStickerBgClass("lilac")} sticker-shape-squircle p-4 text-foreground shadow-sticker-card-hover border-2 border-border w-44 lg:w-52`}
            >
              <Plane className="h-5 w-5 mb-2" strokeWidth={3} />
              <div className="font-black text-base lg:text-lg leading-tight">Barcelona Trip</div>
              <div className="text-xs font-bold opacity-80 mt-1">Jun 12 — Jun 18</div>
              <div className="flex -space-x-2 mt-3">
                <div className={`w-6 h-6 rounded-full ${getStickerBgClass("yellow")} border-2 border-sticker-lilac text-[10px] font-black flex items-center justify-center text-foreground`}>A</div>
                <div className={`w-6 h-6 rounded-full ${getStickerBgClass("coral")} border-2 border-sticker-lilac text-[10px] font-black flex items-center justify-center text-white`}>B</div>
                <div className={`w-6 h-6 rounded-full ${getStickerBgClass("olive")} border-2 border-sticker-lilac text-[10px] font-black flex items-center justify-center text-white`}>C</div>
              </div>
            </motion.div>
          </ParallaxDecor>

          {/* Bottom-left: visa sticker (moved from bottom-right) */}
          <ParallaxDecor speed={0.1} className="absolute bottom-[16%] left-4 sm:left-10 lg:left-[10%] pointer-events-none z-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: -6 }}
              transition={{ delay: 0.85, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="visa-sticker relative bg-linear-to-b from-sticker-green to-sticker-olive text-foreground w-40 sm:w-44 border-2 border-border shadow-sticker-elevated"
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-foreground/10" />
              <div className="pt-3 pb-2.5 px-3">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-black text-[10px] uppercase tracking-[0.25em] text-foreground/80">Travel Visa</span>
                  <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-background/30 text-foreground">Valid</span>
                </div>
                <div className="visa-accent-line w-full my-1.5" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-md bg-background/40 flex items-center justify-center shrink-0">
                    <Stamp className="h-4 w-4 text-sticker-olive" strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-black text-sm leading-tight">Schengen</div>
                    <div className="text-[10px] font-bold opacity-90 tracking-wide">EU · 90 days</div>
                  </div>
                </div>
                <div className="mt-2 flex justify-between text-[9px] font-bold uppercase tracking-widest opacity-80">
                  <span>2026</span>
                  <span>BCN</span>
                </div>
              </div>
            </motion.div>
          </ParallaxDecor>

          {/* Bottom-center-left: weather pill (moved from top-left) */}
          <HeroSticker
            color="yellow"
            shape="pill"
            rotate={6}
            parallax
            parallaxSpeed={0.15}
            className="absolute bottom-[10%] left-[28%] pointer-events-none z-20 hidden lg:block"
            animate={{ delay: 0.3, scale: 0.8 }}
          >
            <div className="px-4 py-3 flex items-center gap-2 text-foreground font-bold text-xl animate-float-y" style={{ animationDelay: "0.5s" }}>
              <Sun className="h-7 w-7" strokeWidth={2.5} />
              34°C
            </div>
          </HeroSticker>

          {/* Bottom-center-right: round stamp PRG (moved from left) */}
          <ParallaxDecor speed={0.12} className="absolute bottom-[10%] right-[30%] pointer-events-none z-20 hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-20 h-20 rounded-full border-2 border-dashed border-sticker-blue flex flex-col items-center justify-center text-sticker-blue font-black rotate-12 bg-background/90"
            >
              <span className="text-[8px] uppercase tracking-[0.15em]">Entry</span>
              <span className="text-sm leading-none mt-0.5">PRG</span>
              <span className="text-[8px] uppercase tracking-widest">2026</span>
            </motion.div>
          </ParallaxDecor>

          {/* Bottom-right: camera blob (moved from bottom-left) */}
          <HeroSticker
            color="olive"
            shape="blob"
            rotate={8}
            parallax
            parallaxSpeed={0.2}
            className="absolute bottom-[14%] right-4 sm:right-10 lg:right-[12%] pointer-events-none z-20"
            animate={{ delay: 0.9, scale: 0.8 }}
          >
            <div className="h-14 w-14 sm:h-16 sm:w-16 flex items-center justify-center text-white">
              <Camera className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={2.5} />
            </div>
          </HeroSticker>

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

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[100px] font-black tracking-tighter leading-[0.92] mb-10 text-foreground hero-title-shadow">
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
                  className="px-8 h-14 text-lg font-bold rounded-full border-2 shadow-sticker-card transition-all text-foreground bg-card hover:bg-secondary hover:-translate-y-px hover:shadow-sticker-card-hover border-border"
                >
                  <MapPin className="mr-2 h-5 w-5" strokeWidth={3} /> Explore Places
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        <div className="section-perforation" aria-hidden="true" />
        {/* ── HOW IT WORKS ──────────────────────────────────────── */}
        <section className="section-raised w-full bg-landing-yellow py-24 md:py-32 relative overflow-hidden">
          <ParallaxDecor speed={0.05} className="absolute top-8 right-12 opacity-20 pointer-events-none hidden md:block">
            <Map className="h-32 w-32 text-sticker-olive" strokeWidth={1} />
          </ParallaxDecor>
          <div className="absolute bottom-10 left-10 w-20 h-20 rounded-full bg-landing-coral-blur blur-2xl pointer-events-none" />
          <div className="absolute top-1/3 left-6 w-12 h-12 rounded-full bg-landing-blue-blur blur-xl pointer-events-none" />

          {/* Thematic stickers — How it works */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute top-16 left-6 md:left-12 pointer-events-none z-10 hidden sm:block"
          >
            <span className={`${getStickerBgClass("green")} sticker-shape-pill px-3 py-1.5 text-xs font-black shadow-sticker-sm border-2 border-border -rotate-3 flex items-center gap-1.5`}>
              <Users className="h-3.5 w-3.5" /> Invite crew
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="absolute top-24 right-6 md:right-12 pointer-events-none z-10 hidden sm:block"
          >
            <span className="w-14 h-14 rounded-full border-2 border-dashed border-sticker-lilac flex flex-col items-center justify-center text-sticker-lilac font-black text-[9px] bg-background/80 rotate-6">
              <span>Sync</span>
              <span className="leading-none">Live</span>
            </span>
          </motion.div>

          {/* Boarding pass sticker — bottom right */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="absolute bottom-12 right-8 md:right-20 pointer-events-none z-10 hidden md:block"
          >
            <div className={`${getStickerBgClass("yellow")} border-2 border-border rounded-2xl shadow-sticker-card rotate-3 px-4 py-3 w-48`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-60">Boarding Pass</span>
                <Plane className="h-3.5 w-3.5 opacity-50" strokeWidth={2.5} />
              </div>
              <div className="border-t border-dashed border-border/60 pt-1.5 flex items-center justify-between">
                <div>
                  <div className="font-black text-sm leading-none">BCN</div>
                  <div className="text-[8px] font-bold opacity-50">Barcelona</div>
                </div>
                <ArrowRight className="h-3 w-3 opacity-40" />
                <div className="text-right">
                  <div className="font-black text-sm leading-none">TYO</div>
                  <div className="text-[8px] font-bold opacity-50">Tokyo</div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <SectionHeader
                badge={{ label: "How it works", icon: <Sparkles className="h-4 w-4" />, color: "yellow" }}
                title="Three steps to your dream trip"
                className="mb-16"
              />
            </RevealOnScroll>

            <RevealOnScroll stagger className="flex flex-col md:flex-row md:items-start">
              <RevealItem className="flex-1">
                <StickerCard color="green" rotate={-1.5} className="h-full">
                  <div className="bg-foreground text-background w-10 h-10 rounded-full flex items-center justify-center font-black text-lg mb-4 shadow-sticker-sm">
                    1
                  </div>
                  <Globe2 className="h-10 w-10 mb-3" strokeWidth={2.5} />
                  <h3 className="font-black text-2xl mb-2">Create a trip</h3>
                  <p className="font-bold opacity-80 leading-relaxed">
                    Pick a destination, set the dates, and share an invite link with your crew.
                  </p>
                </StickerCard>
              </RevealItem>

              {/* Connector 1 → 2 */}
              <RevealItem className="flex items-center justify-center py-3 md:py-0 md:px-3 md:mt-24 shrink-0">
                {/* Mobile: vertical dashed arrow */}
                <svg className="block md:hidden text-border" width="20" height="48" viewBox="0 0 20 48" fill="none">
                  <line x1="10" y1="2" x2="10" y2="38" stroke="currentColor" strokeWidth="2" strokeDasharray="5 4" strokeLinecap="round" />
                  <path d="M4 33 L10 44 L16 33" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" fill="none" />
                </svg>
                {/* Desktop: horizontal dashed arrow */}
                <svg className="hidden md:block text-border" width="48" height="20" viewBox="0 0 48 20" fill="none">
                  <line x1="2" y1="10" x2="38" y2="10" stroke="currentColor" strokeWidth="2" strokeDasharray="5 4" strokeLinecap="round" />
                  <path d="M33 4 L44 10 L33 16" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" fill="none" />
                </svg>
              </RevealItem>

              <RevealItem className="flex-1 md:mt-6">
                <StickerCard color="blue" rotate={1} className="h-full">
                  <div className="bg-foreground text-background w-10 h-10 rounded-full flex items-center justify-center font-black text-lg mb-4 shadow-sticker-sm">
                    2
                  </div>
                  <Heart className="h-10 w-10 mb-3" strokeWidth={2.5} />
                  <h3 className="font-black text-2xl mb-2">Vote & collect</h3>
                  <p className="font-bold opacity-80 leading-relaxed">
                    Everyone suggests spots, votes on favorites, and saves places from social media.
                  </p>
                </StickerCard>
              </RevealItem>

              {/* Connector 2 → 3 */}
              <RevealItem className="flex items-center justify-center py-3 md:py-0 md:px-3 md:mt-24 shrink-0">
                {/* Mobile: vertical dashed arrow */}
                <svg className="block md:hidden text-border" width="20" height="48" viewBox="0 0 20 48" fill="none">
                  <line x1="10" y1="2" x2="10" y2="38" stroke="currentColor" strokeWidth="2" strokeDasharray="5 4" strokeLinecap="round" />
                  <path d="M4 33 L10 44 L16 33" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" fill="none" />
                </svg>
                {/* Desktop: horizontal dashed arrow */}
                <svg className="hidden md:block text-border" width="48" height="20" viewBox="0 0 48 20" fill="none">
                  <line x1="2" y1="10" x2="38" y2="10" stroke="currentColor" strokeWidth="2" strokeDasharray="5 4" strokeLinecap="round" />
                  <path d="M33 4 L44 10 L33 16" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" fill="none" />
                </svg>
              </RevealItem>

              <RevealItem className="flex-1">
                <StickerCard color="lilac" rotate={-2} className="h-full">
                  <div className="bg-foreground text-background w-10 h-10 rounded-full flex items-center justify-center font-black text-lg mb-4 shadow-sticker-sm">
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

        <div className="section-perforation" aria-hidden="true" />
        {/* ── FEATURES ──────────────────────────────────────────── */}
        <section className="section-inset section-texture w-full bg-landing-surface py-24 md:py-32 relative overflow-hidden">
          <SectionTape position="top-left" color="coral" />
          <SectionTape position="bottom-right" color="lilac" rotation={-38} />
          <div className="section-texture-layer" aria-hidden="true" />
          <div className="absolute top-12 left-8 w-16 h-16 rounded-full bg-landing-coral-blur blur-2xl pointer-events-none" />
          <div className="absolute bottom-16 right-12 w-24 h-24 rounded-full bg-landing-lilac-blur blur-2xl pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 w-20 h-20 rounded-full bg-landing-olive-blur blur-2xl pointer-events-none" />

          {/* Thematic stickers — Features */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="absolute top-20 right-8 md:right-16 pointer-events-none z-10 hidden md:block"
          >
            <span className={`${getStickerBgClass("yellow")} sticker-shape-rect px-3 py-2 text-foreground text-xs font-black shadow-sticker-sm border-2 border-border rotate-6 flex items-center gap-1.5`}>
              <DollarSign className="h-3.5 w-3.5" /> Budget OK
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="absolute bottom-24 left-8 md:left-16 pointer-events-none z-10 hidden md:block"
          >
            <span className={`${getStickerBgClass("olive")} text-white sticker-shape-pill px-3 py-1.5 text-xs font-black shadow-sticker-sm border-2 border-border -rotate-3 flex items-center gap-1.5`}>
              <Shield className="h-3.5 w-3.5" /> Private
            </span>
          </motion.div>

          {/* "100% Fun" round stamp */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -12 }}
            whileInView={{ opacity: 1, scale: 1, rotate: -8 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="absolute bottom-16 right-8 md:right-20 pointer-events-none z-10 hidden lg:block"
          >
            <div className="w-20 h-20 rounded-full border-4 border-sticker-coral flex flex-col items-center justify-center bg-background/90 shadow-sticker-card">
              <span className="text-sticker-coral font-black text-lg leading-none">100%</span>
              <span className="text-sticker-coral font-black text-[10px] uppercase tracking-widest">Fun</span>
            </div>
          </motion.div>

          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <SectionHeader
                badge={{ label: "Features", icon: <Zap className="h-4 w-4" />, color: "coral" }}
                title="Organize the chaos"
                subtitle="Everything your group needs — from brainstorming to boarding."
                className="mb-16"
              />
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

        <div className="section-perforation" aria-hidden="true" />
        {/* ── DASHBOARD PREVIEW ────────────────────────────────── */}
        <section className="section-raised w-full bg-landing-blue py-24 md:py-32 relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <SectionHeader
                badge={{ label: "Your Dashboard", icon: <Sparkles className="h-4 w-4" />, color: "blue" }}
                title="All your trips in one place"
                subtitle="Track stats, manage adventures, and start new trips with one click."
                className="mb-16"
              />
            </RevealOnScroll>

            <RevealOnScroll>
              <div className="relative max-w-5xl mx-auto">
                {/* Browser chrome */}
                <div className="bg-card rounded-3xl border-2 border-border shadow-sticker-modal overflow-hidden">
                  {/* Browser bar */}
                  <div className="flex items-center gap-2 px-5 py-3 border-b-2 border-border bg-secondary/30">
                    <div className="flex gap-1.5">
                      <div className={`w-3 h-3 rounded-full ${getStickerBgClass("coral")}`} />
                      <div className={`w-3 h-3 rounded-full ${getStickerBgClass("yellow")}`} />
                      <div className={`w-3 h-3 rounded-full ${getStickerBgClass("green")}`} />
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
                        { label: "Total Trips", value: "12", icon: Plane, color: "blue" as const },
                        { label: "Upcoming", value: "3", icon: CalendarDays, color: "green" as const },
                        { label: "Countries", value: "8", icon: Globe2, color: "lilac" as const },
                        { label: "Places Saved", value: "47", icon: Bookmark, color: "yellow" as const },
                      ].map((stat) => (
                        <div key={stat.label} className="bg-background rounded-2xl border-2 border-border p-4 shadow-sticker-sm">
                          <div className={`w-8 h-8 ${getStickerBgClass(stat.color)} rounded-xl flex items-center justify-center mb-2`}>
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
                        { name: "Barcelona", dates: "Jun 12-18", color: "coral" as const, members: 3 },
                        { name: "Tokyo", dates: "Aug 3-14", color: "blue" as const, members: 2 },
                        { name: "Bali", dates: "Sep 20-28", color: "green" as const, members: 4 },
                      ].map((trip) => (
                        <div key={trip.name} className={`${getStickerBgClass(trip.color)} rounded-2xl p-4 border-2 border-border shadow-sticker-card relative overflow-hidden`}>
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
                  className={`absolute -top-5 -right-5 md:-right-10 ${getStickerBgClass("yellow")} rounded-full px-4 py-2 shadow-sticker-card border-2 border-border font-black text-sm rotate-6 z-20`}
                >
                  <TrendingUp className="h-4 w-4 inline mr-1" /> 12 trips!
                </motion.div>

                {/* Dashboard thematic sticker — upcoming */}
                <motion.div
                  initial={{ opacity: 0, x: 15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className={`absolute -top-5 -left-4 md:-left-12 ${getStickerBgClass("green")} sticker-shape-pill px-3 py-2 shadow-sticker-card border-2 border-border font-black text-xs -rotate-3 z-20 flex items-center gap-1.5`}
                >
                  <CalendarDays className="h-3.5 w-3.5" /> 3 upcoming
                </motion.div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        <div className="section-perforation" aria-hidden="true" />
        {/* ── FEATURE DEEP DIVES (Collab + Timeline) ──────────── */}
        <section className="section-inset w-full bg-landing-pink py-24 md:py-32 relative overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {/* Collab */}
              <RevealOnScroll direction="left">
                <div className={`${getStickerBgClass("green")} rounded-3xl p-10 flex flex-col items-start min-h-[400px] border-2 border-border shadow-sticker-modal -rotate-[1.5deg] transition-all hover:rotate-0 hover:-translate-y-1 hover:shadow-sticker-card-hover-strong relative`}>
                  <SectionTape position="top-left" color="yellow" rotation={-48} />
                  {/* Thematic sticker — Collab section */}
                  <motion.span
                    initial={{ opacity: 0, y: 5 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className={`absolute -top-2 -right-2 md:right-4 ${getStickerBgClass("coral")} text-white sticker-shape-pill px-2.5 py-1 text-[10px] font-black shadow-sticker-badge border-2 border-border rotate-12 z-20`}
                  >
                    Live
                  </motion.span>
                  <div className="bg-black/10 text-foreground px-6 py-2 rounded-full font-bold text-lg mb-8 uppercase tracking-widest inline-flex items-center gap-2 shadow-sticker-sm-soft">
                    <Globe2 className="w-5 h-5" /> Collab
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black text-foreground leading-[1.1] mb-6">
                    Real-time<br />sync
                  </h3>
                  <p className="text-foreground/80 font-bold text-lg max-w-sm">
                    Invite your friends. Vote on places, split the budget, and make decisions together — all live.
                  </p>
                  <div className="mt-auto flex -space-x-4 pt-6">
                    <div className={`w-14 h-14 rounded-full border-4 border-sticker-green ${getStickerBgClass("yellow")} flex items-center justify-center font-bold text-xl shadow-sticker-sm`}>A</div>
                    <div className={`w-14 h-14 rounded-full border-4 border-sticker-green ${getStickerBgClass("coral")} flex items-center justify-center font-bold text-xl shadow-sticker-sm`}>B</div>
                    <div className={`w-14 h-14 rounded-full border-4 border-sticker-green ${getStickerBgClass("lilac")} flex items-center justify-center font-bold text-xl shadow-sticker-sm`}>C</div>
                  </div>
                </div>
              </RevealOnScroll>

              {/* Schedule */}
              <RevealOnScroll direction="right">
                <div className={`${getStickerBgClass("blue")} rounded-3xl p-10 flex flex-col items-start min-h-[400px] border-2 border-border shadow-sticker-modal rotate-[1.5deg] transition-all hover:rotate-0 hover:-translate-y-1 hover:shadow-sticker-card-hover-strong mt-8 md:mt-0 relative`}>
                  <SectionTape position="top-right" color="pink" rotation={48} />
                  {/* Thematic sticker — Timeline section */}
                  <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className={`absolute -bottom-2 -left-2 md:-left-6 ${getStickerBgClass("pink")} sticker-shape-rect px-2.5 py-1 text-[10px] font-black shadow-sticker-sm border-2 border-border -rotate-6 z-20`}
                  >
                    Day 1 → Day N
                  </motion.span>
                  <div className="bg-black/10 text-foreground px-6 py-2 rounded-full font-bold text-lg mb-8 uppercase tracking-widest inline-flex items-center gap-2 shadow-sticker-sm-soft">
                    <CalendarDays className="w-5 h-5" /> Timeline
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black text-foreground leading-[1.1] mb-6">
                    Smart<br />schedule
                  </h3>
                  <p className="text-foreground/80 font-bold text-lg max-w-sm">
                    Visual timeline. Drag and drop events to build the perfect day-by-day itinerary.
                  </p>
                  <div className="mt-8 w-full space-y-3">
                    <div className={`${getStickerBgClass("coral")} h-12 w-full flex items-center px-4 rounded-2xl shadow-sticker-sm border-2 border-border`}>
                      <span className="text-white font-bold text-sm">10:00 — Breakfast at La Boqueria</span>
                    </div>
                    <div className={`${getStickerBgClass("yellow")} h-12 w-4/5 flex items-center px-4 rounded-2xl shadow-sticker-sm border-2 border-border`}>
                      <span className="text-foreground font-bold text-sm">12:30 — Sagrada Familia</span>
                    </div>
                    <div className={`${getStickerBgClass("pink")} h-12 w-full flex items-center px-4 rounded-2xl shadow-sticker-sm border-2 border-border`}>
                      <span className="text-foreground font-bold text-sm">15:00 — Park Guell</span>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        <div className="section-perforation" aria-hidden="true" />
        {/* ── TIMELINE PREVIEW ─────────────────────────────────── */}
        <section className="section-raised w-full bg-landing-lilac py-24 md:py-32 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <SectionHeader
                badge={{ label: "Timeline View", icon: <CalendarDays className="h-4 w-4" />, color: "lilac" }}
                title="Day-by-day itinerary"
                subtitle="Drag, drop, and organize every hour of your trip."
                className="mb-16"
              />
            </RevealOnScroll>

            <RevealOnScroll>
              <div className="relative max-w-3xl mx-auto">
                <div className="bg-card rounded-3xl border-2 border-border shadow-sticker-modal p-6 md:p-8">
                  {/* Day header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-14 w-14 rounded-2xl bg-primary/15 flex flex-col items-center justify-center shadow-sticker-sm-soft">
                      <span className="font-black text-lg leading-none text-primary">12</span>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">Jun</span>
                    </div>
                    <div>
                      <div className="font-black text-lg">Day 1 — Barcelona</div>
                      <div className="text-sm font-bold text-muted-foreground">4 events planned</div>
                    </div>
                  </div>

                  {/* Timeline events */}
                  <div className="flex gap-3 md:gap-4 items-stretch">
                    {/* Vertical perforation strip */}
                    <div className="ticket-perforation-v w-4 md:w-5 shrink-0 rounded-xl" />

                    <div className="space-y-3 flex-1">
                      {[
                        { time: "09:00", title: "Breakfast", place: "La Boqueria Market", icon: Utensils, color: "coral" as const },
                        { time: "11:00", title: "Sightseeing", place: "Sagrada Familia", icon: Landmark, color: "yellow" as const },
                        { time: "14:00", title: "Lunch", place: "El Nacional", icon: Utensils, color: "green" as const },
                        { time: "16:30", title: "Nature Walk", place: "Park Güell", icon: TreePine, color: "lilac" as const },
                      ].map((event, i) => (
                        <motion.div
                          key={event.title + i}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.1 * i + 0.2, duration: 0.4 }}
                          className={`${getStickerBgClass(event.color)} rounded-2xl p-4 border-2 border-border shadow-sticker-card flex items-center gap-3`}
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
                </div>

                {/* Floating stickers */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className={`absolute -top-4 -left-4 md:-left-14 ${getStickerBgClass("pink")} rounded-full px-4 py-2 shadow-sticker-card border-2 border-border font-black text-sm -rotate-6 z-20`}
                >
                  <GripVertical className="h-4 w-4 inline mr-1" /> Drag & drop
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className={`absolute -bottom-4 -right-4 md:-right-12 ${getStickerBgClass("olive")} rounded-full px-4 py-2 shadow-sticker-card border-2 border-border font-black text-sm text-white rotate-3 z-20`}
                >
                  <Clock className="h-4 w-4 inline mr-1" /> Auto schedule
                </motion.div>

                {/* Timeline section thematic — date stamp */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  className="absolute top-1/2 -right-4 md:-right-14 w-14 h-14 rounded-full border-2 border-dashed border-sticker-blue flex flex-col items-center justify-center text-sticker-blue font-black text-[9px] bg-background/90 rotate-12 z-20"
                >
                  <span>Jun</span>
                  <span className="text-sm leading-none">12</span>
                </motion.div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        <div className="section-perforation" aria-hidden="true" />
        {/* ── EXPLORE PREVIEW ──────────────────────────────────── */}
        <section className="section-inset w-full bg-landing-green py-24 md:py-32 relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <SectionHeader
                badge={{ label: "Explore Places", icon: <Compass className="h-4 w-4" />, color: "green" }}
                title="Discover hidden gems"
                subtitle="AI recommendations, saved spots from social media, and a personalized discovery feed."
                className="mb-16"
              />
            </RevealOnScroll>

            <RevealOnScroll>
              <div className="relative max-w-5xl mx-auto">
                <div className="bg-card rounded-3xl border-2 border-border shadow-sticker-modal p-5 md:p-8">
                  {/* Tabs mock */}
                  <div className="flex items-center gap-2 mb-6">
                    <div className="bg-primary text-primary-foreground rounded-full px-4 py-1.5 text-sm font-black flex items-center gap-1.5 shadow-sticker-card">
                      <Sparkles className="h-3.5 w-3.5" /> For You
                    </div>
                    <div className="bg-secondary rounded-full px-4 py-1.5 text-sm font-bold text-muted-foreground flex items-center gap-1.5">
                      <Bookmark className="h-3.5 w-3.5" /> My List
                    </div>
                  </div>

                  {/* Place cards grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { name: "Shibuya Crossing", cat: "Culture", catIcon: Landmark, color: "lilac" as const, location: "Tokyo, Japan", rating: "4.8" },
                      { name: "Cenote Suytun", cat: "Nature", catIcon: TreePine, color: "green" as const, location: "Valladolid, Mexico", rating: "4.9" },
                      { name: "Trastevere", cat: "Food", catIcon: Utensils, color: "yellow" as const, location: "Rome, Italy", rating: "4.7" },
                    ].map((place) => (
                      <motion.div
                        key={place.name}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className={`${getStickerBgClass(place.color)} rounded-2xl p-5 border-2 border-border shadow-sticker-card relative overflow-hidden`}
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
                  className={`absolute -top-5 -left-4 md:-left-10 ${getStickerBgClass("coral")} text-white rounded-full px-4 py-2 shadow-sticker-card border-2 border-border font-black text-sm z-20`}
                >
                  <Sparkles className="h-4 w-4 inline mr-1" /> AI picks
                </motion.div>

                {/* Explore thematic — city stamp */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="absolute -bottom-6 left-1/2 -translate-x-1/2 md:left-8 md:translate-x-0 w-16 h-16 rounded-full border-2 border-dashed border-sticker-lilac flex flex-col items-center justify-center text-sticker-lilac font-black text-[9px] bg-background/90 -rotate-6 z-20"
                >
                  <span>Saved</span>
                  <span className="leading-none">TYO</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className={`absolute -bottom-4 -right-4 md:-right-10 ${getStickerBgClass("blue")} rounded-full px-4 py-2 shadow-sticker-card border-2 border-border font-black text-sm rotate-3 z-20`}
                >
                  <Heart className="h-4 w-4 inline mr-1" /> 47 saved
                </motion.div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        <div className="section-perforation" aria-hidden="true" />
        {/* ── SOCIAL PROOF ──────────────────────────────────────── */}
        <section className="section-raised section-texture w-full bg-landing-yellow py-24 md:py-32 relative overflow-hidden">
          <div className="section-texture-layer" aria-hidden="true" />
          <div className="absolute top-20 right-16 w-32 h-32 rounded-full bg-landing-lilac-blur blur-3xl pointer-events-none opacity-80" />
          <ParallaxDecor speed={0.04} className="absolute bottom-8 left-8 opacity-15 pointer-events-none hidden md:block">
            <Stamp className="h-40 w-40 text-sticker-lilac rotate-12" strokeWidth={1} />
          </ParallaxDecor>

          {/* Thematic sticker — Testimonials */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="absolute top-20 left-8 md:left-16 pointer-events-none z-10 hidden md:block"
          >
            <span className={`${getStickerBgClass("pink")} sticker-shape-pill px-3 py-1.5 text-foreground text-xs font-black shadow-sticker-sm border-2 border-border rotate-6 flex items-center gap-1.5`}>
              <Star className="h-3.5 w-3.5 fill-foreground" strokeWidth={0} /> Recommended
            </span>
          </motion.div>

          {/* Mini-polaroid sticker — bottom right */}
          <PolaroidFlip />

          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <SectionHeader
                badge={{ label: "Testimonials", icon: <MessageCircle className="h-4 w-4" />, color: "pink" }}
                title="Loved by travelers"
                className="mb-16"
              />
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

        <div className="section-perforation" aria-hidden="true" />
        {/* ── FAQ ────────────────────────────────────────────────── */}
        <section className="section-inset w-full bg-landing-olive py-24 md:py-32 relative overflow-hidden">
          {/* Thematic sticker — FAQ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="absolute top-24 right-8 md:right-16 pointer-events-none z-10 hidden md:block"
          >
            <span className={`${getStickerBgClass("yellow")} text-foreground sticker-shape-rect w-12 h-12 flex items-center justify-center shadow-sticker-sm border-2 border-border font-black text-lg -rotate-6`}>
              ?
            </span>
          </motion.div>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <SectionHeader
                badge={{ label: "FAQ", icon: <MessageCircle className="h-4 w-4" />, color: "olive" }}
                title="Got questions?"
                className="mb-12"
              />
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
                    <FaqItem q={item.q} a={item.a} defaultOpen={i === 0} showStamp={i === 0} />
                  </RevealItem>
                ))}
              </div>
            </RevealOnScroll>
          </div>
        </section>

        <div className="section-perforation" aria-hidden="true" />
        {/* ── FINAL CTA ─────────────────────────────────────────── */}
        <section className="section-raised w-full bg-landing-blue py-32 md:py-44 text-center relative overflow-hidden">
          <ParallaxDecor speed={0.06} className="absolute top-6 left-[10%] opacity-15 pointer-events-none hidden md:block">
            <Compass className="h-24 w-24 text-sticker-blue rotate-12" strokeWidth={1.5} />
          </ParallaxDecor>
          <ParallaxDecor speed={0.08} className="absolute bottom-8 right-[12%] opacity-15 pointer-events-none hidden md:block">
            <Globe2 className="h-28 w-28 text-sticker-coral -rotate-6" strokeWidth={1.5} />
          </ParallaxDecor>

          {/* Large central decorative compass — behind content */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0" aria-hidden="true">
            <Compass className="h-[280px] w-[280px] md:h-[360px] md:w-[360px] text-foreground opacity-[0.05]" strokeWidth={1} />
          </div>

          {/* Thematic sticker — CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="absolute top-16 right-[15%] md:right-[20%] pointer-events-none z-10 hidden md:block"
          >
            <span className={`${getStickerBgClass("green")} text-foreground sticker-shape-pill px-3 py-1.5 text-xs font-black shadow-sticker-sm border-2 border-border rotate-6`}>
              Free
            </span>
          </motion.div>

          {/* "Adventure Awaits" round stamp — bottom left */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
            whileInView={{ opacity: 1, scale: 1, rotate: -8 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="absolute bottom-16 left-[10%] md:left-[15%] pointer-events-none z-10 hidden lg:block"
          >
            <div className="w-24 h-24 rounded-full border-[3px] border-dashed border-sticker-coral flex flex-col items-center justify-center bg-background/90 shadow-sticker-card">
              <Compass className="h-5 w-5 text-sticker-coral mb-0.5" strokeWidth={2.5} />
              <span className="text-sticker-coral font-black text-[9px] uppercase tracking-wide leading-tight text-center">Adventure<br />Awaits</span>
            </div>
          </motion.div>

          <RevealOnScroll className="relative z-10">
            <h2 className="text-5xl md:text-6xl font-black text-foreground mb-4">
              TripWeave
            </h2>
            <p className="text-muted-foreground font-bold text-lg mb-10 max-w-lg mx-auto">
              Your next adventure starts here. Plan it together, beautifully.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Link href="/dashboard" className="shadow-[0_0_0_4px_hsl(var(--primary)/0.20)] shadow-sticker-card-hover-strong hover:shadow-[0_0_0_4px_hsl(var(--primary)/0.30)] hover:shadow-sticker-card-hover-strong transition-shadow duration-200">
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

      <div className="section-perforation" aria-hidden="true" />

      {/* ── Footer: Boarding Pass ──────────────────────────────────── */}
      <footer className="px-4 md:px-8 pt-4 pb-8 bg-background">
        <div className="max-w-4xl mx-auto">
          {/* Ticket wrapper */}
          <div className="relative border-2 border-border rounded-2xl bg-card shadow-sticker-card">

            <div className="flex flex-col md:flex-row">

              {/* ── Main body ────────────────────────────────────────── */}
              <div className="flex-1 p-5 md:p-6 flex flex-col gap-4">

                {/* Airline + Flight */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                      <Plane className="h-4 w-4 text-primary-foreground" strokeWidth={3} />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-muted-foreground tracking-widest uppercase leading-none mb-1">Airline</p>
                      <p className="text-sm font-black tracking-tight leading-none">TripWeave</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold text-muted-foreground tracking-widest uppercase leading-none mb-1">Flight</p>
                    <p className="text-sm font-black tracking-tight leading-none">TW · 2026</p>
                  </div>
                </div>

                {/* Route */}
                <div className="flex items-center gap-2">
                  <div>
                    <p className="text-[9px] font-bold text-muted-foreground tracking-widest uppercase leading-none mb-1">From</p>
                    <p className="text-2xl font-black tracking-tighter leading-none">IDEAS</p>
                  </div>
                  <div className="flex-1 flex items-center gap-1.5 px-2">
                    <div className="flex-1 border-t-2 border-dashed border-border" />
                    <Plane className="h-3.5 w-3.5 text-primary flex-shrink-0" strokeWidth={2} />
                    <div className="flex-1 border-t-2 border-dashed border-border" />
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold text-muted-foreground tracking-widest uppercase leading-none mb-1">To</p>
                    <p className="text-2xl font-black tracking-tighter leading-none">MEMORIES</p>
                  </div>
                </div>

                {/* Passenger info */}
                <div className="grid grid-cols-3 gap-3 pb-4 border-b-2 border-dashed border-border">
                  <div>
                    <p className="text-[9px] font-bold text-muted-foreground tracking-widest uppercase leading-none mb-1">Passenger</p>
                    <p className="text-xs font-black">Explorer</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-muted-foreground tracking-widest uppercase leading-none mb-1">Class</p>
                    <p className="text-xs font-black">All Devices</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-muted-foreground tracking-widest uppercase leading-none mb-1">Gate</p>
                    <p className="text-xs font-black">Always Open</p>
                  </div>
                </div>

                {/* Barcode + copyright */}
                <div className="flex items-end justify-between gap-3">
                  <p className="text-[10px] text-muted-foreground font-semibold leading-relaxed">
                    &copy; {new Date().getFullYear()} TripWeave<br />
                    <span className="opacity-60">Valid on all devices</span>
                  </p>
                  <div className="footer-barcode h-10 w-28 rounded-sm flex-shrink-0" aria-hidden="true" />
                </div>

              </div>

              {/* ── Divider (mobile: horizontal) ── */}
              <div className="footer-ticket-divider-h md:hidden" aria-hidden="true" />

              {/* ── Divider (desktop: vertical) ── */}
              <div className="footer-ticket-divider-v hidden md:block" aria-hidden="true" />

              {/* ── Stub: links ─────────────────────────────────────── */}
              <div className="flex flex-row md:flex-col items-center justify-around md:justify-center gap-3 md:gap-5 p-5 md:p-6 md:w-40">
                <p className="hidden md:block text-[9px] font-bold text-muted-foreground tracking-widest uppercase text-center mb-1">Quick Links</p>
                <a href="#" className="text-xs font-black hover:text-primary transition-colors">Privacy</a>
                <a href="#" className="text-xs font-black hover:text-primary transition-colors">Terms</a>
                <a href="#" className="text-xs font-black hover:text-primary transition-colors">Contact</a>
                <p className="hidden md:block text-[9px] font-bold text-muted-foreground/60 tracking-wide text-center mt-auto leading-snug">
                  Boarding:<br />tripweave.app
                </p>
              </div>

            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
