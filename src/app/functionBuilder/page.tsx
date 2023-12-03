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
import { useForm, useFieldArray, type ControllerProps, useFormContext } from "react-hook-form";
import * as z from "zod";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  useFormField,
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
  return z.lazy(() => base.extend({
    properties: z.array(z.union([
      base, 
      str, 
      getArraySchema(), 
      getObjectSchema(),
    ])),
  }))
}

function getArraySchema(): z.ZodType<Arr> {
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

const NameAndDescription = ({ i }: { i: number }) => {
  const form = useFormContext<z.infer<typeof formSchema>>();

  return (
    <>
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
    </>
  )
}

const FunctionInputs = ({ i }: { i: number }) => {
  const form = useFormContext<z.infer<typeof formSchema>>();

  const functionValues = form.watch("functions");

  return (
    <>
      <FormField
        control={form.control}
        name={`functions.${i}.type`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-slate-950 dark:text-slate-50">
              Type
            </FormLabel>

            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
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
      
      {functionValues[i]?.type === "string" && (
        <FormField
          control={form.control}
          name={`functions.${i}.enum`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-slate-950 dark:text-slate-50">
                Enum
              </FormLabel>

              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      )}

      {functionValues[i]?.type === "array" && (
        <FormField
          control={form.control}
          name={`functions.${i}.items`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-slate-950 dark:text-slate-50">
                Items
              </FormLabel>

              <FormControl>
                {/* <Input {...field} /> */}
              </FormControl>
            </FormItem>
          )}
        />
      )}

      {functionValues[i]?.type === "object" && (
        <FormField
          control={form.control}
          name={`functions.${i}.items`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-slate-950 dark:text-slate-50">
                Properties
              </FormLabel>

              <FormControl>
                {/* <Input {...field} /> */}
              </FormControl>
            </FormItem>
          )}
        />
      )}
    </>
  )
}


const FunctionBuilderForm = () => {

  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     functions: [{
  //       type: "string",
  //       name: "",
  //       description: "",
  //       enum: [],
  //     }],
  //   },
  // });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      functions: [{
        type: "object",
        name: "asd",
        description: "dsa",
        properties: [{
          type: "string",
          name: "",
          description: "",
          enum: [],
        }]
      }],
    },
  });

  const fieldArray = useFieldArray({ 
    control: form.control, 
    name: "functions.0.properties"
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  }

  const functionValues = form.watch("functions");
  console.log("function values: ", functionValues);

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
              <NameAndDescription i={i} />
              <FunctionInputs i={i} />
              <Button onClick={() => fieldArray.append({ type: "string", name: "", description: "" })} >add</Button>
              <Button onClick={() => fieldArray.remove(i)} >delete</Button>
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

