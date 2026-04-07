import { ArrowLeft, Settings as SettingsIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeSettings } from "@/components/theme-settings";
import { requireSession } from "@/lib/auth";

export default async function SettingsPage() {
  const session = await requireSession();

  return (
    <main className="container max-w-3xl py-6 sm:py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <Button asChild variant="ghost" className="h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 p-0">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 sm:h-5 w-4 sm:w-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="rounded-lg bg-primary/20 p-2 sm:p-3 flex-shrink-0">
              <SettingsIcon className="h-5 sm:h-6 w-5 sm:w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">Manage your preferences and personalize the application</p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <ThemeSettings />
    </main>
  );
}
