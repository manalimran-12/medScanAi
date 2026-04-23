"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usersApi } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";

export default function DangerZonePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [confirm, setConfirm] = useState("");

  const mutation = useMutation({
    mutationFn: () => usersApi.deleteAccount(),
    onSuccess: async () => {
      toast.success("Account deleted");
      await logout();
      router.replace("/");
    },
    onError: () => toast.error("Failed to delete account"),
  });

  const canDelete = confirm === user?.email;

  return (
    <Card className="border-destructive/40">
      <CardHeader>
        <CardTitle className="text-destructive">Delete account</CardTitle>
        <CardDescription>
          Permanently delete your account and all prediction history. This action cannot be undone.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>This is irreversible</AlertTitle>
          <AlertDescription>
            All your predictions and uploaded images will be deleted.
          </AlertDescription>
        </Alert>
        <div className="space-y-2">
          <Label htmlFor="confirm">
            Type your email <span className="font-mono text-xs">{user?.email}</span> to confirm
          </Label>
          <Input id="confirm" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        <Button
          variant="destructive"
          disabled={!canDelete || mutation.isPending}
          onClick={() => {
            if (confirm === user?.email) mutation.mutate();
          }}
        >
          {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Delete my account
        </Button>
      </CardContent>
    </Card>
  );
}
