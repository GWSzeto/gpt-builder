// components
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function EnterApiKey() {
  return (
    <Dialog>
      <DialogTrigger asChild>
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
