'use client'

import { useState, useEffect, FormEvent } from "react";
import { api } from "~/trpc/react";

// utils
import useUrlState from "@/hooks/useUrlState";

// components
import EnterApiKey from "@/components/EnterApiKey";
import { Input } from "@/components/ui/input";

export default function GptInput() {
  const [open, setOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [localLoaded, setLocalLoaded] = useState<boolean>(false);
  const [message, setMessages] = useState<string[]>([]);
  const url = useUrlState()

  const createThreadAndRun = api.thread.createAndRun.useMutation();
  const createMessage = api.message.create.useMutation();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const assistantId = url.fetch("aid")
    const threadId = url.fetch("tid")

    if (input.length === 0) return;
    if (localStorage.getItem("openai-api-key") === null) {
      setOpen(true);
      return
    }
    if (assistantId) {
      if (threadId) {
        const runSteps = await createMessage.mutateAsync({ 
          threadId,
          assistantId,
          message: input,
        })
        const assistantContent = runSteps
          .filter(runStep => runStep.type === "message_creation")
          .map(runStep => runStep.content)
        }
        
      } else {
        const runSteps = await createThreadAndRun.mutateAsync({ 
          assistantId,
          message: input,
        })
        const assistantContent = runSteps
          .filter(runStep => runStep.type === "message_creation")
          .map(runStep => runStep.content)
      }
    }
    
    setInput("");
  }

  useEffect(() => {
    setLocalLoaded(true);
  }, [])

  return (
    <form onSubmit={onSubmit} className="fixed w-1/2 bottom-0 right-0 px-8 py-4">
      <EnterApiKey open={open} setOpen={setOpen} />
      <Input
        disabled={!localLoaded}
        placeholder="Type here..."
        onChange={e => setInput(e.target.value)}
        value={input}
      />
    </form>
  )
}
