"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, Sparkles } from "lucide-react";

const ICON_MAP = {
  TrendingUp,
  Sparkles,
} as const;

type StatIconName = keyof typeof ICON_MAP;

interface StatCardProps {
  label: string;
  value: number;
  icon: StatIconName;
  /** Kept for API compatibility; all cards use single accent style */
  coverColor?: "electric" | "coral" | "sky" | "amber";
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: iconName,
  className,
}: StatCardProps) {
  const Icon = ICON_MAP[iconName] ?? TrendingUp;

  return (
    <Card
      className={cn(
        "border border-border bg-bg-surface shadow-shadow-sm transition-all duration-200 hover:border-border-hover",
        className
      )}
    >
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 bg-accent-subtle"
          >
            <Icon className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text-primary">
              {value}
            </p>
            <p className="text-xs text-text-muted">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
