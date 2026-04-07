"use client";

import { Sun, Moon, Palette, Bell, Eye } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ThemeSettings() {
  const { theme, mode, setTheme, setMode } = useTheme();

  const themes = [
    {
      value: "default",
      label: "Teal Green",
      description: "Dark teal and bright blue colors",
      primary: "#0f765e",
      secondary: "#b3e5db",
    },
    {
      value: "orange-darkblue",
      label: "Orange & Dark Blue",
      description: "Modern combination of orange and dark blue",
      primary: "#228bff",
      secondary: "#ff9935",
    },
    {
      value: "blackwhite",
      label: "Black & White",
      description: "Professional minimalist black and white design",
      primary: "#000000",
      secondary: "#ffffff",
    },
  ];

  const modes = [
    {
      value: "light",
      label: "Light Mode",
      description: "Bright display for daytime",
      icon: Sun,
    },
    {
      value: "dark",
      label: "Dark Mode",
      description: "Dark display for nighttime",
      icon: Moon,
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Display Mode Section */}
      <Card className="border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent pb-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/20 p-3">
              <Eye className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle>Mode Tampilan</CardTitle>
              <CardDescription>Choose between light or dark mode</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {modes.map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.value}
                  onClick={() => setMode(m.value as any)}
                  className={`group relative overflow-hidden rounded-xl border-2 p-6 text-center transition-all duration-200 hover:shadow-lg ${
                    mode === m.value
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-muted bg-card hover:border-primary/50"
                  }`}
                >
                  {/* Icon */}
                  <div className="flex justify-center mb-3">
                    <div
                      className={`p-3 rounded-lg transition-all ${
                        mode === m.value
                          ? "bg-primary/20"
                          : "bg-muted group-hover:bg-muted/80"
                      }`}
                    >
                      <Icon
                        className={`h-8 w-8 ${
                          mode === m.value ? "text-primary" : "text-muted-foreground"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Label & Description */}
                  <h3 className="font-semibold text-foreground">{m.label}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{m.description}</p>

                  {/* Active Badge */}
                  {mode === m.value && (
                    <div className="absolute top-3 right-3 rounded-full bg-primary px-3 py-1">
                      <span className="text-xs font-semibold text-primary-foreground">
                        Active
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Color Theme Section */}
      <Card className="border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent pb-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/20 p-3">
              <Palette className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle>Color Theme</CardTitle>
              <CardDescription>Choose your preferred color palette</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
            {themes.map((t) => (
              <button
                key={t.value}
                onClick={() => setTheme(t.value as any)}
                className={`group relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all duration-200 hover:shadow-lg ${
                  theme === t.value
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-muted bg-card hover:border-primary/50"
                }`}
              >
                {/* Color Preview */}
                <div className="mb-3 flex gap-2">
                  <div
                    className="h-10 w-10 rounded-lg shadow-sm transition-transform group-hover:scale-105"
                    style={{ backgroundColor: t.primary }}
                  />
                  <div
                    className="h-10 w-10 rounded-lg shadow-sm transition-transform group-hover:scale-105"
                    style={{ backgroundColor: t.secondary }}
                  />
                </div>

                {/* Label & Description */}
                <h3 className="font-semibold text-foreground">{t.label}</h3>
                <p className="text-xs text-muted-foreground mt-1">{t.description}</p>

                {/* Active Badge */}
                {theme === t.value && (
                  <div className="absolute top-3 right-3 rounded-full bg-primary px-3 py-1">
                    <span className="text-xs font-semibold text-primary-foreground">Active</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings Section */}
      <Card className="border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent pb-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/20 p-3">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border border-muted bg-muted/30">
              <div>
                <p className="font-medium text-sm">New Report Notifications</p>
                <p className="text-xs text-muted-foreground mt-1">Receive notifications when new reports are submitted</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-muted bg-muted/30">
              <div>
                <p className="font-medium text-sm">Status Updates</p>
                <p className="text-xs text-muted-foreground mt-1">Notify when report status changes</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-muted bg-muted/30">
              <div>
                <p className="font-medium text-sm">New Comments</p>
                <p className="text-xs text-muted-foreground mt-1">Notify when new comments are added to your reports</p>
              </div>
              <input type="checkbox" className="w-5 h-5 rounded" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle>Theme Preview</CardTitle>
          <CardDescription>This is how your theme looks right now</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg border border-primary/20 bg-card p-4 space-y-2">
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded"
                style={{ backgroundColor: "var(--primary)" }}
              />
              <span className="text-sm font-medium">Primary Color</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded"
                style={{ backgroundColor: "var(--accent)" }}
              />
              <span className="text-sm font-medium">Accent Color</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded"
                style={{ backgroundColor: "var(--muted)" }}
              />
              <span className="text-sm font-medium">Muted Color</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            ✅ All preferences are automatically saved and applied throughout the application.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
