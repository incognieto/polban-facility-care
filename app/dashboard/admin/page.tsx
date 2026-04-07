import { DatabaseAlert } from "@/components/database-alert";
import { ReportTable } from "@/components/report-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/auth";
import { getDatabaseErrorMessage } from "@/lib/db";
import { getDashboardData } from "@/lib/reports";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  await requireRole(["ADMIN"]);
  const { search } = await searchParams;

  try {
    const data = await getDashboardData(search);

    return (
      <main className="container space-y-4 sm:space-y-6 py-4 sm:py-6 px-4 sm:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Admin Management</CardTitle>
            <CardDescription>
              Manage all facility reports and update workflow status from this dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Use the table below to view report details and update status to Open, In Progress, or Resolved.
            </p>
          </CardContent>
        </Card>
        <form action="/dashboard/admin" className="rounded-3xl border bg-card/90 p-4 shadow-soft">
          <input
            name="search"
            defaultValue={search}
            placeholder="Filter reports by title, location, or category"
            className="h-11 w-full rounded-xl border bg-card px-4 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
          />
        </form>
        <ReportTable
          reports={data.reports}
          title=\"Admin Queue\"
          description=\"All recent reports with access to details and status management.\"
        />
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
