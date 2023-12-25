import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const file = createTRPCRouter({

  list: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return "asd";
    }),

  fetch: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return "asd";
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ input }) => {
      return "asd";
    }),

  update: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ input }) => {
      return "asd";
    }),
  
  delete: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(({ input }) => {
      return "asd";
    }),
 
});
