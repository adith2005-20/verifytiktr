import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/server/db"; // your drizzle instance
import { headers } from "next/headers";

export const auth = betterAuth({
    emailAndPassword: {  
        enabled: true
    },
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
    }),
    user: {
        additionalFields:{
            isVerified: {
                type : "boolean",
                required: false,
                defaultValue: false
            }
        }
    }
});

export const getSession = async () => {
    return await auth.api.getSession({
        headers: await headers() // Call headers() inside the component
      });
  };