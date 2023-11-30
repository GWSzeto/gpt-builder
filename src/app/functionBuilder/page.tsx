'use client';

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import {
  CaretLeftIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const EnterApiKey = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button size="lg">
          Enter API Key
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-y-6">
        <DialogHeader>
          <DialogTitle>Enter your OpenAI API Key</DialogTitle>
          <DialogDescription>
            You need an OpenAI API Key to use the app.
            Your API Key is stored locally on your browser and never sent anywhere else.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

const base = z.object({
  name: z.string(),
  description: z.string(),
  type: z.union([z.literal("string"), z.literal("number"), z.literal("boolean"), z.literal("array"), z.literal("object")]),
})

const str = base.extend({
  enum: z.array(z.string()).optional(),
})

type Obj = z.infer<typeof base> & {
  properties: (Obj | z.infer<typeof base> | z.infer<typeof str> | z.infer<typeof arr>)[],
}

type Arr = z.infer<typeof base> & {
  items: (Arr 
    | z.infer<Omit<typeof base, "name" | "desciprtion">>
    | z.infer<Omit<typeof str, "name" | "desciprtion">>
    | Omit<Obj, "name" | "description">
  )[],
}

function getObjectSchema(): z.ZodType<Obj> {
  console.log("how many tinmes");
  return z.lazy(() => base.extend({
    properties: z.array(z.union([base, str, getArraySchema(), getObjectSchema()])),
  }))
}

function getArraySchema(): z.ZodType<Arr> {
  console.log("how many tinmes");
  return z.lazy(() => base.extend({
    items: z.array(z.union([
      base.omit({ name: true, description: true }), 
      str.omit({ name: true, description: true }),  
      z.object({ properties: z.array(z.union([base, str, getArraySchema(), getObjectSchema()])) }),
      getArraySchema(),
    ])),
  }))
}

const obj = getObjectSchema();
const arr = getArraySchema();

const formSchema = z.object({
  functions: z.array(z.union([base, str, obj, arr])),
});

const FunctionBuilderForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      functions: [{
        name: "",
        type: "string",
        enum: [],
      }],
    },
  });

  const fieldArray = useFieldArray({ 
    control: form.control, 
    name: 'functions'
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  }

  return (
    <section className="w-1/2 flex flex-col border-r border-r-slate-300">
      <header className="flex px-8 py-4 border-b border-slate-300">
        <Link href="/">
          <Button variant="outline" size="icon">
            <CaretLeftIcon className="h-5 w-5" />
          </Button >
        </Link>
      </header>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-6 px-8 py-4">
          {fieldArray.fields.map((field, i) => (
            <section key={field.id} className="flex flex-col gap-y-6" >
              <FormField
                control={form.control}
                name={`functions.${i}.name`}
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
                name={`functions.${i}.description`}
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
           </section>
          ))}
        </form>
      </Form>
    </section>
  )
}

export default function Home() {
  return (
    <main className="flex min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-900 dark:text-slate-50">
      {/* LEFT */}
      <FunctionBuilderForm />
      {/* RIGHT */}
      <section className="relative w-1/2 flex-col px-8 py-4">
      </section>
    </main>
  );
}

