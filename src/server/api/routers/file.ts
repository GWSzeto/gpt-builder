import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const file = createTRPCRouter({

  list: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {}),

  fetch: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {}),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ input }) => {}),

  update: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ input }) => {}), 
  
  delete: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(({ input }) => {}), 
 
});
