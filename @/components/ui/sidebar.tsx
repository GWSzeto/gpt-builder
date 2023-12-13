"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// components
import { Button } from "@/components/ui/button";

// icons
import RobotIcon from "@/icons/robot";
import { CounterClockwiseClockIcon } from "@radix-ui/react-icons";
import AssistantsMenu from "~/app/_components/AssistantsMenu";

const sidebarVariants = cva(
  "w-[55px] h-screen hover:w-[px]",
)

type SidebarProps = VariantProps<typeof sidebarVariants> & { hoverClassName?: string };

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & SidebarProps
>(({ className, hoverClassName, ...props }, ref) => {
  const [isHovered, setIsHovered] = React.useState<boolean>(false);
  const [hoverTimeout, setHoverTimeout] = React.useState<NodeJS.Timeout | null>(null);
  const [assistantsMenuOpen, setAssistantsMenuOpen] = React.useState<boolean>(false);

  const handleMouseEnter = () => {
    const timeout = setTimeout(() => setIsHovered(true), 300); // 2000ms delayS
    setHoverTimeout(timeout);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout!);
    setIsHovered(false);
  };
  
  return (
    <>
      <AssistantsMenu open={assistantsMenuOpen} setOpen={setAssistantsMenuOpen} />
      <div
        ref={ref}
        className={cn(`sidebar fixed top-0 left-0 bottom-0 right-0 z-10 w-[55px] h-screen bg-gray-700 ${assistantsMenuOpen ? "hidden" : ""} ${isHovered ? cn("w-[225px] shadow-2xl", hoverClassName) : ''}`, className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <Button
          onClick={() => { 
            setAssistantsMenuOpen(true);
            setIsHovered(false);
          }}
          variant="ghost"
          className="flex justify-start items-center max-w-full overflow-hidden gap-x-3 p-2"
        >
          <div className="flex items-center" >
            <RobotIcon className="w-5 h-5 text-slate-600"/>       
          </div>    
          <div className="text-sm text-slate-600 dark:text-slate-50">Assistants</div>
        </Button>
        <Button
          variant="ghost"
          className="flex justify-start items-center max-w-full overflow-hidden gap-x-3 p-2"
        >
          <div className="flex items-center" >
            <CounterClockwiseClockIcon className="w-5 h-5 text-slate-600"/>
          </div>    
          <div className="text-sm text-slate-600 dark:text-slate-50">History</div>
        </Button>
      </div>
    </>
  )
})

export { Sidebar }
