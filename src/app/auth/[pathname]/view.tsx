"use client"
 
import { AuthCard } from "@daveyplate/better-auth-ui"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
 
export function AuthView({
    pathname
}: {
    pathname: string
}) {
    const router = useRouter()
 
    useEffect(() => {
        // Clear router cache (protected routes)
        router.refresh()
    }, [router])
 
    return (
        <main className="flex flex-col grow p-4 items-center">
            <div/>
            <AuthCard pathname={pathname} className="mt-[10%]" />
        </main>
    )
}