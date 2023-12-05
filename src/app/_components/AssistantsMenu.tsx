'use client'

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

