import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { Sidebar } from "@/components/ui/sidebar";

import { TRPCReactProvider } from "~/trpc/react";

// icons
import RobotIcon from "@/icons/robot";
import { CounterClockwiseClockIcon } from "@radix-ui/react-icons";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "GPT Builder",
  description: "Fastest way to build GPT assistnants",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} ml-[55px]`}>
        <TRPCReactProvider cookies={cookies().toString()}>
          <Sidebar
            className="flex flex-col bg-slate-50 border-r border-r-slate-300 gap-y-4 p-4"
          >
            <div className="flex items-center max-w-full overflow-hidden gap-x-3" >
              <div className="flex items-center" >
                <RobotIcon className="w-5 h-5 text-slate-600"/>       
              </div>    
              <div className="flex-grow text-sm font-semibold text-slate-950 dark:text-slate-50 min-w-0 overflow-hidden whitespace-nowrap">Assistants</div>
            </div>
            <div className="flex items-center max-w-full overflow-hidden gap-x-3" >
              <div className="flex items-center" >
                <CounterClockwiseClockIcon className="w-5 h-5 text-slate-600"/>
              </div>    
              <div className="text-sm font-semibold text-slate-950 dark:text-slate-50">History</div>
            </div>
          </Sidebar>
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}

