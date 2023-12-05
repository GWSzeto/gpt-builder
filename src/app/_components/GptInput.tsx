'use client'

import { useState, useEffect, FormEvent } from "react";

// components
import EnterApiKey from "@/components/EnterApiKey";
import { Input } from "@/components/ui/input";

export default function GptInput() {
  const [open, setOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [localLoaded, setLocalLoaded] = useState<boolean>(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("submit: ", input);
    if (input.length === 0) return;
    if (localStorage.getItem("openai-api-key") === null) {
      setOpen(true);
      return;
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
