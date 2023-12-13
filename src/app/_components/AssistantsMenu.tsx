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

export default async function AssistantsMenu() {
  
  const assistants = api.assistant.list.useQuery({})

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <HamburgerMenuIcon className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" >
        <SheetHeader>
          <SheetTitle>GPT AssistantsMenu</SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

