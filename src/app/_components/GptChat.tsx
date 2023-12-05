
// components
import GptInput from "./GptInput";

// icons
import { CheckCircledIcon } from "@radix-ui/react-icons"; 

export default function GptChat() {
  return (
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
        </div>
      </div>

      <GptInput />
      
    </section>
  )
}


