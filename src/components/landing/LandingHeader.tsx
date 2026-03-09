"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getStickerBgClass } from "@/lib/design-tokens";
import { Plane, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

/* ─── Theme toggle ─────────────────────────────────────────────── */
function ThemeToggle() {
  const [theme, setTheme] = useState<string>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      const current =
        document.documentElement.getAttribute("data-theme") || "light";
      setTheme(current);
      setMounted(true);
    });
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  if (!mounted) {
    return <div className="h-9 w-9 rounded-full bg-secondary/50" />;
  }

  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="h-9 w-9 rounded-full border-2 border-border bg-background flex items-center justify-center shadow-sticker-sm hover:shadow-sticker-card transition-shadow"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === "dark" ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="h-4 w-4" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="h-4 w-4" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

/* ─── Main header ──────────────────────────────────────────────── */
export function LandingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b-2 border-border shadow-sticker-top">

      {/* Boarding pass colour accent strip — mimics the airline livery bar */}
      <div className="h-[3px] w-full bg-primary" aria-hidden="true" />

      {/* Main row */}
      <div className="h-[64px] px-4 md:px-8 lg:px-10 flex items-center gap-0">

        {/* ── Logo stamp ─────────────────────────── */}
        <Link
          href="/"
          className="flex items-center gap-3 shrink-0 group"
          aria-label="TripWeave home"
        >
          {/* Circular stamp badge */}
          <div className="relative h-10 w-10 rounded-full bg-primary border-2 border-border shadow-sticker-sm flex items-center justify-center transition-transform duration-150 group-hover:-translate-y-0.5">
            <Plane
              className="h-5 w-5 text-primary-foreground"
              strokeWidth={2.5}
            />
          </div>

          {/* Wordmark + tagline */}
          <div className="flex flex-col leading-none gap-[3px]">
            <span className="font-black text-[17px] tracking-tighter text-foreground">
              TripWeave
            </span>
            <span className="text-[7.5px] font-bold tracking-[0.22em] uppercase text-muted-foreground hidden sm:block">
              Travel Together
            </span>
          </div>
        </Link>

        {/* Perforated vertical divider (desktop only) */}
        <div
          className="ticket-perforation-v w-[14px] self-stretch hidden lg:block mx-3 shrink-0"
          aria-hidden="true"
        />

        {/* ── Boarding pass flight info (lg only) ── */}
        <div className="hidden lg:flex items-center gap-4 pl-1 pr-6">
          {/* Flight number sticker */}
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full ${getStickerBgClass("yellow")} border-2 border-border text-[9px] font-black tracking-[0.18em] uppercase shadow-sticker-badge select-none`}>
            TW‑001
          </span>

          {/* Route: FROM → TO */}
          <div className="flex items-center gap-2.5">
            <div className="flex flex-col leading-none">
              <span className="text-[7px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-0.5">
                From
              </span>
              <span className="font-black text-[11px] tracking-tight text-foreground">
                ANYWHERE
              </span>
            </div>

            {/* Dotted flight line */}
            <div className="flex items-center gap-1">
              <div className="h-px w-5 border-t-2 border-dashed border-border" />
              <Plane
                className="h-3 w-3 text-primary shrink-0"
                strokeWidth={2.5}
                style={{ transform: "rotate(90deg)" }}
                aria-hidden="true"
              />
              <div className="h-px w-5 border-t-2 border-dashed border-border" />
            </div>

            <div className="flex flex-col leading-none">
              <span className="text-[7px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-0.5">
                To
              </span>
              <span className="font-black text-[11px] tracking-tight text-foreground">
                THE WORLD
              </span>
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* ── Right actions ───────────────────────── */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <Link href="/login" className="hidden sm:block">
            <span className="font-bold text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
              Log in
            </span>
          </Link>

          {/* CTA — ticket stub: perforated left edge + solid button */}
          <Link href="/login?signup=true" className="flex items-center group">
            {/* Perforated tear-off strip (sm and up) */}
            <div
              className="landing-header-cta-edge w-[10px] h-10 shrink-0 hidden sm:block"
              aria-hidden="true"
            />
            <Button className="h-10 rounded-r-2xl rounded-l-none sm:rounded-l-none rounded-full sm:rounded-none font-black text-sm shadow-sticker-card border-2 border-border border-l-0 sm:border-l-0 hover:-translate-y-px hover:shadow-sticker-card-hover transition-all px-5 gap-1.5">
              Start Free
              <Plane className="h-3.5 w-3.5" strokeWidth={2.5} />
            </Button>
          </Link>
        </div>

      </div>
    </header>
  );
}
