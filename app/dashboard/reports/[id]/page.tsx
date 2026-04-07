import Image from "next/image";
import { notFound } from "next/navigation";
import { CommentForm } from "@/components/comment-form";
import { DatabaseAlert } from "@/components/database-alert";
import { StatusManager } from "@/components/status-manager";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireSession } from "@/lib/auth";
import { getDatabaseErrorMessage } from "@/lib/db";
import { getReportById } from "@/lib/reports";
import { formatDate, formatStatusLabel } from "@/lib/utils";

function getBadgeVariant(status: string) {
  if (status === "OPEN") return "open";
  if (status === "IN_PROGRESS") return "progress";
  return "resolved";
}

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireSession();
  const { id } = await params;

  try {
    const report = await getReportById(id);

    if (!report) {
      notFound();
    }

    return (
      <main className="container space-y-4 sm:space-y-6 py-4 sm:py-6 px-4 sm:px-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>{report.title}</CardTitle>
                <CardDescription>
                  Dilaporkan oleh {report.author.name} pada {formatDate(report.createdAt)}
                </CardDescription>
              </div>
              <Badge variant={getBadgeVariant(report.status)}>{formatStatusLabel(report.status)}</Badge>
            </div>
          </CardHeader>
        <CardContent className="grid gap-4 sm:gap-6 lg:grid-cols-[1fr_0.95fr]">
            <div className="space-y-4">
              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border bg-muted/30 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Category</p>
                  <p className="mt-2 font-semibold">{report.category}</p>
                </div>
                <div className="rounded-2xl border bg-muted/30 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Location</p>
                  <p className="mt-2 font-semibold">{report.location}</p>
                </div>
              </div>
              <div className="rounded-2xl border bg-card p-4">
                <p className="text-sm text-muted-foreground">{report.description}</p>
              </div>
              <div className="overflow-hidden rounded-3xl border">
                <Image
                  src={report.imageUrl}
                  alt={report.title}
                  width={1200}
                  height={900}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-4">
              {session.role === "ADMIN" ? (
                <StatusManager reportId={report.id} currentStatus={report.status} />
              ) : null}
              <Card>
                <CardHeader>
                  <CardTitle>Comments</CardTitle>
                  <CardDescription>
                    Communication history between reporter, admin, and tester.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CommentForm reportId={report.id} />
                  <div className="space-y-3">
                    {report.comments.map((comment) => (
                      <div key={comment.id} className="rounded-2xl border bg-muted/30 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-medium">
                            {comment.author.name} <span className="text-xs text-muted-foreground">({comment.author.role})</span>
                          </p>
                          <p className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</p>
                        </div>
                        <p className="mt-2 text-sm text-foreground/70">{comment.body}</p>
                      </div>
                    ))}
                    {report.comments.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No comments yet.</p>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  } catch (error) {
    return (
      <main className="container py-6">
        <DatabaseAlert message={getDatabaseErrorMessage(error)} />
      </main>
    );
  }
}
