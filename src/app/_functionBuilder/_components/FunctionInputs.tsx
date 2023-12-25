'use client';

import { useFieldArray, useFormContext } from "react-hook-form";
import type * as z from "zod";

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
import { Taglist } from "@/components/ui/taglist";

// types
import type { formSchema } from "../../_components/GptBuilder";

// icons
import {
  PlusCircledIcon,
  MinusCircledIcon,
} from "@radix-ui/react-icons";

export const Obj = ({ parentName }: { parentName: `tools.${number}.function.parameters` }) => {
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
                  <FormLabel className="text-sm font-medium">
                    Name
                  </FormLabel>

                  {i !== 0 && (
                    <Button
                      onClick={() => fieldArray.remove(i)}
                      variant="outline"
                      size="icon"
                      type="button"
                      className="absolute top-0 right-0 rounded-full h-auto w-auto p-1"
                    >
                      <MinusCircledIcon className="h-4 w-4" />
                    </Button>
                  )}
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
                <FormLabel className="text-sm font-medium">
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
        type="button"
        onClick={() => fieldArray.append({
          name: "",
          description: "",
          type: "string",
          enum: [],
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

const FunctionInputs = ({ parentName }: { parentName: `tools.${number}.function.parameters.${number}` }) => {
  const form = useFormContext<z.infer<typeof formSchema>>();

  const parentValues = form.watch(parentName);

  const updateField = (type: "string" | "boolean" | "number" | "array" | "object") => {
    const baseData = {
      name: parentValues.name,
      description: parentValues.description,
      type,
    }

    if (type === "string") {
      form.setValue(parentName, {
        ...baseData,
        enum: [],
      })
    } else if (type === "object") {
      form.setValue(parentName, {
        ...baseData,
        properties: [{
          name: "",
          description: "",
          type: "string",
          enum: [],
        }],
      })
    } else if (type === "array") { 
      form.setValue(parentName, {
        ...baseData,
        items: {
          type: "string",
          enum: [],
        }
      })
    } else {
      form.setValue(parentName, baseData)
    }
  }

  return (
    <>
      <FormField
        control={form.control}
        name={`${parentName}.type`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">
              Type
            </FormLabel>

            <Select
              onValueChange={type => {
                updateField(type as "string" | "number" | "boolean" | "object" | "array")
                field.onChange(type)
              }}
              defaultValue={field.value}
            >
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
        <Taglist name={`${parentName}.enum`} label="Enum" />
      )}

      {parentValues?.type === "array" && (
        <FormItem className="flex flex-col gap-y-3">
          <FormLabel className="text-sm font-medium">
            Items
          </FormLabel>
          
          <FunctionInputs parentName={`${parentName}.items` as typeof parentName} />
        </FormItem>
      )}

      {parentValues?.type === "object" && (
        <FormItem>
          <FormLabel className="text-sm font-medium">
            Properties
          </FormLabel>
          
          <div className="flex gap-x-6">
            <Separator className="h-[inherit]" orientation="vertical" />
            <Obj parentName={`${parentName}.properties` as `tools.${number}.function.parameters`} />
          </div>
        </FormItem>
      )}
    </>
  )
}

