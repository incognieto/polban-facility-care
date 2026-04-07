import { DatabaseAlert } from "@/components/database-alert";
import { MetricCard } from "@/components/metric-card";
import { ReportForm } from "@/components/report-form";
import { ReportTable } from "@/components/report-table";
import { SiteHeaderWrapper } from "@/components/site-header-wrapper";
import { requireSession } from "@/lib/auth";
import { getDatabaseErrorMessage } from "@/lib/db";
import { getDashboardData } from "@/lib/reports";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const session = await requireSession();
  const { search } = await searchParams;

  try {
    const data = await getDashboardData(search);

    return (
      <main className="container space-y-4 sm:space-y-6 py-4 sm:py-6 px-4 sm:px-6">
        <SiteHeaderWrapper session={session} search={search} />

        <section className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Total Reports" value={data.metrics.totalReports} helper="All recorded facility issues." />
          <MetricCard label="Open" value={data.metrics.openCount} helper="New reports not yet addressed." />
          <MetricCard label="In Progress" value={data.metrics.progressCount} helper="Ongoing field work." />
          <MetricCard label="Resolved" value={data.metrics.resolvedCount} helper="Cases completed." />
        </section>

        <section className="grid gap-4 sm:gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          {session.role === "USER" || session.name === "Zaenal" ? (
            <ReportForm />
          ) : null}
          <ReportTable reports={data.reports} />
        </section>
      </main>
    );
  } catch (error) {
    return (
      <main className="container space-y-6 py-6">
        <SiteHeaderWrapper session={session} search={search} />
        <DatabaseAlert message={getDatabaseErrorMessage(error)} />
      </main>
    );
  }
}
