import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { host, verifiedMembers, user } from "@/server/db/schema";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";

export const hostRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
        const genCode = nanoid(6)
      await ctx.db.insert(host).values({
        name: input.name,
        uniqueCode: genCode,
      });
      return genCode
    }),
  verifyUserWithHost: publicProcedure
    .input(
      z.object({ userId: z.string().min(1), uniqueCode: z.string().length(6) }),
    )
    .mutation(async ({ ctx, input }) => {
      const hostId = await ctx.db
        .select({
          id: host.id,
        })
        .from(host)
        .where(eq(host.uniqueCode, input.uniqueCode))
        .limit(1);
        if (hostId.length === 0 || !hostId[0]?.id) {
            throw new Error("This code does not exist");
          }
    
          await ctx.db.insert(verifiedMembers).values({
            userId: input.userId,
            hostId: hostId[0].id, 
          });
          await ctx.db.update(user).set({
            isVerified: true
          }).where(eq(user.id, input.userId));
    }),
});
