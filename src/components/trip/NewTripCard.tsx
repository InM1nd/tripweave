"use client";

import { Plus } from "lucide-react";

export function NewTripCard() {
  return (
    <div
      className="hidden md:flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-[20px] border-[var(--border)] hover:border-[var(--accent)]/50 hover:bg-[var(--accent-subtle)] transition-all duration-200 cursor-pointer group min-h-[200px]"
      onClick={() => {
        document.getElementById("create-trip-trigger")?.click();
      }}
    >
      <div className="h-16 w-16 rounded-2xl bg-[var(--accent-subtle)] group-hover:bg-[var(--accent)]/20 flex items-center justify-center mb-4 transition-all">
        <Plus className="h-8 w-8 text-[var(--accent)]" />
      </div>
      <h3 className="font-semibold text-lg text-[var(--text-primary)] mb-1">
        New Adventure
      </h3>
      <p className="text-sm text-[var(--text-muted)] text-center max-w-[180px]">
        Start planning your next trip
      </p>
    </div>
  );
}
