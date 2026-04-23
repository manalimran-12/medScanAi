import { NextResponse } from "next/server";
import { z } from "zod";
import { getUserFromRequest } from "@/lib/mock-auth";
import { store, randomId, sleep } from "@/lib/mock-store";
import type { ModelType, Prediction } from "@/types/api";

const MODEL_TYPES: ModelType[] = ["PNEUMONIA", "BREAST", "HEART", "LIVER"];

const MOCK_RESULTS: Record<ModelType, Array<{ result: string; confidence: number }>> = {
  PNEUMONIA: [
    { result: "Normal", confidence: 0.91 },
    { result: "Pneumonia", confidence: 0.874 },
  ],
  BREAST: [
    { result: "Benign", confidence: 0.912 },
    { result: "Malignant", confidence: 0.834 },
  ],
  HEART: [
    { result: "Heart Disease", confidence: 0.701 },
    { result: "No Heart Disease", confidence: 0.762 },
  ],
  LIVER: [
    { result: "Liver Disease", confidence: 0.68 },
    { result: "No Liver Disease", confidence: 0.819 },
  ],
};

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
  const pageSize = Math.max(1, Math.min(100, parseInt(url.searchParams.get("pageSize") ?? "10", 10)));
  const modelType = url.searchParams.get("modelType") as ModelType | null;
  const result = url.searchParams.get("result");
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  let rows = store.predictions.filter((p) => p.userId === user.id);
  if (modelType) rows = rows.filter((p) => p.modelType === modelType);
  if (result) rows = rows.filter((p) => p.result?.toLowerCase().includes(result.toLowerCase()));
  if (from) rows = rows.filter((p) => new Date(p.createdAt) >= new Date(from));
  if (to) rows = rows.filter((p) => new Date(p.createdAt) <= new Date(to));
  rows = rows.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const total = rows.length;
  const start = (page - 1) * pageSize;
  const data = rows.slice(start, start + pageSize);
  return NextResponse.json({
    data,
    meta: {
      pagination: { page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) },
    },
  });
}

const createSchema = z.object({ modelType: z.enum(["PNEUMONIA", "BREAST", "HEART", "LIVER"]) });

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ message: "Invalid form data" }, { status: 400 });
  const file = form.get("file");
  const modelType = form.get("modelType");
  const parsed = createSchema.safeParse({ modelType });
  if (!parsed.success || !(file instanceof File)) {
    return NextResponse.json({ message: "file and modelType are required" }, { status: 400 });
  }
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ message: "File too large (max 10 MB)" }, { status: 413 });
  }

  // Simulate ML latency
  await sleep(1500 + Math.random() * 1200);

  // 10% failure rate to exercise error states
  const failed = Math.random() < 0.1;
  const mock = MOCK_RESULTS[parsed.data.modelType][Math.floor(Math.random() * MOCK_RESULTS[parsed.data.modelType].length)];

  const buf = Buffer.from(await file.arrayBuffer());
  const imageUrl = `data:${file.type};base64,${buf.toString("base64")}`;

  const prediction: Prediction = {
    id: "p_" + randomId(),
    userId: user.id,
    modelType: parsed.data.modelType,
    status: failed ? "FAILED" : "SUCCEEDED",
    result: failed ? null : mock.result,
    confidence: failed ? null : mock.confidence,
    imageUrl,
    createdAt: new Date().toISOString(),
    durationMs: 1400 + Math.floor(Math.random() * 1800),
    errorMessage: failed ? "ML service could not process the image. Please try a different file." : null,
  };
  store.predictions.unshift(prediction);

  store.auditLogs.unshift({
    id: "a_" + randomId().slice(0, 6),
    userId: user.id,
    userEmail: user.email,
    action: "prediction.create",
    entityType: "Prediction",
    entityId: prediction.id,
    ip: req.headers.get("x-forwarded-for"),
    userAgent: req.headers.get("user-agent"),
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ data: prediction });
}
