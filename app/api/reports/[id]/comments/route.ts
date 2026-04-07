import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSession } from "@/lib/auth";
import { getDatabaseErrorMessage, isDatabaseUnavailableError, withDatabaseTimeout } from "@/lib/db";
import { prisma } from "@/lib/prisma";

const commentSchema = z.object({
  body: z.string().min(2),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession();

  try {
    const { id } = await params;
    const payload = commentSchema.parse(await request.json());

    const comment = await withDatabaseTimeout(
      prisma.comment.create({
        data: {
          body: payload.body,
          reportId: id,
          authorId: session.sub,
        },
      }),
    );

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: getDatabaseErrorMessage(error) },
      { status: isDatabaseUnavailableError(error) ? 503 : 400 },
    );
  }
}
