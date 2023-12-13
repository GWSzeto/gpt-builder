import { useState, useEffect, FormEvent, Dispatch, SetStateAction } from "react";
import { api } from "~/trpc/react";
import type { Message } from "./GptChat";
import { useQueryState } from "next-usequerystate";

// types
import type { RunStep } from "~/server/api/routers/runStep";

// components
import EnterApiKey from "@/components/EnterApiKey";
import { Input } from "@/components/ui/input";

export default function GptInput({ setMessages }: { setMessages: Dispatch<SetStateAction<Message[]>>}) {
  const [open, setOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [localLoaded, setLocalLoaded] = useState<boolean>(false);
  const [threadId, setThreadId] = useQueryState("tid")
  const [assistantId, setAssistantId] = useQueryState("aid")
  
  const createAssistant = api.assistant.create.useMutation();
  const createThreadAndRun = api.thread.createAndRun.useMutation();
  const createMessage = api.message.create.useMutation();

  const onSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      if (input.length === 0) return;
          
      // ask for api key if not set
      if (!localStorage.getItem("openai-api-key")) {
        setOpen(true);
        return
      }

      // TODO: Think about how to handle this state properly
      // Should it show an error message if it can't get the assistant message properly?
      setMessages(messages => [...messages, { 
        id: crypto.randomUUID(),
        role: "user",
        content: input
      }])
      setInput("");

      let aid: string | null = assistantId;
      let tid: string | null = threadId;
      let runSteps: RunStep[] = [];

      // create assistant if it doesn't exist
      if (!aid) {
        const { id } = await createAssistant.mutateAsync({})
        setAssistantId(id)
        aid = id
      }

      if (tid) {
        runSteps = await createMessage.mutateAsync({ 
          threadId: tid,
          assistantId: aid,
          message: input,
        })
      } else {
        const { threadId: _tid, runSteps: rs } = await createThreadAndRun.mutateAsync({ 
          assistantId: aid,
          message: input,
        });
        setThreadId(_tid);
        tid = _tid;
        runSteps = rs;
      }

      // parse runSteps
      const [assistantContent] = runSteps
        .filter(runStep => runStep.type === "message_creation")
        .map(({ type, ...runStep }) => runStep)
      console.log("assistant content:", assistantContent)

      // TODO: Look into how run steps.list works and work out the edge cases for this
      setMessages(messages => [...messages, assistantContent!])
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
        className="bg-slate-50"
        disabled={!localLoaded}
        placeholder="Type here..."
        onChange={e => setInput(e.target.value)}
        value={input}
      />
    </form>
  )
}
