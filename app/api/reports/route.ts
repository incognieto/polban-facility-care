import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSession } from "@/lib/auth";
import { REPORT_CATEGORIES, REPORT_LOCATIONS } from "@/lib/constants";
import { getDatabaseErrorMessage, isDatabaseUnavailableError, withDatabaseTimeout } from "@/lib/db";
import { prisma } from "@/lib/prisma";

const reportSchema = z.object({
  title: z.string().min(3),
  category: z.enum(REPORT_CATEGORIES),
  location: z.enum(REPORT_LOCATIONS),
  description: z.string().min(10),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? undefined;

  try {
    const reports = await withDatabaseTimeout(
      prisma.report.findMany({
        where: search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { category: { contains: search, mode: "insensitive" } },
                { location: { contains: search, mode: "insensitive" } },
              ],
            }
          : undefined,
        include: { author: { select: { name: true, email: true } }, comments: true },
        orderBy: { createdAt: "desc" },
      }),
    );

    return NextResponse.json({ reports });
  } catch (error) {
    return NextResponse.json(
      { message: getDatabaseErrorMessage(error) },
      { status: isDatabaseUnavailableError(error) ? 503 : 500 },
    );
  }
}

export async function POST(request: Request) {
  const session = await requireSession();

  try {
    const formData = await request.formData();
    const title = formData.get("title");
    const category = formData.get("category");
    const location = formData.get("location");
    const description = formData.get("description");
    const image = formData.get("image");

    const parsed = reportSchema.parse({ title, category, location, description });

    if (!(image instanceof File) || image.size === 0) {
      return NextResponse.json({ message: "Image upload is required." }, { status: 400 });
    }

    const bytes = Buffer.from(await image.arrayBuffer());
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });
    const safeName = `${Date.now()}-${image.name.replace(/\s+/g, "-")}`;
    await writeFile(path.join(uploadsDir, safeName), bytes);

    const report = await withDatabaseTimeout(
      prisma.report.create({
        data: {
          ...parsed,
          imageUrl: `/uploads/${safeName}`,
          authorId: session.sub,
        },
      }),
    );

    return NextResponse.json({ report }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: getDatabaseErrorMessage(error) },
      { status: isDatabaseUnavailableError(error) ? 503 : 400 },
    );
  }
}
