'use client'

import { useState, useRef } from "react";
import { useQueryState } from "next-usequerystate";
import OpenAI from "openai";

// utils
import { api } from "~/trpc/react";

// components
import { Button } from "@/components/ui/button";
import { Spinner } from "@nextui-org/react";
import { Cross2Icon } from "@radix-ui/react-icons";

type UploadedFile = {
  id: string;
  name: string;
  status: "idle" | "loading" | "deleting";
}

export default function FileManagement() {
  const uploadFileRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [assistantId] = useQueryState("aid")

  const assistant = api.assistant.fetch.useQuery(
    { id: assistantId! },
    { enabled: !!assistantId },
  );
  api.file.list.useQuery(
    { fileIds: assistant.data?.file_ids ?? [] },
    { 
      enabled: !!assistant.data?.file_ids?.length,
      onSuccess: (data) => {
        const uploadedFiles = data.data.map(file => ({
          id: file.id,
          name: file.filename,
          status: "idle" as const,
        }))
        setFiles(prev => [...prev, ...uploadedFiles])
      }
    },
  )
  const deleteAssistantFile = api.file.delete.useMutation();
  const createAssistantFile = api.file.create.useMutation();
  const updateAssistant = api.assistant.update.useMutation();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) return;
    
    const id = crypto.randomUUID()
    setFiles(prev => [...prev, { id, name: file.name, status: "loading" }])

    try {
      const client = new OpenAI({
        apiKey: localStorage.getItem("openai-api-key")!,
        dangerouslyAllowBrowser: true,
      })
      const uploadedFile = await client.files.create({
        file,
        purpose: "assistants",
      })
      console.log("res: ", uploadedFile)
      
      // TODO: handle this properly
      if (!assistant.data!.tools.find(tool => tool.type === "retrieval")) {
        await updateAssistant.mutateAsync({ 
          id: assistantId!,
          tools: [...assistant.data!.tools, { type: "retrieval" }]
        });
      }
      const assistantFile = await createAssistantFile.mutateAsync({
        assistantId: assistantId!,
        fileId: uploadedFile.id,
      })

      setFiles(prev => prev.map(file => {
        if (file.id === id) {
          return {
            ...file,
            id: assistantFile.id,
            status: "idle" as const
          }
        }
        return file
      }))
    } catch (error) {
      console.log("error: ", error);
      setFiles(prev => prev.filter(file => file.id !== id))
    }
  };

  const removeFile = async (fileId: string) => {
    setFiles(prev => prev.map(file => {
      if (file.id === fileId) return {
        ...file,
        status: "deleting" as const,
      }
      return file
    }))
    await deleteAssistantFile.mutateAsync({ 
      assistantId: assistantId!,
      fileId,
    })
    if (files.length === 1) await updateAssistant.mutateAsync({
      id: assistantId!,
      tools: assistant.data!.tools.filter(tool => tool.type !== "retrieval")
    })
    setFiles(prev => prev.filter(file => file.id !== fileId))
  }

  return (
    <>
      <input
        type="file"
        className="hidden"
        id="file-upload"
        onChange={handleFileUpload}
        ref={uploadFileRef}
      />
      <Button onClick={() => uploadFileRef.current!.click()} type="button" variant="outline" size="sm" className="self-start">
        Upload
      </Button>
      
      <div className="flex flex-col">
        {files.map(file => (
          <div key={file.id} className="flex items-center gap-x-2 rounded-lg hover:bg-slate-100 p-2">
            <a href={`https://platform.openai.com/files/${file.id}`} target="_blank" className="text-sm" >{file.name}</a>
            {file.status === "loading" && <Spinner size="sm" />}
            {file.status === "deleting" && <Spinner size="sm" color="danger"/>}
            {file.status === "idle" && (
              <button type="button" onClick={() => removeFile(file.id)}>
                <Cross2Icon className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  )
}
