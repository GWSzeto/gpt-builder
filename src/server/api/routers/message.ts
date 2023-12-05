import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const message = createTRPCRouter({

  fetch: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {}),

  list: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {}),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ input }) => {}),

  update: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ input }) => {}),

  

});
