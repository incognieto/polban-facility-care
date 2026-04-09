import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { POLBAN_DOMAIN } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { isDatabaseUnavailableError, getDatabaseErrorMessage, withDatabaseTimeout } from "@/lib/db";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  role: z.enum(["USER", "ADMIN", "TESTER", "MANAGER"]).default("USER"),
});

export async function POST(request: Request) {
  try {
    const payload = signupSchema.parse(await request.json());

    // Validate email domain
    if (!payload.email.endsWith(POLBAN_DOMAIN)) {
      return NextResponse.json(
        { message: "Only @polban.ac.id email accounts can sign up." },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(payload.password, 10);

    // Create user
    const user = await withDatabaseTimeout(
      prisma.user.create({
        data: {
          email: payload.email.toLowerCase(),
          name: payload.name,
          passwordHash,
          role: payload.role,
        },
      })
    );

    return NextResponse.json({
      ok: true,
      message: "Account created successfully. Please sign in.",
    });
  } catch (error: any) {
    // Handle unique constraint violation (email already exists)
    if (error?.code === "P2002") {
      return NextResponse.json(
        { message: "Email already registered." },
        { status: 400 }
      );
    }

    if (isDatabaseUnavailableError(error)) {
      return NextResponse.json(
        { message: getDatabaseErrorMessage(error) },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { message: "Sign up failed. Please try again." },
      { status: 500 }
    );
  }
}
