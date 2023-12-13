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

// types
import { type Schema, formSchema } from "./_components/types";

// icons
import {
  CaretLeftIcon,
} from "@radix-ui/react-icons";

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

