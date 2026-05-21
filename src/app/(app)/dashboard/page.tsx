"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  PlusCircle,
  Activity,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Zap,
  Sparkles,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { predictionsApi } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import { formatDate, humanizeModelType, formatConfidence, cn } from "@/lib/utils";
import { MODEL_STYLES, ModelIcon } from "@/components/predictions/model-badge";
import { MiniResult } from "@/components/predictions/result-panel";
import { QuickActions } from "@/components/dashboard/quick-actions";
import type { ModelType, MeStats } from "@/types/api";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";

const MODEL_HEX: Record<ModelType, string> = {
  PNEUMONIA: "#3b82f6",
  BREAST: "#a855f7",
  HEART: "#f43f5e",
  LIVER: "#f59e0b",
};

const TIPS = [
  "Use high-resolution, well-lit images for best OCR accuracy on lab reports.",
  "Confidence below 70% means the model is uncertain — always consult a doctor.",
  "X-rays should be cropped to show just the chest for optimal pneumonia detection.",
  "Multiple scans of the same report help you compare confidence across attempts.",
  "Predictions complement, never replace, a qualified medical opinion.",
];

export default function DashboardPage() {
  const { user } = useAuth();

  const statsQuery = useQuery({
    queryKey: ["stats-me"],
    queryFn: predictionsApi.statsMe,
  });
  const recentQuery = useQuery({
    queryKey: ["predictions", { page: 1, pageSize: 5 }],
    queryFn: () => predictionsApi.list({ page: 1, pageSize: 5 }),
  });

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  const tip = TIPS[new Date().getDate() % TIPS.length];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {greeting}, {user?.name?.split(" ")[0] ?? "there"}
          </h1>
          <p className="mt-1 text-muted-foreground">Here&apos;s your diagnostic activity at a glance.</p>
        </div>
        <Button asChild size="lg" className="gap-2">
          <Link href="/predictions/new">
            <PlusCircle className="h-4 w-4" />
            New prediction
          </Link>
        </Button>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Quick start</h2>
        <QuickActions />
      </div>

      {/* KPI row */}
      <KpiRow stats={statsQuery.data} isLoading={statsQuery.isLoading} />

      {/* Charts + Recent predictions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Activity insights</CardTitle>
                <CardDescription>Switch views to explore your prediction patterns</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="activity">
              <TabsList>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="distribution">Distribution</TabsTrigger>
                <TabsTrigger value="confidence">Confidence</TabsTrigger>
              </TabsList>

              <TabsContent value="activity" className="mt-4">
                {statsQuery.isLoading ? (
                  <Skeleton className="h-72 w-full" />
                ) : (
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={statsQuery.data?.last30Days ?? []}>
                        <defs>
                          <linearGradient id="gradActivity" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(v) => new Date(v).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                          className="text-xs"
                        />
                        <YAxis allowDecimals={false} className="text-xs" />
                        <Tooltip
                          contentStyle={chartTooltipStyle}
                          labelFormatter={(v) => formatDate(v as string)}
                        />
                        <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" fill="url(#gradActivity)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="distribution" className="mt-4">
                <DistributionView stats={statsQuery.data} isLoading={statsQuery.isLoading} />
              </TabsContent>

              <TabsContent value="confidence" className="mt-4">
                <ConfidenceView stats={statsQuery.data} isLoading={statsQuery.isLoading} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Success rate gauge */}
          <SuccessRateCard stats={statsQuery.data} isLoading={statsQuery.isLoading} />

          {/* Recent predictions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent activity</CardTitle>
                  <CardDescription>Your last 5 scans</CardDescription>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/predictions">
                    All <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentQuery.isLoading && (
                <>
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                </>
              )}
              {recentQuery.data && recentQuery.data.data.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No predictions yet.{" "}
                  <Link href="/predictions/new" className="text-primary hover:underline">
                    Create your first
                  </Link>
                  .
                </p>
              )}
              {recentQuery.data?.data.map((p) => (
                <Link
                  key={p.id}
                  href={`/predictions/${p.id}`}
                  className="flex items-center gap-3 rounded-md border p-3 transition-colors hover:bg-accent"
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${MODEL_STYLES[p.modelType].bg}`}>
                    <ModelIcon type={p.modelType} className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <MiniResult prediction={p} />
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">{formatDate(p.createdAt, true)}</p>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Model breakdown grid + tip */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Per-model snapshot</CardTitle>
            <CardDescription>Totals, concerning results, and average confidence for each model</CardDescription>
          </CardHeader>
          <CardContent>
            <ModelBreakdown stats={statsQuery.data} isLoading={statsQuery.isLoading} />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Alert>
            <Sparkles className="h-4 w-4" />
            <AlertDescription>
              <span className="font-medium">Tip of the day.</span> {tip}
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Compute time saved</CardTitle>
            </CardHeader>
            <CardContent>
              {statsQuery.isLoading ? (
                <Skeleton className="h-12 w-full" />
              ) : (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">
                      {((statsQuery.data?.totalProcessingMs ?? 0) / 1000).toFixed(1)}s
                    </span>
                    <span className="text-sm text-muted-foreground">of AI compute run for you</span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Across {statsQuery.data?.totalAll ?? 0} predictions — average{" "}
                    {statsQuery.data && statsQuery.data.totalAll > 0
                      ? (statsQuery.data.totalProcessingMs / statsQuery.data.totalAll / 1000).toFixed(1)
                      : "0.0"}
                    s each.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ KPI Row ------------------------------ */

function KpiRow({ stats, isLoading }: { stats: MeStats | undefined; isLoading: boolean }) {
  const items = [
    {
      label: "Total predictions",
      value: stats?.totalAll ?? 0,
      icon: Activity,
      hint: "all time",
    },
    {
      label: "This week",
      value: stats?.thisWeek ?? 0,
      icon: Zap,
      delta: stats?.deltaPct ?? 0,
    },
    {
      label: "Success rate",
      value: stats ? `${Math.round(stats.successRate * 100)}%` : "—",
      icon: CheckCircle2,
      hint: stats ? `${stats.successCount}/${stats.totalAll || 0} succeeded` : "",
      accent: "success" as const,
    },
    {
      label: "Needs attention",
      value: stats?.totalConcerning ?? 0,
      icon: AlertTriangle,
      hint: "positive findings",
      accent: "warning" as const,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((k) => {
        const Icon = k.icon;
        return (
          <Card key={k.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{k.label}</CardTitle>
              <Icon
                className={cn(
                  "h-4 w-4",
                  k.accent === "success"
                    ? "text-success"
                    : k.accent === "warning"
                      ? "text-warning"
                      : "text-muted-foreground",
                )}
              />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{k.value}</span>
                  {k.delta !== undefined && stats && stats.totalAll > 0 && (
                    <span
                      className={cn(
                        "flex items-center gap-0.5 text-xs font-medium",
                        k.delta > 0 ? "text-success" : k.delta < 0 ? "text-destructive" : "text-muted-foreground",
                      )}
                    >
                      {k.delta > 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : k.delta < 0 ? (
                        <TrendingDown className="h-3 w-3" />
                      ) : null}
                      {k.delta > 0 ? "+" : ""}
                      {k.delta}%
                    </span>
                  )}
                </div>
              )}
              <p className="mt-1 text-xs text-muted-foreground">{k.hint ?? "vs last week"}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

/* ------------------------- Distribution (Pie) ------------------------ */

function DistributionView({ stats, isLoading }: { stats: MeStats | undefined; isLoading: boolean }) {
  const data = useMemo(() => {
    if (!stats) return [];
    return (Object.entries(stats.byModel) as Array<[ModelType, number]>)
      .filter(([, v]) => v > 0)
      .map(([k, v]) => ({ name: humanizeModelType(k), value: v, type: k }));
  }, [stats]);

  if (isLoading) return <Skeleton className="h-72 w-full" />;
  if (data.length === 0) {
    return (
      <div className="flex h-72 flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
        <Info className="h-8 w-8" />
        Run your first prediction to see the distribution.
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(((percent as number) ?? 0) * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((d) => (
              <Cell key={d.type} fill={MODEL_HEX[d.type]} stroke="hsl(var(--background))" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip contentStyle={chartTooltipStyle} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ------------------------- Confidence (Bar) -------------------------- */

function ConfidenceView({ stats, isLoading }: { stats: MeStats | undefined; isLoading: boolean }) {
  const data = useMemo(() => {
    if (!stats) return [];
    return (Object.entries(stats.avgConfidenceByModel) as Array<[ModelType, number | null]>).map(([k, v]) => ({
      name: humanizeModelType(k),
      type: k,
      confidence: v === null ? 0 : Math.round(v * 100),
    }));
  }, [stats]);

  if (isLoading) return <Skeleton className="h-72 w-full" />;

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} className="text-xs" />
          <YAxis type="category" dataKey="name" width={100} className="text-xs" />
          <Tooltip contentStyle={chartTooltipStyle} formatter={(v) => [`${v}%`, "Avg confidence"]} />
          <Bar dataKey="confidence" radius={[0, 4, 4, 0]}>
            {data.map((d) => (
              <Cell key={d.type} fill={MODEL_HEX[d.type]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* --------------------- Success Rate Radial Gauge --------------------- */

function SuccessRateCard({ stats, isLoading }: { stats: MeStats | undefined; isLoading: boolean }) {
  const pct = Math.round((stats?.successRate ?? 0) * 100);
  const data = [{ name: "Success", value: pct, fill: "hsl(var(--success))" }];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Analysis success</CardTitle>
        <CardDescription>How often your uploads were processed cleanly</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : stats && stats.totalAll === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No data yet.</p>
        ) : (
          <div className="relative h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="70%"
                outerRadius="100%"
                data={data}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar background={{ fill: "hsl(var(--muted))" }} dataKey="value" cornerRadius={8} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold">{pct}%</div>
              <div className="text-xs text-muted-foreground">
                {stats?.successCount ?? 0} of {stats?.totalAll ?? 0}
              </div>
            </div>
          </div>
        )}
        {stats && stats.failedCount > 0 && (
          <div className="mt-4 flex items-center justify-between rounded-md bg-muted/50 px-3 py-2 text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <XCircle className="h-3.5 w-3.5 text-destructive" />
              Failed runs
            </span>
            <Badge variant="destructive">{stats.failedCount}</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ----------------------- Per-model breakdown ------------------------- */

function ModelBreakdown({ stats, isLoading }: { stats: MeStats | undefined; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {(["PNEUMONIA", "BREAST", "HEART", "LIVER"] as ModelType[]).map((t) => {
        const count = stats?.byModel[t] ?? 0;
        const avg = stats?.avgConfidenceByModel[t];
        const concerning = stats?.concerningByModel[t] ?? 0;
        return (
          <div key={t} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-md", MODEL_STYLES[t].bg)}>
                  <ModelIcon type={t} className="h-4 w-4" />
                </div>
                <span className="font-medium">{humanizeModelType(t)}</span>
              </div>
              <span className="font-mono text-xl font-bold">{count}</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="text-muted-foreground">Avg confidence</div>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${avg ? Math.round(avg * 100) : 0}%`,
                        backgroundColor: MODEL_HEX[t],
                      }}
                    />
                  </div>
                  <span className="font-mono font-medium">{avg ? formatConfidence(avg) : "—"}</span>
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Concerning</div>
                <div
                  className={cn(
                    "mt-0.5 inline-flex items-center gap-1 font-medium",
                    concerning > 0 ? "text-warning" : "text-muted-foreground",
                  )}
                >
                  {concerning > 0 && <AlertTriangle className="h-3 w-3" />}
                  {concerning}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------------------- Shared --------------------------------- */

const chartTooltipStyle = {
  backgroundColor: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 6,
  fontSize: 12,
};
