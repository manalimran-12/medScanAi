"use client";

import { Wind, Heart, Brain, Droplets, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ModelType } from "@/types/api";

const MODELS: Array<{
  type: ModelType;
  title: string;
  description: string;
  icon: typeof Wind;
  bg: string;
  color: string;
}> = [
  {
    type: "PNEUMONIA",
    title: "Pneumonia",
    description: "Chest X-ray image",
    icon: Wind,
    bg: "bg-blue-500/10",
    color: "text-blue-500",
  },
  {
    type: "BREAST",
    title: "Breast Cancer",
    description: "Diagnostic lab report",
    icon: Brain,
    bg: "bg-purple-500/10",
    color: "text-purple-500",
  },
  {
    type: "HEART",
    title: "Heart Disease",
    description: "Medical report image",
    icon: Heart,
    bg: "bg-rose-500/10",
    color: "text-rose-500",
  },
  {
    type: "LIVER",
    title: "Liver Disease",
    description: "Liver panel report",
    icon: Droplets,
    bg: "bg-amber-500/10",
    color: "text-amber-500",
  },
];

interface Props {
  value: ModelType | null;
  onChange: (type: ModelType) => void;
  disabled?: boolean;
}

export function ModelPicker({ value, onChange, disabled }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {MODELS.map((m) => {
        const selected = value === m.type;
        const Icon = m.icon;
        return (
          <button
            key={m.type}
            type="button"
            onClick={() => onChange(m.type)}
            disabled={disabled}
            className={cn(
              "relative flex items-start gap-3 rounded-lg border-2 p-4 text-left transition-all",
              selected
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/30 hover:bg-accent/50",
              disabled && "pointer-events-none opacity-50",
            )}
          >
            <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", m.bg)}>
              <Icon className={cn("h-5 w-5", m.color)} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold">{m.title}</div>
              <div className="text-xs text-muted-foreground">{m.description}</div>
            </div>
            {selected && (
              <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-3 w-3" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
