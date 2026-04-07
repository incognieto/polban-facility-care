"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Workflow, CheckCircle2, AlertCircle } from "lucide-react";
import { STATUS_FLOW } from "@/lib/constants";
import { formatStatusLabel } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function StatusManager({
  reportId,
  currentStatus,
}: {
  reportId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const getStatusColor = (s: string) => {
    if (s === "OPEN") return "border-destructive/30 bg-destructive/5";
    if (s === "IN_PROGRESS") return "border-accent/30 bg-accent/5";
    return "border-green-300/30 bg-green-50";
  };

  return (
    <div className={`rounded-2xl border-2 ${getStatusColor(status)} bg-gradient-to-br hover:shadow-lg transition-shadow p-4 sm:p-5`}>
      <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="rounded-lg bg-primary/20 p-2 sm:p-2 flex-shrink-0">
          <Workflow className="h-4 sm:h-5 w-4 sm:w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm sm:text-base">Update Report Status</h3>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            Change workflow status to update field handling progress
          </p>
        </div>
      </div>

      <div className="space-y-2 sm:space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <select 
            value={status} 
            onChange={(event) => setStatus(event.target.value)} 
            className="flex-1 h-10 rounded-lg border border-primary/20 bg-card px-3 text-sm font-medium focus:ring-2 focus:ring-primary outline-none transition-all"
          >
            {STATUS_FLOW.map((item) => (
              <option key={item} value={item}>
                {formatStatusLabel(item)}
              </option>
            ))}
          </select>
          <Button
            disabled={isPending || status === currentStatus}
            onClick={() => {
              setMessage(null);
              setError(null);

              startTransition(async () => {
                const response = await fetch(`/api/reports/${reportId}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ status }),
                });

                const payload = await response.json();

                if (!response.ok) {
                  setError(payload.message ?? "Failed to update status.");
                  return;
                }

                setMessage("Report status updated successfully.");
                router.refresh();
              });
            }}
            className="gap-2 whitespace-nowrap"
          >
            <CheckCircle2 className="h-4 w-4" />
            {isPending ? "Saving..." : "Save"}
          </Button>
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
      </div>
    </div>
  );
}
