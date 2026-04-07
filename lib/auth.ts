import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { POLBAN_DOMAIN } from "@/lib/constants";
import { getDatabaseErrorMessage, isDatabaseUnavailableError, withDatabaseTimeout } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { createSessionCookie, getSession } from "@/lib/session";

export async function authenticateUser(email: string, password: string) {
  if (!email.endsWith(POLBAN_DOMAIN)) {
    return {
      ok: false,
      message: "Only @polban.ac.id email accounts can sign in.",
      status: 401,
    };
  }

  try {
    const user = await withDatabaseTimeout(
      prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      }),
    );

    if (!user) {
      return { ok: false, message: "User not found.", status: 401 };
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      return { ok: false, message: "Incorrect password.", status: 401 };
    }

    await createSessionCookie({
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return { ok: true as const, role: user.role, status: 200 };
  } catch (error) {
    return {
      ok: false,
      message: isDatabaseUnavailableError(error)
        ? getDatabaseErrorMessage(error)
        : "Authentication failed.",
      status: isDatabaseUnavailableError(error) ? 503 : 500,
    };
  }
}

export async function requireSession() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function requireRole(roles: Array<"USER" | "ADMIN" | "TESTER" | "MANAGER">) {
  const session = await requireSession();

  if (!roles.includes(session.role)) {
    redirect("/dashboard");
  }

  return session;
}
