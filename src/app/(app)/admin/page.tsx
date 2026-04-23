"use client";

import { useQuery } from "@tanstack/react-query";
import { Users, Activity, Zap, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { adminApi } from "@/lib/api";
import { humanizeModelType } from "@/lib/utils";
import { MODEL_STYLES, ModelIcon } from "@/components/predictions/model-badge";
import type { ModelType } from "@/types/api";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function AdminOverviewPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: adminApi.overview,
  });

  const statCards = [
    { label: "Total users", value: data?.totalUsers ?? 0, icon: Users },
    { label: "Active 7d", value: data?.activeUsers7d ?? 0, icon: Activity },
    { label: "Total predictions", value: data?.totalPredictions ?? 0, icon: Zap },
    {
      label: "Peak day",
      value: data
        ? Math.max(0, ...data.signupsByWeek.map((w) => w.count))
        : 0,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">{s.label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-3xl font-bold">{s.value}</div>}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Predictions by model</CardTitle>
            <CardDescription>All-time totals across all users</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading && (
              <>
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </>
            )}
            {data && (
              <>
                {(["PNEUMONIA", "BREAST", "HEART", "LIVER"] as ModelType[]).map((t) => {
                  const count = data.predictionsByModel[t];
                  const max = Math.max(1, ...Object.values(data.predictionsByModel));
                  const pct = (count / max) * 100;
                  return (
                    <div key={t} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <ModelIcon type={t} className="h-4 w-4" />
                          {humanizeModelType(t)}
                        </span>
                        <span className="font-mono">{count}</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full ${MODEL_STYLES[t].bg.replace("/10", "/40")}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Signups by week</CardTitle>
            <CardDescription>Past 8 weeks</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-56 w-full" />
            ) : (
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.signupsByWeek ?? []}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="weekStart"
                      tickFormatter={(v) => new Date(v).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      className="text-xs"
                    />
                    <YAxis allowDecimals={false} className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 6,
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
