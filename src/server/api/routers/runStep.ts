import OpenAI from "openai";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const list = async (openai: OpenAI, threadId: string, runId: string) => {
  const data = await openai.beta.threads.runs.steps.list(threadId, runId)

  return data;
}

export const runStep = createTRPCRouter({

  list: publicProcedure
    .input(z.object({ threadId: z.string(), runId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { threadId, runId } = input

      const data = list(ctx.openai, threadId, runId)

      return data;
    }),

});
