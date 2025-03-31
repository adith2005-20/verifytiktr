"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check, Smartphone, Wallet, QrCode, Globe } from "lucide-react";
import Topbar from "@/components/Topbar";

const Page: React.FC = () => {
  const [step, setStep] = useState<number>(0);

  const steps = [
    {
      title: "Install MetaMask",
      icon: <Smartphone className="w-5 h-5" />,
      description: "Download MetaMask from the App Store or Google Play Store."
    },
    {
      title: "Link Your Wallet",
      icon: <Wallet className="w-5 h-5" />,
      description: "Log in or create a wallet and connect it to MetaMask."
    },
    {
      title: "Visit verifytiktr.adith.me",
      icon: <Globe className="w-5 h-5" />,
      description: "Open the MetaMask browser and visit the site to log in."
    },
    {
      title: "Scan the Ticket QR",
      icon: <QrCode className="w-5 h-5" />,
      description: "Use the MetaMask app to scan the ticket's QR code for verification."
    },
  ] as const;

  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setStep((prev) => Math.min(prev + 1, steps.length - 1));

  return (
    <div className="flex justify-center items-center min-h-screen bg-background text-foreground">
      <Topbar />
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Ticket Scanning Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            {/* ✅ Safe rendering with optional chaining */}
            <div className="flex items-center space-x-4">
              {steps[step]?.icon ?? <Check className="w-5 h-5" />}
              <h2 className="text-xl font-semibold">{steps[step]?.title ?? "Unknown Step"}</h2>
            </div>
            <p className="text-center">{steps[step]?.description ?? "No description available."}</p>
          </div>

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={step === 0}
            >
              <ArrowLeft className="mr-2" /> Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={step === steps.length - 1}
            >
              {step === steps.length - 1 ? "Done" : "Next"}
              <ArrowRight className="ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
