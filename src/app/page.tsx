'use client';

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import {
  HamburgerMenuIcon,
  RocketIcon,
  PlusCircledIcon,
  CheckCircledIcon,
} from "@radix-ui/react-icons";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const AssistantsMenu = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <HamburgerMenuIcon className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" >
        <SheetHeader>
          <SheetTitle>GPT AssistantsMenu</SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { twilight } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { CopyIcon } from '@radix-ui/react-icons';

type ExportCodeProps = {
  nodeCode: string;
  pythonCode: string;
}

const ExportCode = ({ nodeCode, pythonCode }: ExportCodeProps ) => {
  const [language, setLanguage] = useState<'javascript' | 'python'>('javascript');
  const code = language === 'javascript' ? nodeCode : pythonCode;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline" size="icon">
          <RocketIcon className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-y-6">
        <DialogHeader>
          <DialogTitle>Ready to launch!</DialogTitle>
          <DialogDescription>
            Just copy the code and paste it into your backend
          </DialogDescription>
        </DialogHeader>

        <div>
          <div className="flex items-center ml-4" >
            <button className={`rounded-t-xl text-sm px-4 py-2 -mb-[1px] ${language === 'javascript' ? 'text-slate-50 bg-black' : 'text-slate-950 bg-white'}`} onClick={() => setLanguage('javascript')}>Node</button>
            <button className={`rounded-t-xl text-sm px-4 py-2 -mb-[1px] ${language === 'python' ? 'text-slate-50 bg-black' : 'text-slate-950 bg-white'}`} onClick={() => setLanguage('python')}>Python</button>
          </div>
          <div className="relative">
            <button onClick={copyToClipboard} className="absolute top-3 right-3">
              <CopyIcon className="text-white"/>
            </button>
            <SyntaxHighlighter language={language} style={twilight} customStyle={{ border: 0, margin: 0 }}>
              {code}
            </SyntaxHighlighter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

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

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

const formSchema = z.object({
  name: z.string(),
  description: z.string(),
  instructions: z.string(),
  codeInterpreter: z.boolean(),
  imageGeneration: z.boolean(),
});

const GptBuilderForm = () => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      instructions: '',
      codeInterpreter: false,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  }

  const data = form.watch();

  useEffect(() => {
    if (form.formState.isValid && !form.formState.isValidating) {
      console.log("data: ", data);
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

            <FormField
              control={form.control}
              name="codeInterpreter"
              render={({ field }) => (
                <div className="flex items-center gap-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>

                  <FormLabel className="text-sm font-medium text-slate-950 dark:text-slate-50">
                    Code Interpreter
                  </FormLabel>
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="imageGeneration"
              render={({ field }) => (
                <div className="flex items-center gap-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled
                    />
                  </FormControl>

                  <FormLabel className="text-sm font-medium text-slate-400 dark:text-slate-50">
                    Image Generation (coming soon...)
                  </FormLabel>
                </div>
              )}
            />
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
    </section>
  )
}

export default function Home() {
  return (
    <main className="flex min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-900 dark:text-slate-50">
      {/* LEFT */}
      <GptBuilderForm />
      {/* RIGHT */}
      <section className="relative w-1/2 flex-col px-8 py-4">
        <div className="absolute inset-0 grid place-items-center">
          <div className="p-8 flex flex-col items-center gap-y-10">
            <h1 className="text-4xl font-extrabold">GPT Builder</h1>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-x-2">
                <CheckCircledIcon className="h-4 w-4 text-green-500" />
                <span className="text-sm text-slate-950 dark:text-slate-50">
                  No monthly fee, no usage limit
                </span>
              </div>

              <div className="flex items-center gap-x-2">
                <CheckCircledIcon className="h-4 w-4 text-green-500" />
                <span className="text-sm text-slate-950 dark:text-slate-50">
                  Use your own API key
                </span>
              </div>

              <div className="flex items-center gap-x-2">
                <CheckCircledIcon className="h-4 w-4 text-green-500" />
                <span className="text-sm text-slate-950 dark:text-slate-50">
                  Chat folders, search, export
                </span>
              </div>

              <div className="flex items-center gap-x-2">
                <CheckCircledIcon className="h-4 w-4 text-green-500" />
                <span className="text-sm text-slate-950 dark:text-slate-50">
                  New features every week
                </span>
              </div>
            </div>

            <EnterApiKey />
          </div>
        </div>
        
        <div className="fixed w-1/2 bottom-0 right-0 px-8 py-4">
          <Input placeholder="Type here..." />
        </div>
      </section>
    </main>
  );
}

