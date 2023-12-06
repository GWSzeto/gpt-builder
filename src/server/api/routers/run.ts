import type OpenAI from "openai";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const create = async (openai: OpenAI, thread_id: string, assistant_id: string) => {
  const data = await openai.beta.threads.runs.create(thread_id, {
    assistant_id
  })

  return data;
}

export const fetch = async (openai: OpenAI, thread_id: string, run_id: string) => {
  const data = await openai.beta.threads.runs.retrieve(thread_id, run_id)

  return data;
}

export const run = createTRPCRouter({

  create: publicProcedure
    .input(z.object({ threadId: z.string(), assistantId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { threadId, assistantId } = input
      const data = await create(ctx.openai, threadId, assistantId)

      return data
    }),

  fetch: publicProcedure
    .input(z.object({ threadId: z.string(), runId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { threadId, runId } = input

      const data = await fetch(ctx.openai, threadId, runId)

      return data;
    }),

});
