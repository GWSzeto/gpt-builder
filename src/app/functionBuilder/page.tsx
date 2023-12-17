'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useQueryState } from "next-usequerystate";
import * as z from "zod";

// utils
import { formSchema } from "./_components/types";
import { api } from "~/trpc/react";
import { schemaValidation } from "./_components/types";

// components
import { Form } from "@/components/ui/form"; 
import FunctionBuilderForm from "./_components/FunctionBuilderForm";
import Viewer from "./_components/Viewer";

export default function Home() {
  const [assistantId] = useQueryState("aid")
  const updateAssistant = api.assistant.update.useMutation()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      functions: [{
        type: "string",
        name: "",
        description: "",
      }],
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (!localStorage.getItem("openai-api-key")) return
      if (!assistantId) return
      console.log("schema validation: ", schemaValidation(data))
      // await updateAssistant.mutateAsync({ id: assistantId, ...data });
      
    } catch(error: unknown) {
      // TODO: Handle error
    }
  }

  const data = form.watch()

  console.log("form is valid: ", form.formState.isValid)
  console.log("form errors: ", form.formState.errors)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex bg-slate-50 text-slate-950 dark:bg-slate-900 dark:text-slate-50 ml-[55px]">
        <FunctionBuilderForm />
        <Viewer />
      </form>
    </Form>
  );
}

