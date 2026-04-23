import { Wind, Heart, Brain, Droplets } from "lucide-react";
import type { ModelType } from "@/types/api";
import { cn } from "@/lib/utils";

const STYLES: Record<ModelType, { icon: typeof Wind; label: string; color: string; bg: string }> = {
  PNEUMONIA: { icon: Wind, label: "Pneumonia", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10" },
  HEART: { icon: Heart, label: "Heart", color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-500/10" },
  BREAST: { icon: Brain, label: "Breast", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-500/10" },
  LIVER: { icon: Droplets, label: "Liver", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
};

export function ModelBadge({ type, className }: { type: ModelType; className?: string }) {
  const s = STYLES[type];
  const Icon = s.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium",
        s.bg,
        s.color,
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {s.label}
    </span>
  );
}

export function ModelIcon({ type, className }: { type: ModelType; className?: string }) {
  const Icon = STYLES[type].icon;
  return <Icon className={cn(STYLES[type].color, className)} />;
}

export const MODEL_STYLES = STYLES;
