import * as z from "zod"

export type Schema = {
  name: string,
  description?: string,
  type: "string" | "number" | "boolean" | "array" | "object",
  enum?: string[],
  properties?: Schema[],
  items?: Omit<Schema, "name" | "description">,
}

// @ts-expect-error zod and typescript don't play nice with recursive types
export const schema: z.ZodType<Schema> = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  type: z.union([z.literal("string"), z.literal("number"), z.literal("boolean"), z.literal("array"), z.literal("object")]),
  enum: z.array(z.string()).optional(),
  properties: z.lazy(() => schema.array().optional()),
  // @ts-expect-error zod and typescript don't play nice with recursive types
  items: z.lazy(() => (schema as z.ZodObject<Schema>).omit({ name: true, description: true }).optional())
})

export const formSchema = z.object({
  type: z.literal("function"),
  function: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    parameters: z.array(schema),
  })
})

const formSchemaKeyPath = z.string().regex(/^(functions)((\.[0-9]+)(\.(properties|items)))*/)

export const parseFunctionParameters = (data: Schema[]) => {
  const parseItem = (item: Omit<Schema, "name" | "description">): Record<string, unknown> => {
    if (item.type === "object") {
      return {
        ...item,
        properties: parseFunctionParameters(item.properties!)
      }
    }
    if (item.type === "array") { 
      return {
        ...item,
        items: parseItem(item.items!)
      }
    }

    return item;
  }

  return data.reduce((acc, item) => {
    const { name, description, ...baseData } = item
    return {
      ...acc,
      [name]: {
        description,
        ...parseItem(baseData),
      }
    }
  }, {} as Record<string, unknown>)
}

