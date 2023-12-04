import * as z from "zod"

export type Schema = {
  name: string,
  description: string,
  type: "string" | "number" | "boolean" | "array" | "object",
  enum?: string[],
  properties?: Schema[],
  items?: Omit<Schema, "name" | "description">,
}

export const schema: z.ZodType<Schema> = z.object({
  name: z.string(),
  description: z.string(),
  type: z.union([z.literal("string"), z.literal("number"), z.literal("boolean"), z.literal("array"), z.literal("object")]),
  enum: z.array(z.string()).optional(),
  properties: z.array(z.lazy(() => schema)).optional(),
  items: z.lazy(() => schema).optional(),
})

export const formSchema = z.object({
  functions: z.array(schema),
})

