'use client';

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, useFormContext } from "react-hook-form";
import * as z from "zod";

// components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  useFormField,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// icons
import {
  CaretLeftIcon,
  PlusCircledIcon,
  MinusCircledIcon,
} from "@radix-ui/react-icons";

type Schema = {
  name: string,
  description: string,
  type: "string" | "number" | "boolean" | "array" | "object",
  enum?: string[],
  properties?: Schema[],
  items?: Omit<Schema, "name" | "description">,
}

const schema: z.ZodType<Schema> = z.object({
  name: z.string(),
  description: z.string(),
  type: z.union([z.literal("string"), z.literal("number"), z.literal("boolean"), z.literal("array"), z.literal("object")]),
  enum: z.array(z.string()).optional(),
  properties: z.array(z.lazy(() => schema)).optional(),
  items: z.lazy(() => schema).optional(),
})

const formSchema = z.object({
  functions: z.array(schema),
})

type Keypath<T> = T extends { properties: Schema[] }
  ? { [K in keyof T['properties']]: `properties.${number}` | Keypath<T['properties'][K]> }[keyof T['properties']]
  : T extends { items: Omit<Schema, "name" | "description"> }
  ? `items.${number}` | Keypath<T['items']>
  : never;

type FormSchemaKeyPaths = Keypath<Schema>;

const asd: FormSchemaKeyPaths = "functions.0.name"
console.log("asd: ", asd);

const Obj = ({ parentName }: { parentName: FormSchemaKeyPaths }) => {
  const form = useFormContext<z.infer<typeof formSchema>>();

  const fieldArray = useFieldArray({
    control: form.control,
    name: parentName,
  })

  return (
    <div className="flex flex-col gap-y-6">
      {fieldArray.fields.map((field, i) => (
        <div className="relative flex flex-col gap-y-6" key={field.id}>
          <Button
            onClick={() => fieldArray.remove(i)}
            variant="outline"
            size="icon"
            className="absolute top-0 right-0 rounded-full h-auto w-auto p-1"
          >
            <MinusCircledIcon className="h-4 w-4" />
          </Button>
          <FormField
            control={form.control}
            name={`${parentName}.${i}.name`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-slate-950 dark:text-slate-50">
                  Name
                </FormLabel>

                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`${parentName}.${i}.description`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-slate-950 dark:text-slate-50">
                  Description
                </FormLabel>

                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FunctionInputs parentName={`${parentName}.${i}`} />
        </div>
      ))}

      <Button 
        onClick={() => fieldArray.append({
          name: "",
          description: "",
          type: "string",
        })}
        variant="outline"
        className="flex items-center gap-x-2 self-start"
      >
        <span className="mt-1">Add</span>
        <PlusCircledIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

const FunctionInputs = ({ parentName }: { parentName: `${keyof z.infer<typeof formSchema>}.${number}` }) => {
  const form = useFormContext<z.infer<typeof formSchema>>();

  const parentValues = form.watch(parentName);

  return (
    <>
      <FormField
        control={form.control}
        name={`${parentName}.type`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-slate-950 dark:text-slate-50">
              Type
            </FormLabel>

            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>

              <SelectContent>
                <SelectItem value="string">string</SelectItem>
                <SelectItem value="number">number</SelectItem>
                <SelectItem value="boolean">boolean</SelectItem>
                <SelectItem value="array">array</SelectItem>
                <SelectItem value="object">object</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
      
      {parentValues?.type === "string" && (
        <FormField
          control={form.control}
          name={`${parentName}.enum`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-slate-950 dark:text-slate-50">
                Enum
              </FormLabel>

              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      )}

      {parentValues?.type === "array" && (
        <FormItem>
          <FormLabel className="text-sm font-medium text-slate-950 dark:text-slate-50">
            Items
          </FormLabel>
          
          <FunctionInputs parentName={`${parentName}.items`} />
        </FormItem>
      )}

      {parentValues?.type === "object" && (
        <FormItem>
          <FormLabel className="text-sm font-medium text-slate-950 dark:text-slate-50">
            Properties
          </FormLabel>
          
          <div className="ml-6">
            <Obj parentName={`${parentName}.properties`} />
          </div>
        </FormItem>
      )}
    </>
  )
}


const FunctionBuilderForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      functions: [{
        type: "string",
        name: "",
        description: "",
        enum: [],
      }],
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  }

  const parentValues = form.watch("functions");
  console.log("function values: ", parentValues);

  return (
    <section className="w-1/2 flex flex-col border-r border-r-slate-300">
      <header className="flex px-8 py-4 border-b border-slate-300">
        <Link href="/">
          <Button variant="outline" size="icon">
            <CaretLeftIcon className="h-5 w-5" />
          </Button >
        </Link>
      </header>
     
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-6 px-8 py-4">
          <Obj parentName="functions" />
        </form>
      </Form>
    </section>
  )
}

export default function Home() {
  return (
    <main className="flex min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-900 dark:text-slate-50">
      {/* LEFT */}
      <FunctionBuilderForm />
      {/* RIGHT */}
      <section className="relative w-1/2 flex-col px-8 py-4">
      </section>
    </main>
  );
}

