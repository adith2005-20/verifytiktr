"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { connectWallet, getContractInstance } from "@/lib/blockchain";
import Topbar from "./Topbar";
import { Button } from "./ui/button";
import { ArrowLeft, Loader2, Ticket } from "lucide-react";
import { api } from "@/trpc/react";

// ✅ Explicitly define the contract type to avoid `any` issues
interface Contract {
  burnTicketByGuard?: (tokenId: string) => Promise<{ wait: () => Promise<void> }>;
  useTicket?: (tokenId: string) => Promise<{ wait: () => Promise<void> }>;
}

const BurnTicket: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tokenId = searchParams?.get("tokenId") ?? "";
  const eventId = searchParams?.get("eventId") ?? "";
  const burnType = searchParams?.get("burnType") ?? "";

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Always call hooks in the same order
  const { data: actualDBEvent, isLoading } = api.event.getEventIdLinkedToGuard.useQuery();
  const addEventGoer = api.event.addEventGoer.useMutation();

  // ✅ Use nullish coalescing operator (`??`) for safer checks
  const actualDBEventId = actualDBEvent?.[0]?.eventId ?? null;

  // ✅ Handle missing parameters or no linked event safely
  useEffect(() => {
    if (!tokenId || !eventId) {
      setMessage("Missing ticket information in URL. Might be an invalid ticket.");
    } else if (!actualDBEventId) {
      setMessage("No event linked to this guard.");
    } else if (eventId !== actualDBEventId.toString()) {
      setMessage("This ticket does not belong to the current guard's event.");
    }
  }, [tokenId, eventId, actualDBEventId]);

  const handleBurnTicket = async () => {
    if (!tokenId) {
      toast.error("Missing ticket ID.");
      return;
    }

    if (!actualDBEventId || eventId !== actualDBEventId.toString()) {
      toast.error("Unauthorized: You are not linked to this event.");
      return;
    }

    setLoading(true);

    try {
      const signer = await connectWallet();
      const contract = getContractInstance(signer) as Contract;

      let tx;

      if (burnType === "guard") {
        if (!contract.burnTicketByGuard) {
          throw new Error("Contract method not found");
        }
        tx = await contract.burnTicketByGuard(tokenId);
      } else {
        if (!contract.useTicket) {
          throw new Error("Contract method not found");
        }
        tx = await contract.useTicket(tokenId);
      }

      await tx.wait();
      toast.success("Ticket verified and burned successfully!");
      setMessage("Ticket burned successfully!");

      // ✅ Add eventGoer mutation
      addEventGoer.mutate(
        { eventId: actualDBEventId },
        {
          onSuccess: () => {
            toast.success("Eventgoer added to DB.");
          },
          onError: () => {
            toast.error("Failed to add eventgoer to DB. Contact Support.");
          }
        }
      );

    } catch (error) {
      console.error("Error verifying ticket:", error);
      const errorMessage = (error as Error).message ?? "Transaction failed";
      toast.error(`Error: ${errorMessage}`);
      setMessage("Failed to burn ticket.");
    }

    setLoading(false);
  };

  // ✅ Conditionally render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-10 h-10" />
      </div>
    );
  }

  console.log(actualDBEventId);

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center p-4">
      <Topbar />
      <h1 className="text-4xl">Ticket Verification</h1>
      <p className="pb-4">{message}</p>
      <Button onClick={handleBurnTicket} disabled={loading || !actualDBEventId}>
        <Ticket />
        {loading ? "Verifying..." : "Verify and Burn"}
      </Button>
      <Button variant={"outline"} onClick={() => router.back()}>
        <ArrowLeft /> Go Back
      </Button>
    </div>
  );
};

export default BurnTicket;
