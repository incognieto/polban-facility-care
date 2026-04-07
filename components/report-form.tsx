"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FileText, MapPin, Type, Image as ImageIcon, Send, AlertCircle, CheckCircle2 } from "lucide-react";
import { REPORT_CATEGORIES, REPORT_LOCATIONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function ReportForm() {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <Card className="h-full border-0 shadow-xl bg-gradient-to-br from-card to-primary/5">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent pb-3 sm:pb-4">
        <div className="flex items-start gap-2 sm:gap-3">
          <div className="rounded-lg bg-primary/20 p-2 sm:p-3 flex-shrink-0">
            <FileText className="h-4 sm:h-5 w-4 sm:w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg sm:text-xl">Create New Report</CardTitle>
            <CardDescription className="mt-1 text-xs sm:text-sm">
              Attach photo for quick verification by field team
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
        <form
          className="space-y-4 sm:space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const formData = new FormData(form);
            formData.set("category", category);
            formData.set("location", location);

            setMessage(null);
            setError(null);

            startTransition(async () => {
              const response = await fetch("/api/reports", {
                method: "POST",
                body: formData,
              });

              const payload = await response.json();

              if (!response.ok) {
                setError(payload.message ?? "Failed to send report.");
                return;
              }

              setMessage("Report sent successfully.");
              form.reset();
              setCategory("");
              setLocation("");
              router.refresh();
            });
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
              <Type className="h-4 w-4 text-primary" />
              Report Title
            </Label>
            <Input 
              id="title" 
              name="title" 
              placeholder="Example: Corridor light broken" 
              className="border-primary/20 bg-card/50 focus:border-primary"
              required 
            />
          </div>

          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-semibold">
                <FileText className="h-4 w-4 text-accent" />
                Category
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="border-accent/20 bg-card/50">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {REPORT_CATEGORIES.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-semibold">
                <MapPin className="h-4 w-4 text-accent" />
                Location
              </Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="border-accent/20 bg-card/50">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {REPORT_LOCATIONS.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2 text-sm font-semibold">
              <Type className="h-4 w-4 text-primary" />
              Description
            </Label>
            <Textarea 
              id="description" 
              name="description" 
              placeholder="Describe the issue, impact, and required actions..." 
              className="border-primary/20 bg-card/50 focus:border-primary resize-none"
              rows={4}
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image" className="flex items-center gap-2 text-sm font-semibold">
              <ImageIcon className="h-4 w-4 text-accent" />
              Upload Photo
            </Label>
            <div className="relative">
              <Input 
                id="image" 
                name="image" 
                type="file" 
                accept="image/*" 
                className="border-2 border-dashed border-primary/30 bg-primary/5 hover:border-primary/50 file:hidden cursor-pointer"
                required 
              />
              <span className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs text-muted-foreground">
                Drag or click to select photo
              </span>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 flex gap-2 items-start">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
          {message && (
            <div className="rounded-lg bg-green-50 p-3 flex gap-2 items-start">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-green-700">{message}</p>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full gap-2 h-11 font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary" 
            disabled={isPending || !category || !location}
          >
            <Send className="h-4 w-4" />
            {isPending ? "Sending..." : "Submit Report"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
