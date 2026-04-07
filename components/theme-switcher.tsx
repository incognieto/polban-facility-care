"use client";

import Link from "next/link";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeSwitcher() {
  return (
    <Button 
      asChild 
      variant="outline" 
      size="sm" 
      className="gap-2"
    >
      <Link href="/dashboard/settings">
        <Settings className="h-4 w-4" />
        <span className="hidden sm:inline">Settings</span>
      </Link>
    </Button>
  );
}
