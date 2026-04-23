"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authApi } from "@/lib/api";

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    if (!token) return;
    setStatus("loading");
    authApi
      .verifyEmail({ token })
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, [token]);

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Verify email</CardTitle>
        <CardDescription>Confirming your account</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        {!token && (
          <p className="text-sm text-muted-foreground">No verification token provided. Check your email for the correct link.</p>
        )}
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Verifying…</p>
          </div>
        )}
        {status === "success" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <CheckCircle2 className="h-12 w-12 text-success" />
            <p className="text-sm">Your email is verified.</p>
            <Button asChild className="w-full">
              <Link href="/login">Continue to sign in</Link>
            </Button>
          </div>
        )}
        {status === "error" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <XCircle className="h-12 w-12 text-destructive" />
            <p className="text-sm">This verification link is invalid or expired.</p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">Back to sign in</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
