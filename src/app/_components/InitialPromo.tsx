'use client'

import { useState, useEffect } from "react";

// icons
import { CheckCircledIcon } from "@radix-ui/react-icons"; 

export default function InitialPromo() {
  const [apiKeyExists, setApiKeyExists] = useState<boolean>(false);
  const [localLoaded, setLocalLoaded] = useState<boolean>(false);

  useEffect(() => {
    setLocalLoaded(true);

    const apiKeyExstsCheck = () => {
      setApiKeyExists(!!localStorage.getItem("openai-api-key"));
    }

    window.addEventListener("apiKey-storage-event", apiKeyExstsCheck);

    return () => {
      window.removeEventListener("apiKey-storage-event", apiKeyExstsCheck);
    }
  }, []);

  if (!localLoaded) return null;
  
  if (apiKeyExists) return (
    <div className="fixed w-1/2 top-0 left-1/2 px-8 py-4">
      <h1 className="text-2xl font-extrabold">GPT Builder</h1>
    </div>
  )
  
  return (
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
  )
}
