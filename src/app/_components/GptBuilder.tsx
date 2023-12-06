'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import useDebounce from "@/hooks/useDebounce";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { api } from "~/trpc/react";

// utils
import { AddRemoveArray, getTime } from "@/lib/utils";
import useUrlState from "@/hooks/useUrlState";

// components
import AssistantsMenu from "./AssistantsMenu";
import ExportCode from "./ExportCode";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

// icons
import { PlusCircledIcon } from "@radix-ui/react-icons"; 

const tool = z.union([z.literal("code_interpreter"), z.literal("retrieval")])
const formSchema = z.object({
  name: z.string(),
  description: z.string(),
  instructions: z.string(),
  tools: z.array(tool),
});

export default function GptBuilderForm() {
  const url = useUrlState();
  const updateAssistant = api.assistant.update.useMutation();
  const createAssistant = api.assistant.create.useMutation();
  const debouncedAssistantUpsert = useDebounce(async () => { 
    const assistantId = url.fetch("aid")
    if (assistantId) {
      await updateAssistant.mutateAsync({ id: assistantId, ...data })
      console.log("assistant updated");
    } else if (localStorage.getItem("openai-api-key")) { 
      const assistant = await createAssistant.mutateAsync(data)
      url.update("id", assistant.id)
      console.log("assistant created");
    }
  })
  const [timeUpdated, setTimeUpdated] = useState(new Date())

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      instructions: '',
      tools: [],
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  }

  const data = form.watch();

  useEffect(() => {
    if (form.formState.isValid && !form.formState.isValidating) {
      debouncedAssistantUpsert();
      setTimeUpdated(new Date());
    }
  }, [form.formState, form.formState.isValidating, data])

  return (
    <section className="w-1/2 flex flex-col border-r border-r-slate-300">
      <header className="flex justify-between px-8 py-4 border-b border-slate-300">
        <AssistantsMenu />

        <ExportCode nodeCode={"const asd = () => console.log('asd')"} pythonCode={"print('dsa')"}/>
      </header>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-6 px-8 py-4">
          <FormField
            control={form.control}
            name="name"
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
            name="description"
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

          <FormField
            control={form.control}
            name="instructions"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-slate-950 dark:text-slate-50">
                  Instructions
                </FormLabel>

                <FormControl>
                  <Textarea {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-y-3">
            <h3 className="text-sm font-medium text-slate-950 dark:text-slate-50">
              Knowledge
            </h3>
            <Button variant="outline" size="sm" className="self-start">
              Upload
            </Button>
          </div>

          <div className="flex flex-col gap-y-3">
            <h3 className="text-sm font-medium text-slate-950 dark:text-slate-50">
              Capabilities
            </h3>

            <div className="flex items-center gap-x-2">
              <FormControl>
                <Checkbox
                  checked={data.tools.includes("code_interpreter")}
                  onCheckedChange={(checked) => form.setValue("tools", AddRemoveArray<z.infer<typeof tool>>(Boolean(checked), data.tools, "code_interpreter"))}
                />
              </FormControl>

              <FormLabel className="text-sm font-medium text-slate-950 dark:text-slate-50">
                Code Interpreter
              </FormLabel>
            </div>

            <div className="flex items-center gap-x-2">
              <FormControl>
                <Checkbox
                  // checked={data.tools.includes("image")}
                  // onCheckedChange={(checked) => form.setValue("tools", AddRemoveArray(Boolean(checked), data.tools, "codeInterpreter"))}
                  disabled
                />
              </FormControl>

              <FormLabel className="text-sm font-medium text-slate-400 dark:text-slate-50">
                Image Generation (coming soon...)
              </FormLabel>
            </div>
          </div>

          <FormItem className="flex flex-col gap-1">
            <h3 className="text-sm font-medium text-slate-950 dark:text-slate-50">
              Functions
            </h3>
            <Link href="/functionBuilder" className="self-start">
              <Button variant="outline" size="sm" className="flex items-center gap-x-2 self-start">
                <span>Add</span>
                <PlusCircledIcon className="h-4 w-4" />
              </Button>
            </Link>
          </FormItem>
        </form>
      </Form>

      <div className="fixed bottom-0 left-0 w-1/2 flex justify-end text-xs px-4 py-2 border-t border-slate-300 text-slate-400">
        Last Updated {getTime(timeUpdated)}
      </div>
    </section>
  )
}

