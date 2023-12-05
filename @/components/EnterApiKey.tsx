import { type Dispatch, type SetStateAction, useState } from "react";

// components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type EnterApiKeyProps = {
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>,
}
export default function EnterApiKey({ open, setOpen }: EnterApiKeyProps) {
  const [apiKey, setApiKey] = useState<string>("");

  const saveApikey = () => {
    if (apiKey.length === 0) return;
    localStorage.setItem("openai-api-key", apiKey);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="gap-y-6">
        <DialogHeader>
          <DialogTitle>Enter your OpenAI API Key</DialogTitle>
          <DialogDescription>
            You need an OpenAI API Key to use the app.<br/>
            Your API Key is stored locally in the browser.{" "}
            <a className="underline" href="https://platform.openai.com/api-keys" target="_blank" >Create one on OpenAI</a>
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={saveApikey} className="flex flex-col gap-y-6">
          <Input onChange={e => setApiKey(e.target.value)} placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" />

          <Button type="submit" size="lg" className="self-center" >
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
