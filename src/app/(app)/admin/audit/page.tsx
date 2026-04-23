"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { adminApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";

const ACTION_VARIANT: Record<string, "default" | "secondary" | "destructive" | "warning" | "success"> = {
  "auth.login": "success",
  "auth.logout": "secondary",
  "prediction.create": "default",
  "admin.user.disable": "destructive",
};

export default function AdminAuditPage() {
  const [page, setPage] = useState(1);
  const query = useQuery({
    queryKey: ["admin-audit", page],
    queryFn: () => adminApi.auditLogs({ page }),
  });

  return (
    <div className="space-y-4">
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>IP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {query.isLoading &&
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 5 }).map((__, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            {query.data?.data.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="text-xs text-muted-foreground">{formatDate(log.createdAt, true)}</TableCell>
                <TableCell>
                  <Badge variant={ACTION_VARIANT[log.action] ?? "outline"}>{log.action}</Badge>
                </TableCell>
                <TableCell className="text-sm">{log.userEmail ?? "—"}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {log.entityType ? `${log.entityType}#${log.entityId?.slice(0, 8)}` : "—"}
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{log.ip ?? "—"}</TableCell>
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
