"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Plane,
  MapPin,
  Users,
  Sparkles,
  Calendar,
  Share2,
  Compass,
  ArrowRight,
  Globe2,
  Image as ImageIcon
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-base)] text-[var(--text-primary)]">
      {/* Ambient Background Glow */}
      <div className="pointer-events-none fixed inset-0 flex justify-center z-0 overflow-hidden">
        <div className="w-[800px] h-[600px] bg-[var(--accent-glow)] rounded-full blur-[120px] opacity-40 -translate-y-1/2"></div>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 px-4 md:px-8 lg:px-12 h-20 flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-base)]/70 backdrop-blur-2xl transition-all">
        <Link
          className="flex items-center gap-3 relative z-10 group"
          href="/"
        >
          <div className="h-10 w-10 rounded-[var(--radius-lg)] bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] flex items-center justify-center shadow-[var(--shadow-accent-sm)] group-hover:scale-105 transition-transform duration-300">
            <Plane className="h-5 w-5 text-[var(--accent-text)]" />
          </div>
          <span className="font-bold text-2xl tracking-tight">TripWeave</span>
        </Link>
        <nav className="flex items-center gap-4 relative z-10">
          <Link href="/login" className="hidden sm:inline-block">
            <Button variant="ghost" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)] rounded-[var(--radius-pill)] px-6">
              Sign In
            </Button>
          </Link>
          <Link href="/login?signup=true">
            <Button className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] rounded-[var(--radius-pill)] shadow-[var(--shadow-accent-sm)] font-medium px-6 border-none transition-all hover:scale-105">
              Get Started
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 relative z-10 flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 md:pt-32 md:pb-40 text-center flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--bg-surface-2)]/50 backdrop-blur-md mb-8 hover:border-[var(--accent)] transition-colors cursor-default shadow-sm">
            <Sparkles className="w-4 h-4 text-[var(--accent)]" />
            <span className="text-sm font-medium text-[var(--text-secondary)] relative top-[1px]">The ultimate travel planning experience</span>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-[1.1] max-w-5xl mx-auto mb-8 text-[var(--text-primary)]">
            Plan your next journey,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)]">
              beautifully
            </span>
            .
          </h1>

          <p className="text-lg md:text-2xl text-[var(--text-secondary)] font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
            Collaborate with friends in real-time, organize itineraries, and discover amazing spots around the world without the chaos.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center w-full max-w-md mx-auto">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] px-10 h-14 text-lg rounded-[var(--radius-pill)] shadow-[var(--shadow-accent)] border-none transition-all hover:-translate-y-1 hover:shadow-2xl group flex items-center gap-2"
              >
                Start Planning Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Bento Grid Features */}
        <section className="w-full bg-[var(--bg-surface)]/40 border-y border-[var(--border)] py-24 md:py-32 backdrop-blur-3xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-both">
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
                Everything you need. <br className="hidden md:block" /> Nothing you don't.
              </h2>
              <p className="text-[var(--text-secondary)] text-lg md:text-xl">
                A powerful suite of tools designed to make group travel planning a breeze.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
              {/* Feature 1: Large Span */}
              <div className="md:col-span-2 relative group overflow-hidden rounded-[var(--radius-2xl)] bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all duration-500 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-accent-sm)] p-8 flex flex-col justify-end">
                <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:opacity-10 transition-opacity duration-500 group-hover:scale-110 transform">
                  <Globe2 className="w-64 h-64 text-[var(--accent)]" />
                </div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--accent-subtle)] flex items-center justify-center mb-6">
                    <Users className="w-7 h-7 text-[var(--accent)]" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Real-time Collaboration</h3>
                  <p className="text-[var(--text-secondary)] text-lg max-w-md">
                    Invite everyone. Vote on spots, edit the timeline together, and keep all your documents in one shared space.
                  </p>
                </div>
              </div>

              {/* Feature 2: Small */}
              <div className="relative group overflow-hidden rounded-[var(--radius-2xl)] bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--accent-2)]/50 transition-all duration-500 shadow-[var(--shadow-sm)] hover:shadow-lg p-8 flex flex-col justify-end">
                <div className="absolute -top-6 -right-6 p-8 opacity-[0.05] group-hover:opacity-[0.15] transition-opacity duration-500">
                  <Compass className="w-40 h-40 text-[var(--accent-2)]" />
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-[var(--accent-2-subtle)] flex items-center justify-center mb-4">
                    <MapPin className="w-6 h-6 text-[var(--accent-2)]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Smart Itinerary</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed">Drag and drop events to build the perfect day-by-day schedule.</p>
                </div>
              </div>

              {/* Feature 3: Small */}
              <div className="relative group overflow-hidden rounded-[var(--radius-2xl)] bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[#2ECC71]/50 transition-all duration-500 shadow-[var(--shadow-sm)] hover:shadow-lg p-8 flex flex-col justify-end">
                <div className="absolute -bottom-6 -right-6 p-8 opacity-[0.05] group-hover:opacity-[0.15] transition-opacity duration-500">
                  <Share2 className="w-32 h-32 text-[#2ECC71]" />
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-[#2ECC71]/10 flex items-center justify-center mb-4">
                    <Share2 className="w-6 h-6 text-[#2ECC71]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Instant Imports</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed">Paste a link from Google Maps or Instagram and we'll extract the details.</p>
                </div>
              </div>

              {/* Feature 4: Large Span */}
              <div className="md:col-span-2 relative group overflow-hidden rounded-[var(--radius-2xl)] bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[#7C6FF7]/50 transition-all duration-500 shadow-[var(--shadow-sm)] hover:shadow-lg p-8 flex items-center justify-between">
                <div className="relative z-10 max-w-sm">
                  <div className="w-14 h-14 rounded-2xl bg-[#7C6FF7]/10 flex items-center justify-center mb-6">
                    <ImageIcon className="w-7 h-7 text-[#7C6FF7]" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Beautiful Galleries</h3>
                  <p className="text-[var(--text-secondary)] text-lg">
                    Store and share the memories that matter. Automatically organized by trip and accessible by everyone.
                  </p>
                </div>
                <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 group-hover:-translate-x-4 transition-transform duration-700">
                  <div className="w-64 h-64 rounded-2xl rotate-12 bg-gradient-to-br from-[#7C6FF7]/20 to-transparent border border-[#7C6FF7]/20 backdrop-blur-md shadow-2xl flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#7C6FF7]/5 mix-blend-overlay"></div>
                    <Sparkles className="w-20 h-20 text-[#7C6FF7]/50" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Layer */}
        <section id="how-it-works" className="w-full py-24 md:py-32 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-20 tracking-tight">
              Journey inside out
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 relative">
              {/* Connecting Line */}
              <div className="hidden md:block absolute top-[48px] left-[18%] right-[18%] h-px bg-gradient-to-r from-transparent via-[var(--border-hover)] to-transparent" />

              {[
                {
                  step: "01",
                  title: "Create Trip",
                  desc: "Set the destination, pick your dates, and invite your crew via a simple link.",
                  icon: Calendar
                },
                {
                  step: "02",
                  title: "Add Spots",
                  desc: "Drop in links, search for places, and let everyone vote on what to do.",
                  icon: MapPin
                },
                {
                  step: "03",
                  title: "Build Schedule",
                  desc: "Arrange your voted spots into a neat day-by-day timeline.",
                  icon: Plane
                }
              ].map((item, i) => (
                <div key={i} className="text-center relative z-10 flex flex-col items-center">
                  <div className="text-[var(--accent-subtle)] font-black text-8xl md:text-9xl select-none absolute -top-12 md:-top-16 z-0 opacity-40">
                    {item.step}
                  </div>
                  <div className="w-24 h-24 rounded-full bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center mb-6 relative z-10 shadow-xl shadow-[var(--shadow-sm)] hover:border-[var(--accent)] hover:shadow-[var(--shadow-accent-sm)] transition-all duration-300">
                    <item.icon className="w-10 h-10 text-[var(--accent)]" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 relative z-10">{item.title}</h3>
                  <p className="text-[var(--text-secondary)] text-lg leading-relaxed relative z-10 max-w-sm mx-auto">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full pb-32 pt-16 px-4">
          <div className="max-w-5xl mx-auto rounded-[var(--radius-4xl)] bg-gradient-to-b from-[var(--bg-surface)] to-[var(--bg-surface-2)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-colors duration-500 p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-50"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent-glow)] rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 z-0 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--accent-2-subtle)] rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2 z-0 pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight">
                Ready to weave your next adventure?
              </h2>
              <p className="text-xl text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto">
                Join thousands of travelers who have abandoned messy spreadsheets for a better way to plan together.
              </p>
              <Link href="/login?signup=true">
                <Button size="lg" className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] px-14 h-16 text-xl rounded-[var(--radius-pill)] shadow-[var(--shadow-accent)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[var(--shadow-lg)] active:scale-[0.98]">
                  Start Planning Now
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Minimal */}
      <footer className="w-full py-10 border-t border-[var(--border)] bg-[var(--bg-base)]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--bg-surface-2)] flex items-center justify-center">
              <Plane className="h-4 w-4 text-[var(--text-secondary)]" />
            </div>
            <span className="font-semibold text-[var(--text-secondary)]">TripWeave © {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-8 text-sm font-medium">
            <Link href="/login" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Sign In</Link>
            <Link href="/login?signup=true" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">Sign Up for Free</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
