import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { event, verifiedGuards, user, eventGoer } from "@/server/db/schema";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { protectedProcedure } from "@/server/api/trpc";

export const eventRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
        const genCode = nanoid(6)
      await ctx.db.insert(event).values({
        name: input.name,
        uniqueCode: genCode,
        ownerId: ctx.session.user.id
      });
      return genCode
    }),
  verifyUserWithEvent: protectedProcedure
    .input(
      z.object({ userId: z.string().min(1), uniqueCode: z.string().length(6) }),
    )
    .mutation(async ({ ctx, input }) => {
      const eventId = await ctx.db
        .select({
          id: event.id,
        })
        .from(event)
        .where(eq(event.uniqueCode, input.uniqueCode))
        .limit(1);
        if (eventId.length === 0 || !eventId[0]?.id) {
            throw new Error("This code does not exist");
          }
    
          await ctx.db.insert(verifiedGuards).values({
            userId: input.userId,
            eventId: eventId[0].id, 
          });
          await ctx.db.update(user).set({
            isVerified: true
          }).where(eq(user.id, input.userId));
    }),
    addEventGoer: protectedProcedure
    .input(
      z.object({
        eventId: z.number().min(1), // Event ID from frontend
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Use current user as the verifying guard
      const guardId = ctx.session.user.id;

      // Insert event goer record
      await ctx.db.insert(eventGoer).values({
        guardId: guardId,
        eventId: input.eventId,
      });

      return { message: "Event goer added successfully" };
    }),

  // ✅ Get All Event Goers for an Event (Basic Analytics)
  getEventGoers: protectedProcedure
    .input(
      z.object({
        eventId: z.number().min(1) // Provide eventId from frontend
      })
    )
    .query(async ({ ctx, input }) => {
      const eventGoers = await ctx.db
        .select({
          id: eventGoer.id,
          eventId: eventGoer.eventId,
          guardId: eventGoer.guardId,
          enteredAt: eventGoer.enteredAt,
          guardName: user.name,
          guardEmail: user.email
        })
        .from(eventGoer)
        .innerJoin(user, eq(eventGoer.guardId, user.id))  // Join with user to get guard info
        .where(eq(eventGoer.eventId, input.eventId));

      return eventGoers;
    }),
    getEventIdLinkedToGuard: protectedProcedure
    .query(async ({ ctx }) => {
      const guardId = ctx.session.user.id;

      const events = await ctx.db
        .select({
          eventId: verifiedGuards.eventId,
          eventName: event.name,
          uniqueCode: event.uniqueCode,
          createdAt: event.createdAt
        })
        .from(verifiedGuards)
        .innerJoin(event, eq(verifiedGuards.eventId, event.id))
        .where(eq(verifiedGuards.userId, guardId));

      return events;
    }),
});
