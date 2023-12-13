'use client'

import { api } from "~/trpc/react";

// components
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button";

// icons
import { HamburgerMenuIcon } from "@radix-ui/react-icons"; 

export default function AssistantsMenu() {
  const assistants = api.assistant.list.useQuery({})

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <HamburgerMenuIcon className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="overflow-y-auto" >
        <SheetHeader>
          <SheetTitle>GPT AssistantsMenu</SheetTitle>
        </SheetHeader>
        
        {!assistants.isLoading && assistants.data ? (
          <div className="flex flex-col gap-y-6">
            {assistants.data.data.map((assistant) => (
              <div key={assistant.id}>
                {assistant.name}: asst-{assistant.id.slice(-4)}
              </div>
            ))}
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </SheetContent>
    </Sheet>
  );
}

