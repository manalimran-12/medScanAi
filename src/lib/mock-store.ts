import type { User, Prediction, AuditLog } from "@/types/api";

interface StoredUser extends User {
  passwordHash: string;
}

function sleep(ms = 300) {
  return new Promise((r) => setTimeout(r, ms));
}

function randomId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function hashPassword(pw: string) {
  return "mockhash$" + Buffer.from(pw).toString("base64");
}
function verifyPassword(pw: string, hash: string) {
  return hashPassword(pw) === hash;
}

const g = globalThis as unknown as {
  __mock?: {
    users: StoredUser[];
    predictions: Prediction[];
    auditLogs: AuditLog[];
    sessions: Map<string, string>; // refreshToken -> userId
    resetTokens: Map<string, string>; // token -> userId
    verifyTokens: Map<string, string>; // token -> userId
  };
};

function seed(): NonNullable<typeof g.__mock> {
  const now = new Date();
  const admin: StoredUser = {
    id: "u_admin",
    email: "admin@fyp.local",
    name: "Admin User",
    role: "ADMIN",
    status: "ACTIVE",
    avatarUrl: null,
    emailVerifiedAt: now.toISOString(),
    createdAt: new Date(now.getTime() - 30 * 86400000).toISOString(),
    passwordHash: hashPassword("admin123"),
  };
  const demo: StoredUser = {
    id: "u_demo",
    email: "demo@fyp.local",
    name: "Demo User",
    role: "USER",
    status: "ACTIVE",
    avatarUrl: null,
    emailVerifiedAt: now.toISOString(),
    createdAt: new Date(now.getTime() - 20 * 86400000).toISOString(),
    passwordHash: hashPassword("demo123"),
  };

  const seedRows: Array<Omit<Prediction, "id" | "userId" | "imageUrl">> = [
    { modelType: "PNEUMONIA", status: "SUCCEEDED", result: "Pneumonia", confidence: 0.874, createdAt: new Date(now.getTime() - 1 * 86400000).toISOString(), durationMs: 1420, errorMessage: null },
    { modelType: "HEART", status: "SUCCEEDED", result: "No Heart Disease", confidence: 0.762, createdAt: new Date(now.getTime() - 2 * 86400000).toISOString(), durationMs: 3210, errorMessage: null },
    { modelType: "BREAST", status: "SUCCEEDED", result: "Benign", confidence: 0.912, createdAt: new Date(now.getTime() - 3 * 86400000).toISOString(), durationMs: 2890, errorMessage: null },
    { modelType: "PNEUMONIA", status: "SUCCEEDED", result: "Normal", confidence: 0.931, createdAt: new Date(now.getTime() - 4 * 86400000).toISOString(), durationMs: 1180, errorMessage: null },
    { modelType: "LIVER", status: "FAILED", result: null, confidence: null, createdAt: new Date(now.getTime() - 5 * 86400000).toISOString(), durationMs: 890, errorMessage: "Could not extract sufficient features from image" },
    { modelType: "HEART", status: "SUCCEEDED", result: "Heart Disease", confidence: 0.681, createdAt: new Date(now.getTime() - 6 * 86400000).toISOString(), durationMs: 2710, errorMessage: null },
    { modelType: "BREAST", status: "SUCCEEDED", result: "Malignant", confidence: 0.843, createdAt: new Date(now.getTime() - 8 * 86400000).toISOString(), durationMs: 3120, errorMessage: null },
    { modelType: "LIVER", status: "SUCCEEDED", result: "No Liver Disease", confidence: 0.819, createdAt: new Date(now.getTime() - 10 * 86400000).toISOString(), durationMs: 2540, errorMessage: null },
    { modelType: "PNEUMONIA", status: "SUCCEEDED", result: "Normal", confidence: 0.894, createdAt: new Date(now.getTime() - 11 * 86400000).toISOString(), durationMs: 1320, errorMessage: null },
    { modelType: "LIVER", status: "SUCCEEDED", result: "Liver Disease", confidence: 0.701, createdAt: new Date(now.getTime() - 13 * 86400000).toISOString(), durationMs: 2880, errorMessage: null },
    { modelType: "HEART", status: "SUCCEEDED", result: "No Heart Disease", confidence: 0.778, createdAt: new Date(now.getTime() - 15 * 86400000).toISOString(), durationMs: 2950, errorMessage: null },
    { modelType: "BREAST", status: "SUCCEEDED", result: "Benign", confidence: 0.888, createdAt: new Date(now.getTime() - 17 * 86400000).toISOString(), durationMs: 3010, errorMessage: null },
    { modelType: "PNEUMONIA", status: "SUCCEEDED", result: "Pneumonia", confidence: 0.826, createdAt: new Date(now.getTime() - 19 * 86400000).toISOString(), durationMs: 1510, errorMessage: null },
    { modelType: "HEART", status: "FAILED", result: null, confidence: null, createdAt: new Date(now.getTime() - 22 * 86400000).toISOString(), durationMs: 760, errorMessage: "Image quality too low for OCR" },
  ];

  const demoPreds: Prediction[] = seedRows.map((r, i) => ({
    ...r,
    id: "p" + (i + 1),
    userId: "u_demo",
    imageUrl: r.modelType === "PNEUMONIA" ? "/placeholder-xray.svg" : "/placeholder-report.svg",
  }));

  return {
    users: [admin, demo],
    predictions: demoPreds,
    auditLogs: [
      {
        id: "a1",
        userId: demo.id,
        userEmail: demo.email,
        action: "auth.login",
        entityType: null,
        entityId: null,
        ip: "127.0.0.1",
        userAgent: "Mozilla/5.0 (demo)",
        createdAt: new Date(now.getTime() - 3600000).toISOString(),
      },
    ],
    sessions: new Map(),
    resetTokens: new Map(),
    verifyTokens: new Map(),
  };
}

if (!g.__mock) {
  g.__mock = seed();
}

export const store = g.__mock!;

export function toPublicUser(u: StoredUser): User {
  const { passwordHash: _h, ...rest } = u;
  return rest;
}

export async function findUserByEmail(email: string) {
  await sleep(50);
  return store.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function findUserById(id: string) {
  await sleep(50);
  return store.users.find((u) => u.id === id) ?? null;
}

export async function createUser(input: { email: string; password: string; name?: string }): Promise<StoredUser> {
  await sleep(200);
  const u: StoredUser = {
    id: "u_" + randomId(),
    email: input.email,
    name: input.name ?? null,
    role: "USER",
    status: "PENDING_VERIFICATION",
    avatarUrl: null,
    emailVerifiedAt: null,
    createdAt: new Date().toISOString(),
    passwordHash: hashPassword(input.password),
  };
  store.users.push(u);
  return u;
}

export { verifyPassword, hashPassword, randomId, sleep };
