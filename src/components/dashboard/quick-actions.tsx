"use client";

import Link from "next/link";
import { Wind, Heart, Brain, Droplets, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const ACTIONS = [
  { type: "PNEUMONIA", label: "Pneumonia", subtitle: "Chest X-ray", icon: Wind, color: "text-blue-500", bg: "bg-blue-500/10", hover: "hover:bg-blue-500/15" },
  { type: "BREAST", label: "Breast Cancer", subtitle: "Lab report", icon: Brain, color: "text-purple-500", bg: "bg-purple-500/10", hover: "hover:bg-purple-500/15" },
  { type: "HEART", label: "Heart Disease", subtitle: "Cardio report", icon: Heart, color: "text-rose-500", bg: "bg-rose-500/10", hover: "hover:bg-rose-500/15" },
  { type: "LIVER", label: "Liver Disease", subtitle: "Liver panel", icon: Droplets, color: "text-amber-500", bg: "bg-amber-500/10", hover: "hover:bg-amber-500/15" },
];

export function QuickActions() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {ACTIONS.map((a) => {
        const Icon = a.icon;
        return (
          <Link
            key={a.type}
            href={`/predictions/new?model=${a.type}`}
            className={cn(
              "group relative flex items-center gap-3 overflow-hidden rounded-lg border p-4 transition-all",
              a.bg,
              a.hover,
            )}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background shadow-sm">
              <Icon className={cn("h-5 w-5", a.color)} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold leading-tight">{a.label}</div>
              <div className="text-xs text-muted-foreground">{a.subtitle}</div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
        );
      })}
    </div>
  );
}
