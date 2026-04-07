import { NextResponse } from "next/server";
import { ReportStatus } from "@prisma/client";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { getDatabaseErrorMessage, isDatabaseUnavailableError, withDatabaseTimeout } from "@/lib/db";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  status: z.nativeEnum(ReportStatus),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireRole(["ADMIN"]);

  try {
    const { id } = await params;
    const payload = updateSchema.parse(await request.json());

    const report = await withDatabaseTimeout(
      prisma.report.update({
        where: { id },
        data: { status: payload.status },
      }),
    );

    return NextResponse.json({ report });
  } catch (error) {
    return NextResponse.json(
      { message: getDatabaseErrorMessage(error) },
      { status: isDatabaseUnavailableError(error) ? 503 : 400 },
    );
  }
}
