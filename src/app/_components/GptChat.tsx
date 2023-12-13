'use client';

import { useState } from "react";
import { useQueryState } from "next-usequerystate";

// utils
import { api } from "~/trpc/react";

// components
import InitialPromo from "./InitialPromo";
import GptInput from "./GptInput";

// icons
import HumanIcon from "@/icons/human";
import ChatGptIcon from "@/icons/chatGpt";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function GptChat() {
  const [messages, setMessages] = useState<Message[]>([]); 
  const [threadId] = useQueryState("tid");

  api.message.list.useQuery(
    { threadId: threadId! },
    { 
      enabled: !!threadId,
      onSuccess: (data) => {
        setMessages(data);
      }
    },
  )
  
  return (
    <section className="relative w-[calc(50%-50px)] flex-col px-8 py-20">
      <InitialPromo />
      
      <div className="flex flex-col gap-y-12">
        {messages.map(({ id, role, content }) => (
          <div className="flex flex-col gap-y-2" key={id}>
            <div className="flex items-center gap-x-2">
              {role === "user" ? (
                <div className="p-1 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                  <HumanIcon className="w-4 h-4" /> 
                </div>
              ) : (
                <div className="p-1 bg-[#ab68ff] rounded-full flex items-center justify-center text-white">
                  <ChatGptIcon className="w-4 h-4"/>
                </div>
              )}

              <span className="font-semibold text-slate-950 dark:text-slate-50">
                {role === "user" ? "You" : "GPT"}
              </span>
            </div>
            
            <span className="ml-8 text-slate-950 dark:text-slate-50">
              {content}
            </span>
          </div>
        ))}
      </div>
      
      <GptInput setMessages={setMessages} />
    </section>
  )
}

