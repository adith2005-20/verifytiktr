import Link from "next/link";
import { api, HydrateClient } from "@/trpc/server";
import { getSession } from "@/lib/auth"; // Better Auth instance
import VerificationCheck from "@/components/VerificationCheck";
import { Loader2 } from "lucide-react";

import Topbar from "@/components/Topbar";
import { Suspense } from "react";
import SendToAuthPage from "@/components/SendToAuthPage";

export default async function Home() {
  const session = await getSession();

  

  const userId = session?.user?.id ?? "";
  const isVerified = session?.user?.isVerified ?? false;

  // Fetch tRPCs here (prefetch)
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
        <Suspense fallback={<div><Loader2 className="animate-spin" /></div>}>
          {userId ? (
            <><VerificationCheck userId={userId} isVerified={isVerified} /><Topbar /></>
          ) : (
            <div><SendToAuthPage/></div>
          )}
        </Suspense>
      </main>
    </HydrateClient>
  );
}
