import axios, { AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from "axios";
import type {
  AuthSession,
  Envelope,
  User,
  Prediction,
  Paginated,
  MeStats,
  ModelType,
  AdminOverviewStats,
  AuditLog,
} from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 30000,
});

let accessToken: string | null = null;
let refreshInFlight: Promise<string | null> | null = null;
const refreshSubscribers: Array<(token: string | null) => void> = [];

export function setAccessToken(token: string | null) {
  accessToken = token;
}
export function getAccessToken() {
  return accessToken;
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

async function doRefresh(): Promise<string | null> {
  try {
    const { data } = await axios.post<Envelope<{ accessToken: string }>>(
      `${BASE_URL}/auth/refresh`,
      {},
      { withCredentials: true },
    );
    accessToken = data.data.accessToken;
    return accessToken;
  } catch {
    accessToken = null;
    return null;
  }
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (
      error.response?.status === 401 &&
      !original._retry &&
      !original.url?.includes("/auth/")
    ) {
      original._retry = true;
      if (!refreshInFlight) {
        refreshInFlight = doRefresh().finally(() => {
          refreshInFlight = null;
        });
      }
      const newToken = await refreshInFlight;
      if (newToken) {
        refreshSubscribers.forEach((cb) => cb(newToken));
        refreshSubscribers.length = 0;
        original.headers = { ...original.headers, Authorization: `Bearer ${newToken}` };
        return api(original);
      }
    }
    return Promise.reject(error);
  },
);

export const authApi = {
  signup: (body: { email: string; password: string; name?: string }) =>
    api.post<Envelope<{ user: User; needsVerification: boolean }>>("/auth/signup", body).then((r) => r.data.data),
  login: (body: { email: string; password: string }) =>
    api.post<Envelope<AuthSession>>("/auth/login", body).then((r) => r.data.data),
  logout: () => api.post<Envelope<{ success: true }>>("/auth/logout").then((r) => r.data.data),
  refresh: () => doRefresh(),
  forgotPassword: (body: { email: string }) =>
    api.post<Envelope<{ success: true }>>("/auth/forgot-password", body).then((r) => r.data.data),
  resetPassword: (body: { token: string; newPassword: string }) =>
    api.post<Envelope<{ success: true }>>("/auth/reset-password", body).then((r) => r.data.data),
  verifyEmail: (body: { token: string }) =>
    api.post<Envelope<{ success: true }>>("/auth/verify-email", body).then((r) => r.data.data),
  resendVerification: (body: { email: string }) =>
    api.post<Envelope<{ success: true }>>("/auth/resend-verification", body).then((r) => r.data.data),
};

export const usersApi = {
  me: () => api.get<Envelope<User>>("/users/me").then((r) => r.data.data),
  updateProfile: (body: { name?: string }) =>
    api.patch<Envelope<User>>("/users/me", body).then((r) => r.data.data),
  uploadAvatar: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return api
      .post<Envelope<{ avatarUrl: string }>>("/users/me/avatar", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data.data);
  },
  changePassword: (body: { currentPassword: string; newPassword: string }) =>
    api.patch<Envelope<{ success: true }>>("/users/me/password", body).then((r) => r.data.data),
  deleteAccount: () => api.delete<Envelope<{ success: true }>>("/users/me").then((r) => r.data.data),
};

export interface ListPredictionsQuery {
  page?: number;
  pageSize?: number;
  modelType?: ModelType;
  from?: string;
  to?: string;
  result?: string;
}

export const predictionsApi = {
  create: (file: File, modelType: ModelType) => {
    const form = new FormData();
    form.append("file", file);
    form.append("modelType", modelType);
    return api
      .post<Envelope<Prediction>>("/predictions", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data.data);
  },
  list: (query: ListPredictionsQuery = {}) =>
    api
      .get<Paginated<Prediction>>("/predictions", { params: query })
      .then((r) => r.data),
  get: (id: string) => api.get<Envelope<Prediction>>(`/predictions/${id}`).then((r) => r.data.data),
  remove: (id: string) =>
    api.delete<Envelope<{ success: true }>>(`/predictions/${id}`).then((r) => r.data.data),
  statsMe: () => api.get<Envelope<MeStats>>("/predictions/stats/me").then((r) => r.data.data),
};

export const adminApi = {
  users: (q: { page?: number; search?: string } = {}) =>
    api.get<Paginated<User>>("/admin/users", { params: q }).then((r) => r.data),
  user: (id: string) =>
    api.get<Envelope<User & { predictionCount: number }>>(`/admin/users/${id}`).then((r) => r.data.data),
  setRole: (id: string, role: "USER" | "ADMIN") =>
    api.patch<Envelope<User>>(`/admin/users/${id}/role`, { role }).then((r) => r.data.data),
  setStatus: (id: string, status: "ACTIVE" | "DISABLED") =>
    api.patch<Envelope<User>>(`/admin/users/${id}/status`, { status }).then((r) => r.data.data),
  deleteUser: (id: string) =>
    api.delete<Envelope<{ success: true }>>(`/admin/users/${id}`).then((r) => r.data.data),
  predictions: (q: ListPredictionsQuery & { userId?: string } = {}) =>
    api.get<Paginated<Prediction>>("/admin/predictions", { params: q }).then((r) => r.data),
  overview: () => api.get<Envelope<AdminOverviewStats>>("/admin/stats/overview").then((r) => r.data.data),
  auditLogs: (q: { page?: number } = {}) =>
    api.get<Paginated<AuditLog>>("/admin/audit-logs", { params: q }).then((r) => r.data),
};
