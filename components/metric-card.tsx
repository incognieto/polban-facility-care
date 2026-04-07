import { TrendingUp, AlertCircle, Wrench, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const iconMap: Record<string, React.ReactNode> = {
  "Total Reports": <TrendingUp className="h-8 w-8 text-primary" />,
  "Open": <AlertCircle className="h-8 w-8 text-destructive" />,
  "In Progress": <Wrench className="h-8 w-8 text-accent" />,
  "Resolved": <CheckCircle2 className="h-8 w-8 text-green-600" />,
};

export function MetricCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: number;
  helper: string;
}) {
  const icon = iconMap[label];

  return (
    <Card className="relative overflow-hidden border-l-2 sm:border-l-4 border-l-primary hover:shadow-lg transition-shadow">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
      <CardHeader className="pb-2 sm:pb-3 relative">
        <div className="flex items-start justify-between gap-2 sm:gap-4">
          <div className="flex-1 min-w-0">
            <CardDescription className="text-xs font-medium uppercase tracking-wider">{label}</CardDescription>
            <CardTitle className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-2">{value}</CardTitle>
          </div>
          {icon && <div className="ml-2 sm:ml-4 flex-shrink-0">{icon}</div>}
        </div>
      </CardHeader>
      <CardContent className="relative pb-3 sm:pb-4">
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{helper}</p>
      </CardContent>
    </Card>
  );
}
