import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    
    baseURL: "https://verifytiktr.adith.me"
})

export const { signIn , signOut, useSession } = createAuthClient()