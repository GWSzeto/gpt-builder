
import { Sidebar } from "@/components/ui/sidebar";
import GptBuilderForm from "./_components/GptBuilder";
import GptChat from "./_components/GptChat";

// icons
import RobotIcon from "@/icons/robot";
import { CounterClockwiseClockIcon } from "@radix-ui/react-icons";

export default function Home() {
  return (
    <main className="flex min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-900 dark:text-slate-50">
      <Sidebar
        className="flex flex-col bg-slate-50 border-r border-r-slate-300 gap-y-4 p-4"
      >
        <div className="flex items-center max-w-full overflow-hidden gap-x-3" >
          <div className="flex items-center" >
            <RobotIcon className="w-5 h-5 text-slate-600"/>       
          </div>    
          <div className="flex-grow text-sm font-semibold text-slate-950 dark:text-slate-50 min-w-0 overflow-hidden whitespace-nowrap">Assistants</div>
        </div>
        <div className="flex items-center gap-x-3" >
          <div className="flex items-center" >
            <CounterClockwiseClockIcon className="w-5 h-5 text-slate-600"/>
          </div>    
          <span className="text-sm font-semibold text-slate-950 dark:text-slate-50">History</span>
        </div>
      </Sidebar>
      <GptBuilderForm />
      <GptChat />
    </main>
  );
}

