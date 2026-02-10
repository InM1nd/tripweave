"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden">
      {/* Background - using a modern mesh gradient approach */}
      <div className="absolute inset-0 z-[-1] bg-slate-950">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>


      <header className="px-4 lg:px-6 h-14 flex items-center z-10">
        <Link className="flex items-center justify-center text-white" href="#">
          <MapPin className="h-6 w-6 mr-2" />
          <span className="font-bold text-xl">TripWeave</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4 text-zinc-200 hover:text-white"
            href="/login"
          >
            Sign In
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4 text-zinc-200 hover:text-white"
            href="/login?signup=true"
          >
            Sign Up
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex items-center justify-center z-10">
        <section className="w-full">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-white drop-shadow-md">
                  TripWeave
                </h1>
                <p className="mx-auto max-w-[700px] text-zinc-200 md:text-xl drop-shadow-sm">
                  Plan Your Perfect Trip, <span className="text-teal-300 font-semibold">Together</span>. The new way to travel.
                </p>
              </div>
              <div className="space-x-4 pt-4">
                <Link href="/dashboard">
                  <Button size="lg" className="bg-white text-black hover:bg-zinc-200 border-none text-lg px-8 h-12">Get Started</Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/10 hover:text-white text-lg px-8 h-12">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Required style for the blob animation if not in tailwind config */}
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
