import { Prisma } from "@prisma/client";

export class DatabaseUnavailableError extends Error {
  constructor(message = "Database connection timed out or is unavailable.") {
    super(message);
    this.name = "DatabaseUnavailableError";
  }
}

export async function withDatabaseTimeout<T>(operation: Promise<T>, timeoutMs = 3500) {
  return Promise.race<T>([
    operation,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new DatabaseUnavailableError()), timeoutMs),
    ),
  ]);
}

export function isDatabaseUnavailableError(error: unknown) {
  if (error instanceof DatabaseUnavailableError) {
    return true;
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return true;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code === "P1001" || error.code === "P1002";
  }

  return false;
}

export function getDatabaseErrorMessage(error: unknown) {
  if (isDatabaseUnavailableError(error)) {
    return "Database connection timed out. Verify PostgreSQL 18.3 is running on localhost:5433 before retrying.";
  }

  return "An unexpected database error occurred.";
}
