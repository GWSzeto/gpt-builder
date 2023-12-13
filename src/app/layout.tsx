import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { Sidebar } from "@/components/ui/sidebar";

import { TRPCReactProvider } from "~/trpc/react";

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
          <Sidebar className="flex flex-col bg-slate-50 border-r border-r-slate-300 gap-y-2 py-4 px-2" /> 
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}


