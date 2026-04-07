import { AlertTriangle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DatabaseAlert({ message }: { message: string }) {
  return (
    <Card className="border-destructive/40 bg-gradient-to-r from-destructive/5 to-destructive/10 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-destructive">
          <div className="rounded-full bg-destructive/20 p-2">
            <XCircle className="h-5 w-5" />
          </div>
          <span>Database Unavailable</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm font-medium text-destructive">⚠️ Warning!</p>
          <p className="text-sm text-destructive/90 leading-relaxed">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
}
