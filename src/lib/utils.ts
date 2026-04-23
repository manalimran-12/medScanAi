import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(iso: string, withTime = false): string {
  const d = new Date(iso);
  if (withTime) {
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatConfidence(c: number | null): string {
  if (c === null || c === undefined || Number.isNaN(c)) return "—";
  return `${(c * 100).toFixed(1)}%`;
}

export function humanizeModelType(t: "PNEUMONIA" | "BREAST" | "HEART" | "LIVER"): string {
  const map = {
    PNEUMONIA: "Pneumonia",
    BREAST: "Breast Cancer",
    HEART: "Heart Disease",
    LIVER: "Liver Disease",
  } as const;
  return map[t];
}
