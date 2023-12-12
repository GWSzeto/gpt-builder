import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import * as run from "./run";
import * as runSteps from "./runStep";

export const thread = createTRPCRouter({

  createAndRun: publicProcedure
    .input(z.object({ assistantId: z.string().min(1), message: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { assistantId, message } = input

      const { id: runId, thread_id: threadId } = await ctx.openai.beta.threads.createAndRun({
        assistant_id: assistantId,
        thread: {
          messages: [{ content: message, role: "user", /*fileIds: fileId*/ }]
        }
      })

      await new Promise<void>((resolve) => setInterval(() => {
        run.fetch(ctx.openai, threadId, runId).then(({ status }) => {
          if (status === "completed") resolve()
        })
      }, 1000))
      
      const data = await runSteps.list(ctx.openai, threadId, runId)

      return { threadId, runSteps: data }
    }),

});
