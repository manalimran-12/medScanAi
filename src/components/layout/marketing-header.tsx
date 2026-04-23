"use client";

import Link from "next/link";
import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "@/providers/auth-provider";

export function MarketingHeader() {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Activity className="h-4 w-4" />
          </div>
          <span className="text-lg tracking-tight">MedScan AI</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link href="/models" className="text-muted-foreground transition-colors hover:text-foreground">
            Models
          </Link>
          <Link href="/about" className="text-muted-foreground transition-colors hover:text-foreground">
            About
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <Button asChild size="sm">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
