import Link from "next/link";
import { ReportStatus } from "@prisma/client";
import { AlertCircle, FileText, MapPin, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate, formatStatusLabel } from "@/lib/utils";

type ReportRow = {
  id: string;
  title: string;
  category: string;
  location: string;
  status: ReportStatus;
  createdAt: Date;
  author: {
    name: string;
    email: string;
  };
  comments: Array<{ id: string }>;
};

function getBadgeVariant(status: ReportStatus) {
  if (status === "OPEN") return "open";
  if (status === "IN_PROGRESS") return "progress";
  return "resolved";
}

function getStatusIcon(status: ReportStatus) {
  if (status === "OPEN") return <AlertCircle className="h-4 w-4" />;
  if (status === "IN_PROGRESS") return <FileText className="h-4 w-4" />;
  return null;
}

export function ReportTable({
  reports,
  title = "Report Summary",
  description = "View all facility reports and their current status.",
}: {
  reports: ReportRow[];
  title?: string;
  description?: string;
}) {
  return (
    <Card className="border-0 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent pb-4">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/20 p-3">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle>{title}</CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 sm:pt-6">
        <div className="rounded-lg border border-primary/10 overflow-x-auto -mx-4 sm:mx-0 sm:rounded-lg">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="border-primary/10 text-xs sm:text-sm">
                <TableHead className="font-semibold whitespace-nowrap">Title</TableHead>
                <TableHead className="font-semibold whitespace-nowrap hidden md:table-cell">Category</TableHead>
                <TableHead className="font-semibold whitespace-nowrap hidden lg:table-cell">Location</TableHead>
                <TableHead className="font-semibold whitespace-nowrap hidden lg:table-cell">Reporter</TableHead>
                <TableHead className="font-semibold whitespace-nowrap">Status</TableHead>
                <TableHead className="text-center font-semibold whitespace-nowrap hidden sm:table-cell">Updates</TableHead>
                <TableHead className="font-semibold whitespace-nowrap hidden sm:table-cell">Created</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report, idx) => (
                <TableRow 
                  key={report.id}
                  className="border-primary/10 hover:bg-primary/5 transition-colors"
                >
                  <TableCell className="font-semibold">
                    <Link href={`/dashboard/reports/${report.id}`} className="text-primary hover:underline flex items-center gap-2">
                      <FileText className="h-4 w-4 flex-shrink-0" />
                      {report.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm">{report.category}</TableCell>
                  <TableCell className="text-sm flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    {report.location}
                  </TableCell>
                  <TableCell className="text-sm">{report.author.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(report.status) && (
                        <span className="text-muted-foreground">
                          {getStatusIcon(report.status)}
                        </span>
                      )}
                      <Badge variant={getBadgeVariant(report.status)}>
                        {formatStatusLabel(report.status)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {report.comments.length}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(report.createdAt)}</TableCell>
                  <TableCell>
                    <Link href={`/dashboard/reports/${report.id}`}>
                      <ChevronRight className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
