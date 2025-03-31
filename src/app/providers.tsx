"use client"
 
import { AuthUIProvider } from "@daveyplate/better-auth-ui"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MetaMaskProvider } from "@metamask/sdk-react"
import type { ReactNode } from "react"
 
import { authClient } from "@/lib/auth-client"
 

const sdkOptions = {
    logging: { developerMode: false },
    checkInstallationImmediately: false,
    dappMetadata: {
      name: "Tiktr admin console",
      url: typeof window !== "undefined" ? window.location.host : "defaultHost",
    },
  };

export function Providers({ children }: { children: ReactNode }) {
    const router = useRouter()
 
    return (
        <MetaMaskProvider sdkOptions={sdkOptions}>
        <AuthUIProvider
            authClient={authClient}
            navigate={(url)=>router.push(url)}
            replace={(url)=>router.replace(url)}
            onSessionChange={() => {
                // Clear router cache (protected routes)
                router.refresh()
            }}
            LinkComponent={Link}
        >
            {children}
        </AuthUIProvider>
        </MetaMaskProvider>
    )
}