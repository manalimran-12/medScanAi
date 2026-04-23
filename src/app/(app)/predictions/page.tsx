"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { predictionsApi } from "@/lib/api";
import { formatDate, formatConfidence } from "@/lib/utils";
import { ModelBadge } from "@/components/predictions/model-badge";
import { MiniResult } from "@/components/predictions/result-panel";
import type { ModelType } from "@/types/api";

const PAGE_SIZE = 10;

export default function HistoryPage() {
  const [page, setPage] = useState(1);
  const [modelType, setModelType] = useState<ModelType | "ALL">("ALL");
  const [result, setResult] = useState("");

  const query = useQuery({
    queryKey: ["predictions", { page, pageSize: PAGE_SIZE, modelType, result }],
    queryFn: () =>
      predictionsApi.list({
        page,
        pageSize: PAGE_SIZE,
        modelType: modelType === "ALL" ? undefined : modelType,
        result: result || undefined,
      }),
  });

  const totalPages = query.data?.meta.pagination.totalPages ?? 1;
  const total = query.data?.meta.pagination.total ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prediction history</h1>
          <p className="mt-1 text-muted-foreground">
            {total} {total === 1 ? "prediction" : "predictions"} on record
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/predictions/new">
            <PlusCircle className="h-4 w-4" />
            New prediction
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-end">
          <div className="flex flex-1 items-end gap-3">
            <div className="flex-1 min-w-0 space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Model</label>
              <Select value={modelType} onValueChange={(v) => { setModelType(v as ModelType | "ALL"); setPage(1); }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All models</SelectItem>
                  <SelectItem value="PNEUMONIA">Pneumonia</SelectItem>
                  <SelectItem value="BREAST">Breast Cancer</SelectItem>
                  <SelectItem value="HEART">Heart Disease</SelectItem>
                  <SelectItem value="LIVER">Liver Disease</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Result</label>
              <Input
                placeholder="e.g. Pneumonia"
                value={result}
                onChange={(e) => { setResult(e.target.value); setPage(1); }}
              />
            </div>
          </div>
          {(modelType !== "ALL" || result) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setModelType("ALL"); setResult(""); setPage(1); }}
              className="gap-1"
            >
              <X className="h-3 w-3" />
              Clear
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Model</TableHead>
              <TableHead>Result</TableHead>
              <TableHead>Confidence</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {query.isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                </TableRow>
              ))}
            {query.data && query.data.data.length === 0 && (
              <TableRow>
                <TableCell colSpan={4}>
                  <div className="flex flex-col items-center gap-2 py-12 text-center">
                    <Filter className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No predictions match your filters.</p>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/predictions/new">Create one</Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {query.data?.data.map((p) => (
              <TableRow
                key={p.id}
                className="cursor-pointer"
                onClick={() => (window.location.href = `/predictions/${p.id}`)}
              >
                <TableCell>
                  <ModelBadge type={p.modelType} />
                </TableCell>
                <TableCell>
                  <MiniResult prediction={p} />
                </TableCell>
                <TableCell className="font-mono text-sm">{formatConfidence(p.confidence)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatDate(p.createdAt, true)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
