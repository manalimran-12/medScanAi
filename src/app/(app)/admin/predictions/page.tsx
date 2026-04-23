"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminApi } from "@/lib/api";
import { formatConfidence, formatDate } from "@/lib/utils";
import { ModelBadge } from "@/components/predictions/model-badge";
import { MiniResult } from "@/components/predictions/result-panel";
import type { ModelType } from "@/types/api";

export default function AdminPredictionsPage() {
  const [page, setPage] = useState(1);
  const [modelType, setModelType] = useState<ModelType | "ALL">("ALL");

  const query = useQuery({
    queryKey: ["admin-predictions", { page, modelType }],
    queryFn: () =>
      adminApi.predictions({
        page,
        pageSize: 20,
        modelType: modelType === "ALL" ? undefined : modelType,
      }),
  });

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-end gap-3">
          <div className="w-48 space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Model</label>
            <Select value={modelType} onValueChange={(v) => { setModelType(v as ModelType | "ALL"); setPage(1); }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All models</SelectItem>
                <SelectItem value="PNEUMONIA">Pneumonia</SelectItem>
                <SelectItem value="BREAST">Breast</SelectItem>
                <SelectItem value="HEART">Heart</SelectItem>
                <SelectItem value="LIVER">Liver</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
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
                  {Array.from({ length: 5 }).map((__, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            {query.data?.data.map((p) => (
              <TableRow key={p.id} className="cursor-pointer">
                <TableCell className="font-mono text-xs text-muted-foreground">{p.userId}</TableCell>
                <TableCell>
                  <ModelBadge type={p.modelType} />
                </TableCell>
                <TableCell>
                  <Link href={`/predictions/${p.id}`} className="hover:underline">
                    <MiniResult prediction={p} />
                  </Link>
                </TableCell>
                <TableCell className="font-mono text-sm">{formatConfidence(p.confidence)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatDate(p.createdAt, true)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {(query.data?.meta.pagination.totalPages ?? 1) > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {query.data?.meta.pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= (query.data?.meta.pagination.totalPages ?? 1)}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
