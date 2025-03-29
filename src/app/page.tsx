import Link from "next/link";
import { api, HydrateClient } from "@/trpc/server";
import { getSession } from "@/lib/auth"; // Better Auth instance
import VerificationCheck from "@/components/VerificationCheck";
import { Loader2 } from "lucide-react";

import Topbar from "@/components/Topbar";
import { Suspense } from "react";

export default async function Home() {
  const session = await getSession();

  console.log(session);

  const userId = session?.user?.id ?? "";
  const isVerified = session?.user?.isVerified ?? false;

  // Fetch tRPCs here (prefetch)
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
        <Topbar />
        <Suspense fallback={<div><Loader2 className="animate-spin" /></div>}>
          {userId ? (
            <VerificationCheck userId={userId} isVerified={isVerified} />
          ) : (
            <div>Loading...</div>
          )}
        </Suspense>
      </main>
    </HydrateClient>
  );
}
