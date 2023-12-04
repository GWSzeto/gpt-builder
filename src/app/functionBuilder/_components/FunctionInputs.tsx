// @ts-nocheck
'use client';

import { useFieldArray, useFormContext } from "react-hook-form";
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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

// types
import type { formSchema } from "./types";

// icons
import {
  PlusCircledIcon,
  MinusCircledIcon,
} from "@radix-ui/react-icons";

export const Obj = ({ parentName }: { parentName: "functions" }) => {
  const form = useFormContext<z.infer<typeof formSchema>>();

  const fieldArray = useFieldArray({
    control: form.control,
    name: parentName,
  })

  return (
    <div className="flex flex-col gap-y-6">
      {fieldArray.fields.map((field, i) => (
        <div className="relative flex flex-col gap-y-6" key={field.id}>
          {i !== 0 && <Separator className="my-6" />}
          <FormField
            control={form.control}
            name={`${parentName}.${i}.name`}
            render={({ field }) => (
              <FormItem>
                <div className="relative">
                  <FormLabel className="text-sm font-medium text-slate-950 dark:text-slate-50">
                    Name
                  </FormLabel>
                  <Button
                    onClick={() => fieldArray.remove(i)}
                    variant="outline"
                    size="icon"
                    className="absolute top-0 right-0 rounded-full h-auto w-auto p-1"
                  >
                    <MinusCircledIcon className="h-4 w-4" />
                  </Button>
                </div>
                <FormControl>
                  <Input {...field} className="w-[260px]" />
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
                  <Input {...field} className="w-[260px]" />
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
          enum: [],
          properties: [],
          items: {},
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

const FunctionInputs = ({ parentName }: { parentName: `functions.${number}` }) => {
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

            <Select onValueChange={field.onChange} defaultValue={field.value}  >
              <FormControl>
                <SelectTrigger className="w-[260px]" >
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
                <Input {...field} className="w-[260px]" />
              </FormControl>
            </FormItem>
          )}
        />
      )}

      {parentValues?.type === "array" && (
        <FormItem className="flex flex-col gap-y-3">
          <FormLabel className="text-sm font-medium text-slate-950 dark:text-slate-50">
            Items
          </FormLabel>
          
          <FunctionInputs parentName={`${parentName}.items`} className="w-[260px]" />
        </FormItem>
      )}

      {parentValues?.type === "object" && (
        <FormItem>
          <FormLabel className="text-sm font-medium text-slate-950 dark:text-slate-50">
            Properties
          </FormLabel>
          
          <div className="flex gap-x-6">
            <Separator className="h-[inherit]" orientation="vertical" />
            <Obj parentName={`${parentName}.properties`} />
          </div>
        </FormItem>
      )}
    </>
  )
}

