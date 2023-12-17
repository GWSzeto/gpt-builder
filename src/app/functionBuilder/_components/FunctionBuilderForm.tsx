'use client'

import { useFormContext } from "react-hook-form";
import Link from "next/link";
import type * as z from "zod";

// types
import { type formSchema } from "./types";

// components
import { Button } from "@/components/ui/button";
import { Obj } from "./FunctionInputs";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

// icons
import {
  CaretLeftIcon,
} from "@radix-ui/react-icons";

export default function FunctionBuilderForm() {
  const form = useFormContext<z.infer<typeof formSchema>>();

  return (
    <section className="relative w-1/2 max-h-screen overflow-y-auto flex flex-col border-r border-r-slate-300 overflow-x-auto pt-[70px]">
      <header className="fixed top-0 bg-slate-50 left-[55px] w-[calc(50%-27.5px)] h-[70px] z-20 flex items-center justify-between px-8 border-b border-b-slate-300 border-r border-r-slate-300">
        <Link href="/">
          <Button variant="outline" size="icon">
            <CaretLeftIcon className="h-5 w-5" />
          </Button >
        </Link>

        <Button type="submit">
          Save
        </Button>
      </header>
      
      <div className="flex flex-col gap-y-6 px-8 py-4" >
        <h1 className="text-2xl font-bold text-slate-950 dark:text-slate-50">
          Function
        </h1>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-slate-950 dark:text-slate-50">
                Name
              </FormLabel>

              <FormControl>
                <Input {...field} className="w-[260px]" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <div className="relative">
                <FormLabel className="text-sm font-medium text-slate-950 dark:text-slate-50">
                  Description
                </FormLabel>
              </div>
              <FormControl>
                <Input {...field} className="w-[260px]" />
              </FormControl>
            </FormItem>
          )}
        />

        <Separator className="my-6" />

        <h1 className="text-2xl font-bold text-slate-950 dark:text-slate-50">
          Parameters
        </h1>

        <Obj parentName="functions" />
      </div>
    </section>
  )
}


