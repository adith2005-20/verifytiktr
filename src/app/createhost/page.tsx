"use client"
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { toast } from "sonner";

const Page = () => {
  const [hostName, setHostName] = useState("");
  const code = api.host.create.useMutation({
    onSuccess: (data) => {
      toast("Host org created your code is: " + data);
      setHostName("");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const handleClick = () => {
    code.mutate({ name: hostName });
  };
  return (
    <div className="flex h-screen flex-col flex-wrap items-center justify-center">
      <span className="mb-4 text-2xl font-bold">
        Create a new host organization
      </span>
      <Input
        placeholder="Host Name"
        className="w-full max-w-md"
        value={hostName}
        onChange={(e) => setHostName(e.target.value)}
      />
      <Button className="mx-4 my-2" onClick={handleClick}>
        Submit
      </Button>
    </div>
  );
};

export default Page;
