'use client'

import type { formSchema } from "./types";
import { useFormContext } from "react-hook-form";
import * as z from "zod";

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { twilight } from 'react-syntax-highlighter/dist/cjs/styles/prism';

// utils
import { parseFunctionParameters } from "./types";

export default function Viewer() {
  const form = useFormContext<z.infer<typeof formSchema>>()
  const data = form.watch()

  const functionValue = {
    type: "function",
    function: {
      name: data.name,
      description: data.description,
      parameters: {
        type: "object",
        properties: parseFunctionParameters(data.functions),
      }
    }
  }

  // console.log("function value: :", functionValue)

  return (
    <section className="relative w-1/2 max-h-screen flex-col px-8 py-4">
      <SyntaxHighlighter language="json" style={twilight} customStyle={{ border: 0, margin: 0, height: "100%" }}>
        {JSON.stringify(functionValue, null, 2)}
      </SyntaxHighlighter>
    </section>
  )
}


