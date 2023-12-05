import { z } from "zod";
import { call } from "../openai";
import queryString from "query-string";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const assistant = createTRPCRouter({

  list: publicProcedure
    .input(z.object({ after: z.string().optional() }))
    .query(async ({ input, ctx }) => {
      const data = await call({
        url: `https://api.openai.com/v1/assistants?${queryString.stringify(input)}`,
        apiKey: ctx.apiKey,
      });

      return data
    }),

  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const { id } = input;

      const data = await call({
        url: `https://api.openai.com/v1/assistants/${id}`,
        apiKey: ctx.apiKey,
      });

      return data
    }),

  create: publicProcedure
    .mutation(async ({ ctx }) => {
      const data = await call({
        url: "https://api.openai.com/v1/assistants",
        apiKey: ctx.apiKey,
        body: {
          model: "gpt-4-1106-preview",
        }
      });

      return data
    }),

  update: publicProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1).optional(),
      description: z.string().min(1).optional(),
      instructions: z.string().min(1).optional(),
      tools: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { id, ...params } = input;
      
      // separate route will be responsible for updateing functions
      const tools = params.tools?.map((tool) => ({ type: tool }))

      const data = await call({
        method: "POST",
        url: `https://api.openai.com/v1/assistants/${id}`,
        apiKey: ctx.apiKey,
        body: {
          ...params,
          tools,
          model: "gpt-4-1106-preview",
        }
      });

      return data
    }), 
  
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;

      const data = await call({
        method: "DELETE",
        url: `https://api.openai.com/v1/assistants/${id}`, 
        apiKey: ctx.apiKey,
      });

      return data
    }),

});
