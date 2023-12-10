import type { Dispatch, SetStateAction } from "react";

// utils
import useApiKeyStorage from "@/hooks/useApiKeyStorage";

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
  const [apiKey, setApiKey] = useApiKeyStorage();

  const saveApikey = () => {
    if (!apiKey) return;
    setApiKey(apiKey);
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
