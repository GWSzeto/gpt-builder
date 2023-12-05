'use client'

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { twilight } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { CopyIcon } from '@radix-ui/react-icons';

// components
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// icons
import { RocketIcon } from "@radix-ui/react-icons"; 

type ExportCodeProps = {
  nodeCode: string;
  pythonCode: string;
}

export default function ExportCode({ nodeCode, pythonCode }: ExportCodeProps ) {
  const [language, setLanguage] = useState<'javascript' | 'python'>('javascript');
  const code = language === 'javascript' ? nodeCode : pythonCode;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <RocketIcon className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-y-6">
        <DialogHeader>
          <DialogTitle>Ready to launch!</DialogTitle>
          <DialogDescription>
            Just copy the code and paste it into your backend
          </DialogDescription>
        </DialogHeader>

        <div>
          <div className="flex items-center ml-4" >
            <button className={`rounded-t-xl text-sm px-4 py-2 -mb-[1px] ${language === 'javascript' ? 'text-slate-50 bg-black' : 'text-slate-950 bg-white'}`} onClick={() => setLanguage('javascript')}>Node</button>
            <button className={`rounded-t-xl text-sm px-4 py-2 -mb-[1px] ${language === 'python' ? 'text-slate-50 bg-black' : 'text-slate-950 bg-white'}`} onClick={() => setLanguage('python')}>Python</button>
          </div>
          <div className="relative">
            <button onClick={copyToClipboard} className="absolute top-3 right-3">
              <CopyIcon className="text-white"/>
            </button>
            <SyntaxHighlighter language={language} style={twilight} customStyle={{ border: 0, margin: 0 }}>
              {code}
            </SyntaxHighlighter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


