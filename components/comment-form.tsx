"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Send, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function CommentForm({ reportId }: { reportId: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-2 sm:space-y-3 animate-in fade-in duration-500">
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Add Update</label>
        <Textarea 
          value={body} 
          onChange={(event) => setBody(event.target.value)} 
          placeholder="Add handling update or field findings..." 
          className="border-primary/20 bg-card/50 focus:border-primary resize-none text-sm"
          rows={3}
        />
      </div>
      <div className="flex flex-col gap-2 items-start">
        <Button
          disabled={isPending || !body.trim()}
          onClick={() => {
            setMessage(null);
            setError(null);

            startTransition(async () => {
              const response = await fetch(`/api/reports/${reportId}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ body }),
              });
              const payload = await response.json();

              if (!response.ok) {
                setError(payload.message ?? "Failed to add comment.");
                return;
              }

              setBody("");
              setMessage("Comment saved.");
              router.refresh();
            });
          }}
          className="gap-2"
        >
          <Send className="h-4 w-4" />
          {isPending ? "Saving..." : "Add Comment"}
        </Button>
        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
        {message && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
