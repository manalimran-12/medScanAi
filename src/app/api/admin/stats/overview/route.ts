import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/mock-auth";
import { store } from "@/lib/mock-store";
import type { ModelType } from "@/types/api";

export async function GET(req: Request) {
  const me = await getUserFromRequest(req);
  if (!me) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (me.role !== "ADMIN") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);
  const activeUsers7d = new Set(
    store.predictions.filter((p) => new Date(p.createdAt) >= sevenDaysAgo).map((p) => p.userId),
  ).size;

  const predictionsByModel: Record<ModelType, number> = { PNEUMONIA: 0, BREAST: 0, HEART: 0, LIVER: 0 };
  store.predictions.forEach((p) => {
    predictionsByModel[p.modelType]++;
  });

  const signupsByWeek: Array<{ weekStart: string; count: number }> = [];
  for (let i = 7; i >= 0; i--) {
    const ws = new Date(now);
    ws.setDate(now.getDate() - i * 7);
    ws.setHours(0, 0, 0, 0);
    const we = new Date(ws);
    we.setDate(we.getDate() + 7);
    const count = store.users.filter((u) => {
      const c = new Date(u.createdAt);
      return c >= ws && c < we;
    }).length;
    signupsByWeek.push({ weekStart: ws.toISOString().slice(0, 10), count });
  }

  return NextResponse.json({
    data: {
      totalUsers: store.users.length,
      activeUsers7d,
      totalPredictions: store.predictions.length,
      predictionsByModel,
      signupsByWeek,
    },
  });
}
