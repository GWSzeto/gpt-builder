'use client'

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { api } from "~/trpc/react";
import { useQueryState } from "next-usequerystate";

// utils
import { AddRemoveArray } from "@/lib/utils";
import { formSchema as functionSchema, parseFunctionParameters } from "../_functionBuilder/_components/types";

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
import {
  TooltipProvider,
} from "@/components/ui/tooltip"

// icons
import { Cross2Icon, PlusCircledIcon, CaretLeftIcon } from "@radix-ui/react-icons"; 
import FunctionIcon from "@/icons/function";
import FunctionBuilder from "./FunctionBuilder";


const saveButtonStatus = {
  idle: {
    text: "Save",
    variant: "",
  },
  loading: {
    text: "Saving...",
    variant: "",
  },
  success: {
    text: "Saved!",
    variant: "bg-green-500",
  },
  error: {
    text: "Error",
    variant: "bg-red-500",
  },
}

const tool = z.union([
  z.object({ type: z.literal("code_interpreter") }),
  z.object({ type: z.literal("retrieval") }),
  functionSchema,
])
const formSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  instructions: z.string().optional(),
  tools: z.array(tool).default([]),
});

export default function GptBuilderForm() {
  const [toolParentName, setToolParentName] = useState<`tools.${number}.function` | null>(null)
  const [assistantId, setAssistantId] = useQueryState("aid")

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
          tools: (data.tools as z.infer<typeof tool>[]) ?? []
        });
      }
    }
  );
  const updateAssistant = api.assistant.update.useMutation();
  const createAssistant = api.assistant.create.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      instructions: '',
      tools: [],
    },
  });
  const toolFieldArray = useFieldArray({
    control: form.control,
    name: "tools",
  })

  const data = form.watch();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const tools = data.tools.map((tool) => {
        if (tool.type !== "function") return tool;

        return {
          type: "function" as const,
          function: {
            name: tool.function.name,
            description: tool.function.description,
            parameters: {
              type: "object",
              properties: parseFunctionParameters(tool.function.parameters),
            }
          }
        }
      })
      const assistantData = { ...data, tools }

      if (assistantId) {
        await updateAssistant.mutateAsync({ id: assistantId, ...assistantData });
        setTimeout(() => updateAssistant.reset(), 2000)
      } else if (localStorage.getItem("openai-api-key")) { 
        const assistant = await createAssistant.mutateAsync(assistantData);
        await setAssistantId(assistant.id);
        setTimeout(() => createAssistant.reset(), 2000)
      }

    } catch(error: unknown) {
      // TODO: Handle error
    }
  }

  const addFunctionTool = () => {
    const newToolIndex = toolFieldArray.fields.length

    toolFieldArray.append({
      type: "function",
      function: {
        name: "",
        description: "",
        parameters: [{
          name: "",
          type: "string",
          enum: [],
        }]
      }
    })
    setToolParentName(`tools.${newToolIndex}.function`)
  }

  return (
    <TooltipProvider>
      <section className="relative w-1/2 max-h-screen overflow-y-auto flex flex-col border-r border-r-slate-300 pt-[70px]"> 
        <header className="fixed top-0 z-20 bg-slate-50 left-[55px] w-[calc(50%-27.5px)] h-[70px] flex items-center justify-between px-8 border-b border-b-slate-300 border-r border-r-slate-300">
          {toolParentName ? (
            <Button onClick={() => setToolParentName(null)} variant="outline" size="icon">
              <CaretLeftIcon className="h-5 w-5" />
            </Button >
          ) : (
            <ExportCode nodeCode={"const asd = () => console.log('asd')"} pythonCode={"print('dsa')"}/>
          )}

          <Button
            disabled={createAssistant.status === "loading" || updateAssistant.status === "loading"}
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            className={`w-20 ${saveButtonStatus[updateAssistant.status].variant}`}
          >
            {saveButtonStatus[updateAssistant.status].text}
          </Button>
        </header>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-6 px-8 py-4 mb-[32px]">
            {toolParentName ? (
              <FunctionBuilder toolParentName={toolParentName} />
            ) : (
              <>
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
                        checked={!!(data.tools.find(tool => tool.type === "code_interpreter"))}
                        onCheckedChange={(checked) => form.setValue("tools", AddRemoveArray<z.infer<typeof tool>>(
                          Boolean(checked), 
                          data.tools, 
                          { type: "code_interpreter" },
                          (item: z.infer<typeof tool>) => item.type !== "code_interpreter")
                        )}
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

                  {data.tools
                    .map((tool, index) => tool.type === "function" && (
                      <div className="flex items-center justify-between" key={index} >
                        <div onClick={() => setToolParentName(`tools.${index}.function`)} className="flex items-center gap-x-2 cursor-pointer">
                          <div className="rounded-full p-1 bg-slate-200" >
                            <FunctionIcon className="h-4 w-4 text-slate-500" />
                          </div>
                          <span className="text-sm">{tool.function.name}</span>
                        </div>

                        <Button onClick={() => toolFieldArray.remove(index)} variant="outline" size="icon" className="grid place-items-center rounded-full h-6 w-6">
                          <Cross2Icon className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  }

                  <Button onClick={() => addFunctionTool()} variant="outline" size="sm" className="flex items-center gap-x-2 self-start">
                    <span>Add</span>
                    <PlusCircledIcon className="h-4 w-4" />
                  </Button>
                </FormItem>
              </>
            )}
          </form>
        </Form>
      </section>
    </TooltipProvider>
  )
}

