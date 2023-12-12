import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const assistant = createTRPCRouter({

  list: publicProcedure
    .input(z.object({ after: z.string().optional() }))
    .query(async ({ ctx }) => {
      const data = await ctx.openai.beta.assistants.list()

      return data
    }),

  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const data = await ctx.openai.beta.assistants.retrieve(input.id)

      return data
    }),

  create: publicProcedure
    .input(z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      instructions: z.string().optional(),
      tools: z.array(z.union([z.literal("code_interpreter"), z.literal("retrieval")])).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const data = await ctx.openai.beta.assistants.create({
        ...input,
        tools: input.tools?.map(tool => ({ type: tool })),
        model: "gpt-4-1106-preview",
      })

      return data
    }),

  update: publicProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1).optional(),
      description: z.string().min(1).optional(),
      instructions: z.string().min(1).optional(),
      tools: z.array(z.union([z.literal("code_interpreter"), z.literal("retrieval")])).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { id, ...body } = input
      const data = await ctx.openai.beta.assistants.update(input.id, {
        ...body,
        tools: input.tools?.map(tool => ({ type: tool })),
      })

      return data
    }),
  
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.openai.beta.assistants.del(input.id)

      return data
    }),

});
