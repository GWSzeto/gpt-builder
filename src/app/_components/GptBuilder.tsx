'use client'

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { api } from "~/trpc/react";
import { useQueryState } from "next-usequerystate";
import useDeepCompareEffect from "use-deep-compare-effect";

// utils
import { AddRemoveArray, getTime, urlBuilder } from "@/lib/utils";
import useDebounce from "@/hooks/useDebounce";

// components
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

const tool = z.union([z.literal("code_interpreter"), z.literal("retrieval"), z.literal("function")])
const formSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  instructions: z.string().optional(),
  tools: z.array(tool).default([]),
});

export default function GptBuilderForm() {
  const [assistantId, setAssistantId] = useQueryState("aid")
  const [timeUpdated, setTimeUpdated] = useState<Date | null>(null)
  const searchParams = useSearchParams()

  api.assistant.fetch.useQuery(
    { id: assistantId! },
    {
      enabled: !!assistantId,
      // TODO: This will be deprecated soon, think about how to deal with this
      // May need to shove this into it's own useEffect
      onSuccess: (data) => {
        form.reset({
          name: data.name ?? "",
          description: data.description ?? "",
          instructions: data.instructions ?? "",
          tools: data.tools.map(({ type }) => type) ?? [],
        });
      }
    }
  );
  const updateAssistant = api.assistant.update.useMutation();
  const createAssistant = api.assistant.create.useMutation();

  const debouncedUpdateAssistant = useDebounce(async (data: z.infer<typeof formSchema>) => {
    try {
      formSchema.parse(data)
      console.log("data: ", data)
      if (assistantId) {
        await updateAssistant.mutateAsync({ id: assistantId, ...data });
      } else if (localStorage.getItem("openai-api-key")) { 
        const assistant = await createAssistant.mutateAsync(data);
        await setAssistantId(assistant.id);
      }

      setTimeUpdated(new Date());
    } catch(error: unknown) {
      // TODO: Handle error
    }
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      instructions: '',
      tools: [],
    },
    });

  const data = form.watch();
 
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("Data: ", data)
  }
  
  useDeepCompareEffect(() => {
    if (form.formState.isDirty) {
      debouncedUpdateAssistant(data)
    }
  }, [data])
  useEffect(() => { setTimeUpdated(new Date()) }, [])

  return (
    <section className="relative w-1/2 flex flex-col border-r border-r-slate-300">
      <header className="flex justify-end px-8 py-4 border-b border-slate-300">
        <ExportCode nodeCode={"const asd = () => console.log('asd')"} pythonCode={"print('dsa')"}/>
      </header>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-6 px-8 py-4 mb-[32px]">
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
            <Link href={urlBuilder("/functionBuilder", searchParams.toString())} className="self-start">
              <Button variant="outline" size="sm" className="flex items-center gap-x-2 self-start">
                <span>Add</span>
                <PlusCircledIcon className="h-4 w-4" />
              </Button>
            </Link>
          </FormItem>

        </form>
      </Form>
      
      <div className="fixed left-[55px] bottom-0 w-[calc(50%-27.5px)] h-[32px] flex justify-end items-center text-xs px-4 border-t border-slate-300 text-slate-400 bg-slate-50 border-r border-r-slate-300">
        Last Updated {timeUpdated ? getTime(timeUpdated) : ""}
      </div>
    </section>
  )
}

