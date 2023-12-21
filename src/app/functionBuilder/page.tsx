'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// utils
import { formSchema } from "./_components/types";

// components
import { Form } from "@/components/ui/form"; 
import FunctionBuilderForm from "./_components/FunctionBuilderForm";
import Viewer from "./_components/Viewer";

export default function Home() {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      functions: [{
        type: "string",
        name: "",
        description: "",
      }],
    },
  });

  return (
    <Form {...form}>
      <form className="flex bg-slate-50 text-slate-950 dark:bg-slate-900 dark:text-slate-50 ml-[55px]">
        <FunctionBuilderForm />
        <Viewer />
      </form>
    </Form>
  );
}

