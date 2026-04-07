import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="container flex min-h-screen flex-col items-center justify-center gap-4 py-10 text-center">
      <h1 className="text-3xl font-bold">Report Not Found</h1>
      <p className="max-w-md text-muted-foreground">
        The data you're looking for is not available or may have been deleted from the system.
      </p>
      <Button asChild>
        <Link href="/dashboard">Back to Dashboard</Link>
      </Button>
    </main>
  );
}
