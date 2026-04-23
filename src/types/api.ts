export type Role = "USER" | "ADMIN";
export type UserStatus = "ACTIVE" | "DISABLED" | "PENDING_VERIFICATION";
export type ModelType = "PNEUMONIA" | "BREAST" | "HEART" | "LIVER";
export type PredictionStatus = "PENDING" | "SUCCEEDED" | "FAILED";

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  status: UserStatus;
  avatarUrl: string | null;
  emailVerifiedAt: string | null;
  createdAt: string;
}

export interface Prediction {
  id: string;
  userId: string;
  modelType: ModelType;
  status: PredictionStatus;
  result: string | null;
  confidence: number | null;
  imageUrl: string;
  createdAt: string;
  durationMs: number | null;
  errorMessage: string | null;
}

export interface Paginated<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface Envelope<T> {
  data: T;
}

export interface AuthSession {
  accessToken: string;
  user: User;
}

export interface MeStats {
  totalAll: number;
  byModel: Record<ModelType, number>;
  last30Days: Array<{ date: string; count: number }>;
  successCount: number;
  failedCount: number;
  successRate: number;
  avgConfidenceByModel: Record<ModelType, number | null>;
  concerningByModel: Record<ModelType, number>;
  totalConcerning: number;
  thisWeek: number;
  lastWeek: number;
  deltaPct: number;
  totalProcessingMs: number;
}

export interface AdminOverviewStats {
  totalUsers: number;
  activeUsers7d: number;
  totalPredictions: number;
  predictionsByModel: Record<ModelType, number>;
  signupsByWeek: Array<{ weekStart: string; count: number }>;
}

export interface AuditLog {
  id: string;
  userId: string | null;
  userEmail: string | null;
  action: string;
  entityType: string | null;
  entityId: string | null;
  ip: string | null;
  userAgent: string | null;
  createdAt: string;
}
