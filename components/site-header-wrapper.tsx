"use client";

import { SiteHeader } from "@/components/site-header";
import type { SessionPayload } from "@/lib/session";

export function SiteHeaderWrapper({
  session,
  search,
}: {
  session: SessionPayload;
  search?: string;
}) {
  return <SiteHeader session={session} search={search} />;
}
