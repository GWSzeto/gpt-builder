import { TRPCError } from "@trpc/server";
import { z } from "zod";
import type { FileObject } from "openai/resources/files.mjs";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

interface CursorPageFile {
  object: "list";
  data: FileObject[];
  first_id?: string;
  last_id?: string;
  has_more: boolean;
}

export const file = createTRPCRouter({

  list: publicProcedure
    .input(z.object({ fileIds: z.array(z.string()) }))
    .query(async ({ input, ctx }) => {
      const { fileIds } = input;
      // There isn't an official method from the OpenAI API to list specific files
      // but there is a method via curl
      const queryParams = fileIds.map((fileId) => `ids[]=${fileId}`).join("&");
      const res = await fetch(`https://api.openai.com/v1/files?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${ctx.openai.apiKey}`,
        },
      })

      if (res.ok) {
        const data = (await res.json()) as CursorPageFile;

        return data 
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to list files",
        })
      }
    }),

  fetch: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return "asd";
    }),

  create: publicProcedure
    .input(z.object({ assistantId: z.string(), fileId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { assistantId, fileId } = input;
      const data = await ctx.openai.beta.assistants.files.create(
        assistantId, 
        { file_id: fileId }
      );

      return data;
    }),

  update: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ input }) => {
      return "asd";
    }),
  
  delete: publicProcedure
    .input(z.object({ assistantId: z.string(), fileId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { assistantId, fileId } = input;

      const data = await ctx.openai.beta.assistants.files.del(
        assistantId,
        fileId,
      );

      return data;
    }),
 
});
