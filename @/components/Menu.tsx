'use client';

import { useState } from "react"
import { useQueryState } from "next-usequerystate";
import { api } from "~/trpc/react";

// components
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/ui/sidebar";

// icons
import RobotIcon from "@/icons/robot";
import { CounterClockwiseClockIcon } from "@radix-ui/react-icons";

export default function Menu() {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [assistantsMenuOpen, setAssistantsMenuOpen] = useState(false)

  const [assistantId, setAssistantId] = useQueryState("aid")

  const assistants = api.assistant.list.useQuery({})

  const handleAssistantClick = async (id: string) => {
    await setAssistantId(id);
    setAssistantsMenuOpen(false);
  }

  const handleMouseEnter = () => {
    const timeout = setTimeout(() => setIsHovered(true), 300); // 2000ms delayS
    setHoverTimeout(timeout);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout!);
    setIsHovered(false);
  };

  if (assistantsMenuOpen) {
    return (
    <Sidebar className="sidebar flex flex-col bg-slate-50 border-r border-r-slate-300 gap-y-2 py-4 px-2 w-[225px] shadow-2xl" >
     {!assistants.isLoading && assistants.data ? (
        <div className="flex flex-col gap-y-2">
          {assistants.data.data.map((assistant) => (
            <Button
              onClick={() => handleAssistantClick(assistant.id)}
              variant="ghost"
              className={`justify-start px-4 py-2 ${assistantId === assistant.id ? "bg-slate-100" : ""}`} key={assistant.id}
            >
              {assistant.name}: asst-{assistant.id.slice(-4)}
            </Button>
          ))}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </Sidebar>
    )
  }
  
  return (
    <Sidebar
      className={`sidebar flex flex-col bg-slate-50 border-r border-r-slate-300 gap-y-2 py-4 px-2 ${isHovered ? "w-[225px] shadow-2xl" : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Button
        onClick={() => setAssistantsMenuOpen(true)}
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
    </Sidebar>
  )
}
