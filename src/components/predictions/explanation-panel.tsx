"use client";

import { Info, Sparkles, ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { withApiBase } from "@/lib/images";
import { cn } from "@/lib/utils";
import type { Prediction, ShapFeature } from "@/types/api";

export function ExplanationPanel({ prediction }: { prediction: Prediction }) {
  const { explanation, explanationImageUrl } = prediction;

  if (!explanation) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Why the model decided this</CardTitle>
            <CardDescription>
              {explanation.type === "gradcam"
                ? "Heatmap highlights the regions the CNN focused on."
                : "Clinical values ranked by their contribution to the outcome."}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="ml-auto">
            {explanation.type === "gradcam" ? "Grad-CAM" : "SHAP"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {explanation.type === "gradcam" && (
          <GradcamView imageUrl={explanationImageUrl} description={explanation.description ?? null} />
        )}
        {explanation.type === "shap" && (
          <ShapView features={explanation.features} description={explanation.description ?? null} />
        )}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Explanations are informational aids. They reflect the model's internal reasoning, not medical ground truth.
            Always consult a qualified clinician for diagnostic decisions.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

function GradcamView({ imageUrl, description }: { imageUrl: string | null; description: string | null }) {
  if (!imageUrl) {
    return (
      <p className="text-sm text-muted-foreground">Grad-CAM overlay is not available for this prediction.</p>
    );
  }
  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-md border bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={withApiBase(imageUrl)}
          alt="Grad-CAM overlay"
          className="w-full object-contain"
          style={{ maxHeight: 480 }}
        />
      </div>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-sm bg-blue-500" /> Low attention
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-sm bg-red-500" /> High attention
        </span>
      </div>
    </div>
  );
}

function ShapView({ features, description }: { features: ShapFeature[]; description: string | null }) {
  if (!features?.length) {
    return <p className="text-sm text-muted-foreground">No feature contributions available.</p>;
  }
  const maxAbs = Math.max(...features.map((f) => Math.abs(f.shapValue)));

  return (
    <div className="space-y-3">
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      <div className="space-y-2">
        {features.map((f) => {
          const widthPct = maxAbs === 0 ? 0 : Math.round((Math.abs(f.shapValue) / maxAbs) * 100);
          const isPositive = f.effect === "positive";
          return (
            <div key={f.feature} className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-md border p-3">
              <div className="min-w-0 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-mono text-xs font-medium">{humanizeFeature(f.feature)}</span>
                  <span className="text-xs text-muted-foreground">{formatValue(f.value)}</span>
                </div>
                <div className="flex h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      isPositive ? "bg-warning" : "bg-success",
                    )}
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </div>
              <div
                className={cn(
                  "flex items-center gap-1 text-xs font-medium tabular-nums",
                  isPositive ? "text-warning" : "text-success",
                )}
              >
                {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {f.shapValue > 0 ? "+" : ""}
                {f.shapValue.toFixed(3)}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        <span className="font-medium text-warning">Up</span> = pushed toward disease/positive outcome.{" "}
        <span className="font-medium text-success">Down</span> = pushed away.
      </p>
    </div>
  );
}

function humanizeFeature(name: string): string {
  return name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatValue(v: number): string {
  if (!Number.isFinite(v)) return "—";
  if (Math.abs(v) >= 1000 || Number.isInteger(v)) return v.toLocaleString();
  return v.toFixed(2);
}
