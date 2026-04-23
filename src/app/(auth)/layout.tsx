"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { Activity } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <Link href="/" className="absolute left-4 top-4 flex items-center gap-2 font-semibold">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Activity className="h-4 w-4" />
        </div>
        <span>MedScan AI</span>
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
