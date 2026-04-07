import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const image = formData.get("image");

  if (!(image instanceof File) || image.size === 0) {
    return NextResponse.json({ message: "No image uploaded." }, { status: 400 });
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  const fileName = `${Date.now()}-${image.name.replace(/\s+/g, "-")}`;
  await writeFile(path.join(uploadsDir, fileName), Buffer.from(await image.arrayBuffer()));

  return NextResponse.json({ url: `/uploads/${fileName}` });
}
