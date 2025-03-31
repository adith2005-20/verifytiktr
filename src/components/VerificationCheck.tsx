"use client";
import React, {useState} from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { InputOTP, InputOTPSlot, InputOTPGroup } from "./ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import { toast } from "sonner";
import { api } from "@/trpc/react";


const VerificationCheck = ({ userId, isVerified }: { userId: string; isVerified: boolean }) => {
  const router = useRouter();
  const [uniqueCode, setUniqueCode] = useState('')
  
  if (isVerified == null) {
    router.push("/auth/sign-in");
  }
  if (isVerified) {
    router.push("/dashboard");
  }

  const verify = api.event.verifyUserWithEvent.useMutation({
    onSuccess: () => {
        toast.success("yay you are verified")
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleClick = () => {
    verify.mutate({
      userId: userId,
      uniqueCode: uniqueCode
    })
  }

  if (uniqueCode.length===6){
    handleClick();
    setUniqueCode("")
  }

  return (
    <div className="flex justify-center items-center min-h-screen"> {/* Center the card */}
      <Card className="w-full max-w-md"> {/* Set max width to avoid stretching */}
        <CardHeader>
          <CardTitle>Verification</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center"> {/* Center content */}
          <CardDescription className=" mb-4">
            Verify your account by entering the code sent by your team lead
          </CardDescription>
          <InputOTP maxLength={6} onChange={(e)=>setUniqueCode(e)}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationCheck;
