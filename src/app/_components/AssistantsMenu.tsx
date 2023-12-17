
import Link from "next/link";
import type { Dispatch, SetStateAction } from "react";
import { api } from "~/trpc/react";
import { useQueryState } from "next-usequerystate";

// components
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button";


export default function AssistantsMenu({ open, setOpen }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) {
  const [assistantId] = useQueryState("aid")

  const assistants = api.assistant.list.useQuery({})

  return (
    <Sheet open={open} onOpenChange={setOpen} >
      <SheetContent side="left" className="overflow-y-auto w-[300px]" >
        <SheetHeader className="px-4 mb-4">
          <SheetTitle>GPT AssistantsMenu</SheetTitle>
        </SheetHeader>
        
        {!assistants.isLoading && assistants.data ? (
          <div className="flex flex-col gap-y-2">
            {assistants.data.data.map((assistant) => (
              <Link href={`/?aid=${assistant.id}`} key={assistant.id}>
                <Button
                  // onClick={() => handleAssistantClick(assistant.id)}
                  variant="ghost"
                  className={`justify-start px-4 py-2 ${assistantId === assistant.id ? "bg-slate-100" : ""}`} key={assistant.id}
                >
                  {assistant.name}: asst-{assistant.id.slice(-4)}
                </Button>
              </Link>
            ))}
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </SheetContent>
    </Sheet>
  );
}

