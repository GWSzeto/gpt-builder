
import { api } from "~/trpc/server";

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

export default async function Home() {
  const hello = await api.post.hello.query({ text: "from tRPC" });

  return (
    <main className="flex min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-900 dark:text-slate-50">
      {/* LEFT */}
      <section className="w-1/2 flex flex-col border-r border-r-slate-300">
        <header className="flex justify-between px-8 py-4 border-b border-slate-300">
          <Button variant="outline" size="icon">
            <HamburgerMenuIcon className="h-6 w-6" />
          </Button>

          <Button variant="outline" size="icon">
            <RocketIcon className="h-6 w-6" />
          </Button>
        </header>

        <div className="flex flex-col gap-y-6 px-8 py-4">

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-950 dark:text-slate-50">
              Name
            </label>
            <Input type="text" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-950 dark:text-slate-50">
              Description
            </label>
            <Input type="text" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-950 dark:text-slate-50">
              Instructions
            </label>
            <Textarea />
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-medium text-slate-950 dark:text-slate-50">
              Knowledge
            </h3>
            <Button variant="outline" size="sm" className="self-start">
              Upload
            </Button>
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-medium text-slate-950 dark:text-slate-50">
              Capabilities
            </h3>

            <div className="flex items-center gap-x-2">
              <Checkbox />
              <span className="text-sm font-medium text-slate-950 dark:text-slate-50">
                Code Interpreter
              </span>
            </div>

            <div className="flex items-center gap-x-2">
              <Checkbox disabled />
              <span className="text-sm font-medium text-slate-400 dark:text-slate-50">
                Image Generation (coming soon...)
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-medium text-slate-950 dark:text-slate-50">
              Functions
            </h3>
            <Button variant="outline" size="sm" className="flex items-center gap-x-2 self-start">
              <span>Add</span>
              <PlusCircledIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

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

            <Button size="lg">
              Enter API Key
            </Button>
          </div>
        </div>

        <Input className="fixed bottom-4 right-8 w-[45%]" placeholder="Type here..." />
      </section>
    </main>
  );
}

