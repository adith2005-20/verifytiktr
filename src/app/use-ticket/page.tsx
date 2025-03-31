import BurnTicket from "@/components/BurnTicket";
import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";

const Page = () => {
  return (
    <Suspense
      fallback={
        <div>
          <Loader2 className="animate-spin" />
        </div>
      }
    >
      <div>
        <BurnTicket />
      </div>
    </Suspense>
  );
};

export default Page;
