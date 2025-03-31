"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Wallet } from "lucide-react";
import { useSDK, MetaMaskProvider } from "@metamask/sdk-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

const formatAddress = (address: string | undefined) => {
  if (!address) return "";
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

import Tiktrlogo from "@/assets/tiktrlogo.png"
import Image from "next/image";

export const ConnectWalletButton = () => {
  const { sdk, connected, connecting, account } = useSDK();

  const connect = async () => {
    try {
      await sdk?.connect();
    } catch (err) {
      console.warn(`No accounts found`, err);
    }
  };

  const disconnect = async () => {
    if (sdk) {
      await sdk.terminate();
    }
  };
  return (
    <div className="relative">
      {connected ? (
        <Popover>
          <PopoverTrigger>
            <Button>{formatAddress(account)}</Button>
          </PopoverTrigger>
          <PopoverContent className="top-10 right-0 z-10 mt-2 w-44 rounded-md border bg-gray-100 shadow-lg">
            <Button onClick={disconnect}>Disconnect</Button>
          </PopoverContent>
        </Popover>
      ) : (
        <Button disabled={connecting} onClick={connect}>
          <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
        </Button>
      )}
    </div>
  );
};

const Topbar = () => {
  const host =
    typeof window !== "undefined" ? window.location.host : "defaultHost";
  const router = useRouter();

  const sdkOptions = {
    logging: { developerMode: false },
    checkInstallationImmediately: false,
    dappMetadata: {
      name: "Next-Metamask-Boilerplate",
      url: host, // using the host constant defined above
    },
  };

  return (
    <nav className="fixed top-0 right-0 left-0 m-4 flex justify-between">
      <span className="text-4xl font-bold"><Image src={Tiktrlogo} width={80} height={100} alt="Tiktr Logo"/></span>
      <div className="flex gap-4">
        <Button
          className="top-4 right-4"
          variant="outline"
          onClick={() => {
            router.push("/auth/sign-out");
          }}
        >
          Sign out
        </Button>
          <ConnectWalletButton />
      </div>
    </nav>
  );
};

export default Topbar;
