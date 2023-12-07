import { z } from "zod";
import OpenAI from "openai";

import * as run from "./run";
import * as runSteps from "./runStep";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const fetch = async (openai: OpenAI, thread_id: string, message_id: string) => {
  const data = await openai.beta.threads.messages.retrieve(thread_id, message_id)

  return data
}

export const message = createTRPCRouter({

  fetch: publicProcedure
    .input(z.object({ threadId: z.string(), messageId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { threadId, messageId } = input
      const data = await fetch(ctx.openai, threadId, messageId)

      return data
    }),

  list: publicProcedure
    .input(z.object({ runId: z.string(), after: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const { runId, after } = input
      const data = await ctx.openai.beta.threads.messages.list(runId, {
        limit: 100,
        after,
      })

      return data
    }),

  create: publicProcedure
    .input(z.object({
      threadId: z.string(),
      assistantId: z.string(),
      message: z.string().min(1),
      fileIds: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { threadId, assistantId, message, fileIds } = input

      await ctx.openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: message,
        file_ids: fileIds,
      })

      const { id: runId } = await run.create(ctx.openai, threadId, assistantId)

      await new Promise<void>((resolve) => setInterval(() => {
        run.fetch(ctx.openai, threadId, runId).then(({ status }) => {
          if (status === "completed") resolve()
        })
      }, 1000))
      
      const data = await runSteps.list(ctx.openai, threadId, runId)

      return data
    }),
  
  // TODO: think about how to implement these 2
  // Should it wipe the history similar to the native GPT
  // Or should it do something else?
  update: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ input }) => {}),

  delete: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ input }) => {}),

});

