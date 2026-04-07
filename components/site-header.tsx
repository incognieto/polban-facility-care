"use client";

import Link from "next/link";
import { Building2, ClipboardCheck, Search, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import type { SessionPayload } from "@/lib/session";

export function SiteHeader({
  session,
  search,
}: {
  session: SessionPayload;
  search?: string;
}) {
  return (
    <header className="rounded-xl sm:rounded-2xl border border-primary/20 bg-card/95 p-4 sm:p-6 shadow-lg backdrop-blur hover:shadow-xl transition-shadow">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-4 text-primary">
            <div className="rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 p-3 shadow-md">
              <Building2 className="h-6 w-6" />
            </div>
            <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.25em] font-semibold text-muted-foreground hidden sm:block">Polban Facility Care</p>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Campus Facility Care
              </h1>
            </div>
          </div>
          <p className="text-xs text-muted-foreground ml-0 sm:ml-16">
            👤 <span className="inline sm:hidden">{session.name.split(' ')[0]}</span><span className="hidden sm:inline">{session.name}</span>
            <span className="mx-1 sm:mx-2 text-primary/30">•</span>
            <span className="font-medium text-primary text-xs sm:text-sm">{session.role}</span>
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <form action="/dashboard" className="relative flex-1 sm:flex-none">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              name="search"
              defaultValue={search}
              placeholder="Search..."
              className="h-10 w-full sm:min-w-[240px] rounded-lg border border-primary/20 bg-card pl-10 pr-4 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-primary transition-all duration-200"
            />
          </form>
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link href="/dashboard/admin">
                <ClipboardCheck className="h-4 w-4" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            </Button>
            <form action="/api/auth/logout" method="post">
              <Button variant="ghost" type="submit" size="sm" className="gap-2 text-muted-foreground hover:text-destructive">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
