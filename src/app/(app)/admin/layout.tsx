"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Users, List, ScrollText } from "lucide-react";
import { cn } from "@/lib/utils";
import { RoleGuard } from "@/components/auth-guard";
import type { ReactNode } from "react";

const tabs = [
  { href: "/admin", label: "Overview", icon: BarChart3 },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/predictions", label: "Predictions", icon: List },
  { href: "/admin/audit", label: "Audit log", icon: ScrollText },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <RoleGuard role="ADMIN">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin panel</h1>
          <p className="mt-1 text-muted-foreground">Manage users, predictions, and platform health.</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto border-b">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = pathname === t.href;
            return (
              <Link
                key={t.href}
                href={t.href}
                className={cn(
                  "flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </Link>
            );
          })}
        </nav>
        <div>{children}</div>
      </div>
    </RoleGuard>
  );
}
