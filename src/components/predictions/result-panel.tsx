import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ModelBadge } from "./model-badge";
import { formatConfidence, cn } from "@/lib/utils";
import type { Prediction } from "@/types/api";

function isPositiveResult(p: Prediction): boolean | null {
  if (!p.result) return null;
  const r = p.result.toLowerCase();
  if (r.includes("no ") || r === "normal" || r === "benign") return false;
  if (r === "pneumonia" || r === "malignant" || r.includes("disease")) return true;
  return null;
}

export function ResultPanel({ prediction }: { prediction: Prediction }) {
  if (prediction.status === "FAILED") {
    return (
      <Card className="border-destructive/50">
        <CardContent className="flex items-start gap-4 p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Prediction failed</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {prediction.errorMessage ?? "The model could not process this input."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const positive = isPositiveResult(prediction);
  const isConcerning = positive === true;

  return (
    <Card className={cn(isConcerning && "border-warning/50")}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <ModelBadge type={prediction.modelType} />
              <Badge variant={isConcerning ? "warning" : "success"} className="gap-1">
                {isConcerning ? <AlertTriangle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                {prediction.status === "SUCCEEDED" ? "Completed" : prediction.status}
              </Badge>
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight">{prediction.result}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {isConcerning
                ? "This result indicates a potential concern. Please consult a qualified medical professional."
                : "Model did not detect signs of disease."}
            </p>
          </div>
          <div className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-full", isConcerning ? "bg-warning/10" : "bg-success/10")}>
            {isConcerning ? (
              <AlertTriangle className="h-7 w-7 text-warning" />
            ) : (
              <CheckCircle2 className="h-7 w-7 text-success" />
            )}
          </div>
        </div>
        {prediction.confidence !== null && (
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Model confidence</span>
              <span className="font-medium">{formatConfidence(prediction.confidence)}</span>
            </div>
            <Progress value={(prediction.confidence ?? 0) * 100} />
          </div>
        )}
        {prediction.durationMs !== null && (
          <p className="mt-4 text-xs text-muted-foreground">Analyzed in {(prediction.durationMs / 1000).toFixed(1)}s</p>
        )}
      </CardContent>
    </Card>
  );
}

export function MiniResult({ prediction }: { prediction: Prediction }) {
  const positive = isPositiveResult(prediction);
  if (prediction.status === "FAILED") {
    return (
      <span className="inline-flex items-center gap-1 text-sm text-destructive">
        <XCircle className="h-4 w-4" /> Failed
      </span>
    );
  }
  return (
    <span className={cn("inline-flex items-center gap-1 text-sm", positive ? "text-warning" : "text-success")}>
      {positive ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
      {prediction.result}
    </span>
  );
}
