import { NextResponse } from "next/server";
import { z } from "zod";
import { authenticateUser } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  try {
    const payload = loginSchema.parse(await request.json());
    const result = await authenticateUser(payload.email, payload.password);

    if (!result.ok) {
      return NextResponse.json({ message: result.message }, { status: result.status });
    }

    return NextResponse.json({ ok: true, role: result.role });
  } catch {
    return NextResponse.json({ message: "Invalid login payload." }, { status: 400 });
  }
}
