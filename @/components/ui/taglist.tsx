'use client'

import { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "./form";
import { Input } from "./input";
import { Button } from "./button";
import { Cross2Icon } from "@radix-ui/react-icons";

export function Taglist({ name, label }: { name: string; label: string; }) {
  const [input, setInput] = useState<string>("")
  const form = useFormContext()

  const fieldArray = useFieldArray({
    control: form.control,
    name: name,
  })

  const fieldData = form.watch(name) as string[]

  const addTag = () => {
    if (input === "") return
    fieldArray.append(input)
    setInput("")
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium">
            {label}
          </FormLabel>
          
          <div className="flex items-center gap-x-4 w-[260px]">
            <Input value={input} onChange={e => setInput(e.target.value)} />

            <Button
              type="button"
              onClick={addTag}
              variant="outline"
              className="flex items-center gap-x-2 self-start"
            >
              <span className="mt-1">Add</span>
            </Button>
          </div>

          <div className="flex items-center gap-x-3" >
            {fieldArray.fields.map((field, i) => (
              <Button
                onClick={() => fieldArray.remove(i)}
                size="sm"
                className="rounded-2xl px-3 py-0 text-xs"
                variant="outline"
                key={field.id}
              >
                <span>{fieldData[i]}</span>
                <Cross2Icon className="w-4 h-4 -mr-1" />
              </Button>
            ))}
          </div>
        </FormItem>
      )}
    />
  )
}
