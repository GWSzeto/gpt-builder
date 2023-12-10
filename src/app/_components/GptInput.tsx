import { useState, useEffect, FormEvent, Dispatch, SetStateAction } from "react";
import { api } from "~/trpc/react";

// utils
import useUrlState from "@/hooks/useUrlState";

// components
import EnterApiKey from "@/components/EnterApiKey";
import { Input } from "@/components/ui/input";
import type { Message } from "./GptChat";

export default function GptInput({ setMessages }: { setMessages: Dispatch<SetStateAction<Message[]>>}) {
  const [open, setOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [localLoaded, setLocalLoaded] = useState<boolean>(false);
  const url = useUrlState()

  const createThreadAndRun = api.thread.createAndRun.useMutation();
  const createMessage = api.message.create.useMutation();

  const createMessageAndRun = async (assistantId: string, message: string) => {
    const threadId = url.fetch("tid")
    if (threadId) {
      return createMessage.mutateAsync({ 
        threadId,
        assistantId,
        message,
      })
    }

    return createThreadAndRun.mutateAsync({ 
      assistantId,
      message,
    })
  }

  const onSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();

      const assistantId = url.fetch("aid")

      if (input.length === 0) return;
      if (localStorage.getItem("openai-api-key") === null) {
        setOpen(true);
        return
      }
      if (assistantId) {
        const runSteps = await createMessageAndRun(assistantId, input)
        const [assistantContent] = runSteps
          .filter(runStep => runStep.type === "message_creation")
          .map(({ type, ...runStep }) => runStep)
        console.log("assistant content:", assistantContent)
        // TODO: Look into how run steps.list works and work out the edge cases for this
        setMessages(messages => [...messages, assistantContent!])
      }
      
      setInput("");
    } catch (error: any) {
      setMessages(messages => [...messages, error.message])
    }
  }

  useEffect(() => {
    setLocalLoaded(true)
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
