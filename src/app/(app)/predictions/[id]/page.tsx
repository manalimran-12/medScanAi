"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { predictionsApi } from "@/lib/api";
import { formatDate, formatConfidence, humanizeModelType } from "@/lib/utils";
import { ResultPanel } from "@/components/predictions/result-panel";

export default function PredictionDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["prediction", params.id],
    queryFn: () => predictionsApi.get(params.id),
  });

  const deleteMutation = useMutation({
    mutationFn: () => predictionsApi.remove(params.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["predictions"] });
      qc.invalidateQueries({ queryKey: ["stats-me"] });
      toast.success("Prediction deleted");
      router.push("/predictions");
    },
    onError: () => toast.error("Failed to delete prediction"),
  });

  if (query.isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (query.isError || !query.data) {
    return (
      <div className="mx-auto max-w-4xl py-16 text-center">
        <h1 className="text-2xl font-bold">Prediction not found</h1>
        <p className="mt-2 text-muted-foreground">It may have been deleted or you don&apos;t have access.</p>
        <Button asChild className="mt-6">
          <Link href="/predictions">Back to history</Link>
        </Button>
      </div>
    );
  }

  const p = query.data;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="gap-2">
          <Link href="/predictions">
            <ArrowLeft className="h-4 w-4" />
            Back to history
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-destructive hover:text-destructive"
          onClick={() => {
            if (confirm("Delete this prediction? This cannot be undone.")) deleteMutation.mutate();
          }}
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          Delete
        </Button>
      </div>

      <ResultPanel prediction={p} />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Input image</CardTitle>
          </CardHeader>
          <CardContent>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.imageUrl}
              alt="prediction input"
              className="w-full rounded-md border bg-muted object-contain"
              style={{ maxHeight: 400 }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row label="Model" value={humanizeModelType(p.modelType)} />
            <Separator />
            <Row label="Status" value={p.status} />
            <Separator />
            <Row label="Result" value={p.result ?? "—"} />
            <Separator />
            <Row label="Confidence" value={formatConfidence(p.confidence)} />
            <Separator />
            <Row label="Submitted" value={formatDate(p.createdAt, true)} />
            <Separator />
            <Row
              label="Analysis time"
              value={p.durationMs ? `${(p.durationMs / 1000).toFixed(1)}s` : "—"}
            />
            {p.errorMessage && (
              <>
                <Separator />
                <Row label="Error" value={p.errorMessage} />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right break-all">{value}</span>
    </div>
  );
}
