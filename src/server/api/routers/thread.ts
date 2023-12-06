import { z } from "zod";
import { MessageCreationStepDetails } from "openai/resources/beta/threads/runs/steps.mjs";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import * as message from "./message";
import * as run from "./run";
import * as runSteps from "./runStep";

export const thread = createTRPCRouter({

  createAndRun: publicProcedure
    .input(z.object({ assistantId: z.string().min(1), userMessage: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { assistantId, userMessage } = input

      const { id: runId, thread_id: threadId } = await ctx.openai.beta.threads.createAndRun({
        assistant_id: assistantId,
        thread: {
          messages: [{ content: userMessage, role: "user", /*fileIds: fileId*/ }]
        }
      })

      await new Promise<void>((resolve) => setInterval(() => {
        run.fetch(ctx.openai, threadId, runId).then(({ status }) => {
          if (status === "completed") resolve()
        })
      }, 1000))
      
      // TODO: There will be a use case for pagination
      // implement that
      const { data, /*last_id*/ } = await runSteps.list(ctx.openai, threadId, runId)
      const formattedData = data.map(async step => {
        let assistantContent: string = "";
        if (step.type === "message_creation") {
          const { content: [messageData] } = await message.fetch(
            ctx.openai, 
            threadId, 
            (step.step_details as MessageCreationStepDetails).message_creation.message_id
          );
          if (messageData?.type === "text") {
            assistantContent = messageData?.text?.value
          }
          if (messageData?.type === "image_file") {
            // TODO: implement image implemntation
            // Might think about just passing in the full content
            // and having the messages in the front end have more structure
            // more parsing, but might be nessecary to differentiate between images and text
          }
        }
        if (step.type === "tool_calls") {
          // TODO: implement function handling / tool calling
          // Look into submit tool output functionality and need FE to support it as well
        }

        return {
          id: step.id,
          type: step.type,
          content: assistantContent,
        }
      })

      return formattedData
    }),

});
