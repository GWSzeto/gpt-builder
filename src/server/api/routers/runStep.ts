import OpenAI from "openai";
import { z } from "zod";
import { MessageCreationStepDetails } from "openai/resources/beta/threads/runs/steps.mjs";
import * as message from "./message";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const list = async (openai: OpenAI, threadId: string, runId: string) => {
  // TODO: There will be a use case for pagination
  // implement that
  const { data, /*lastId*/ } = await openai.beta.threads.runs.steps.list(threadId, runId)
  const formattedData = await Promise.all(data.map(async step => {
    let assistantContent: string = "";
    if (step.type === "message_creation") {
      const { content: [messageData] } = await message.fetch(
        openai, 
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
  }));

  return formattedData;
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
