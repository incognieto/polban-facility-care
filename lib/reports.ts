import { ReportStatus } from "@prisma/client";
import { withDatabaseTimeout } from "@/lib/db";
import { prisma } from "@/lib/prisma";

export async function getDashboardData(search?: string) {
  const where = search
    ? {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { location: { contains: search, mode: "insensitive" as const } },
          { category: { contains: search, mode: "insensitive" as const } },
          { author: { name: { contains: search, mode: "insensitive" as const } } },
        ],
      }
    : {};

  const [reports, totalReports, openCount, progressCount, resolvedCount] =
    await withDatabaseTimeout(
      Promise.all([
        prisma.report.findMany({
          where,
          include: {
            author: {
              select: { name: true, email: true },
            },
            comments: true,
          },
          orderBy: { createdAt: "desc" },
        }),
        prisma.report.count(),
        prisma.report.count({ where: { status: ReportStatus.OPEN } }),
        prisma.report.count({ where: { status: ReportStatus.IN_PROGRESS } }),
        prisma.report.count({ where: { status: ReportStatus.RESOLVED } }),
      ]),
    );

  return {
    reports,
    metrics: {
      totalReports,
      openCount,
      progressCount,
      resolvedCount,
    },
  };
}

export async function getReportById(id: string) {
  return withDatabaseTimeout(
    prisma.report.findUnique({
      where: { id },
      include: {
        author: {
          select: { name: true, email: true },
        },
        comments: {
          include: {
            author: {
              select: { name: true, role: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    }),
  );
}
