'use client';

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext } from "react-hook-form";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { twilight } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import * as z from "zod";

// components
import { Form } from "@/components/ui/form"; 
import { Button } from "@/components/ui/button";
import { Obj } from "./_components/FunctionInputs";

// icons
import {
  CaretLeftIcon,
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

const formSchemaKeyPath = z.string().regex(/^(functions)((\.[0-9]+)(\.(properties|items)))*/)

const FunctionBuilderForm = () => {
  return (
    <section className="w-1/2 flex flex-col border-r border-r-slate-300 overflow-x-auto">
      <header className="flex px-8 py-4 border-b border-slate-300">
        <Link href="/">
          <Button variant="outline" size="icon">
            <CaretLeftIcon className="h-5 w-5" />
          </Button >
        </Link>
      </header>
      
      <div className="flex flex-col gap-y-6 px-8 py-4" >
        <Obj parentName="functions" />
      </div>
    </section>
  )
}

const Viewer = () => {
  const form = useFormContext<z.infer<typeof formSchema>>()
  const data = form.watch("functions")

  const parseFunctionParameters = (item: Schema) => {
    const baseData = {
      description: item.description,
      type: item.type,
    }

    if (item.type === "string") {
      return {
        ...baseData,
        enum: [],
      }
    } else if (item.type === "object") {
      return {
        ...baseData,
        properties: [],
      }
    } else if (item.type === "array") { 
      return {
        ...baseData,
        items: {}
      }
    } else {
      return baseData
    }
  }

  const functionMap = data.reduce((acc, curr) => ({
    ...acc,
    [curr.name]: parseFunctionParameters(curr),
  }), {} as Record<string, any>)
  console.log("function map: ", functionMap)

  const functionValue = {
    type: "function",
    function: {
      name: "",
      description: "",
      parameters: {
        type: "object",
        properties: functionMap
      }
    }
  }

  return (
    <section className="relative w-1/2 flex-col px-8 py-4">
      <SyntaxHighlighter language="json" style={twilight} customStyle={{ border: 0, margin: 0, height: "100%" }}>
        {JSON.stringify(functionValue, null, 2)}
      </SyntaxHighlighter>
    </section>
  )
}

export default function Home() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      functions: [{
        type: "string",
        name: "",
        description: "",
      }],
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  }

  const asd = form.watch("functions")
  console.log("asd: :", asd)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-900 dark:text-slate-50">
        {/* LEFT */}
        <FunctionBuilderForm />
        {/* RIGHT */}
        <Viewer />
      </form>
    </Form>
  );
}

