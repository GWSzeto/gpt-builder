import * as z from "zod"

export type Schema = {
  name: string,
  description?: string,
  type: "string" | "number" | "boolean" | "array" | "object",
  enum?: string[],
  properties?: Schema[],
  items?: Omit<Schema, "name" | "description">,
}

export const schema: z.ZodType<Schema> = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  type: z.union([z.literal("string"), z.literal("number"), z.literal("boolean"), z.literal("array"), z.literal("object")]),
  enum: z.array(z.string()).optional(),
  properties: z.lazy(() => schema.array().optional()),
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
  const parseItem = (item: Omit<Schema, "name" | "description">): Omit<Schema, "name" | "description">=> {
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
  }, {} as Record<string, Omit<Schema, "name">>)
}



type ValidationSchema = {
  valid: boolean,
  error?: string,
}
// True if good, False if bad
export const schemaValidation = (data: z.infer<typeof formSchema> & { name: string; description?: string; }): ValidationSchema => {
  const { name, description, functions } = data;
  if (name.length === 0) return { valid: false, error: "Name cannot be empty" };

  return functions.reduce((acc, item) => {
    return validateFunctionParameters(item, true);
  }, {})
}

export const validateFunctionParameters = (item: Schema | Omit<Schema, "name" | "description">, isObj: boolean): ValidationSchema => {
  if (isObj && (item as Schema).name.length === 0) {
    return { valid: false, error: "Name cannot be empty" };
  }
  if (item.type === "object") {
    if (item.properties && item.properties.length != 0) {
      return item.properties.reduce((acc, _item) => {
        return acc && validateFunctionParameters(_item, true)
      }, true)
    } else {
      return false;
    }
  }
  if (item.type === "array") {
    return validateFunctionParameters(item.items!, false)
  }

  return true
}

