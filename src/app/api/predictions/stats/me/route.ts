import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/mock-auth";
import { store } from "@/lib/mock-store";
import type { ModelType, Prediction } from "@/types/api";

const MODEL_TYPES: ModelType[] = ["PNEUMONIA", "BREAST", "HEART", "LIVER"];

function isConcerningResult(p: Prediction): boolean {
  if (!p.result) return false;
  const r = p.result.toLowerCase();
  return r === "pneumonia" || r === "malignant" || (r.includes("disease") && !r.startsWith("no "));
}

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const mine = store.predictions.filter((p) => p.userId === user.id);
  const successful = mine.filter((p) => p.status === "SUCCEEDED");
  const failed = mine.filter((p) => p.status === "FAILED");

  const byModel: Record<ModelType, number> = { PNEUMONIA: 0, BREAST: 0, HEART: 0, LIVER: 0 };
  const avgConfidenceByModel: Record<ModelType, number | null> = { PNEUMONIA: null, BREAST: null, HEART: null, LIVER: null };
  const concerningByModel: Record<ModelType, number> = { PNEUMONIA: 0, BREAST: 0, HEART: 0, LIVER: 0 };

  mine.forEach((p) => {
    byModel[p.modelType]++;
    if (isConcerningResult(p)) concerningByModel[p.modelType]++;
  });

  MODEL_TYPES.forEach((t) => {
    const rows = successful.filter((p) => p.modelType === t && p.confidence !== null);
    if (rows.length) {
      avgConfidenceByModel[t] = rows.reduce((s, r) => s + (r.confidence ?? 0), 0) / rows.length;
    }
  });

  const last30Days: Array<{ date: string; count: number }> = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const day = new Date(now);
    day.setDate(now.getDate() - i);
    const key = day.toISOString().slice(0, 10);
    const count = mine.filter((p) => p.createdAt.slice(0, 10) === key).length;
    last30Days.push({ date: key, count });
  }

  const weekMs = 7 * 86400000;
  const thisWeek = mine.filter((p) => new Date(p.createdAt).getTime() >= now.getTime() - weekMs).length;
  const lastWeek = mine.filter((p) => {
    const t = new Date(p.createdAt).getTime();
    return t >= now.getTime() - 2 * weekMs && t < now.getTime() - weekMs;
  }).length;
  const deltaPct = lastWeek === 0 ? (thisWeek > 0 ? 100 : 0) : Math.round(((thisWeek - lastWeek) / lastWeek) * 100);

  const totalProcessingMs = mine.reduce((s, p) => s + (p.durationMs ?? 0), 0);
  const successRate = mine.length ? successful.length / mine.length : 0;

  const totalConcerning = Object.values(concerningByModel).reduce((a, b) => a + b, 0);

  return NextResponse.json({
    data: {
      totalAll: mine.length,
      byModel,
      last30Days,
      successCount: successful.length,
      failedCount: failed.length,
      successRate,
      avgConfidenceByModel,
      concerningByModel,
      totalConcerning,
      thisWeek,
      lastWeek,
      deltaPct,
      totalProcessingMs,
    },
  });
}
