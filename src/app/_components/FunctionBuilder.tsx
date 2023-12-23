
import { useFormContext } from "react-hook-form";

// components
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Obj } from "../_functionBuilder/_components/FunctionInputs";
import { Separator } from "@/components/ui/separator";


export default function FunctionBuilder({ toolParentName }: { toolParentName: `tools.${number}.function` }) {
  const form = useFormContext();

  return (
    <>
      <h1 className="text-2xl font-bold text-slate-950 dark:text-slate-50">
        Function
      </h1>

      <FormField
        control={form.control}
        name={`${toolParentName}.name`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">
              Name
            </FormLabel>

            <FormControl>
              <Input {...field} className="w-[260px]" />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`${toolParentName}.description`}
        render={({ field }) => (
          <FormItem>
            <div className="relative">
              <FormLabel className="text-sm font-medium">
                Description
              </FormLabel>
            </div>
            <FormControl>
              <Input {...field} className="w-[260px]" />
            </FormControl>
          </FormItem>
        )}
      />

      <Separator className="my-6" />

      <h1 className="text-2xl font-bold text-slate-950 dark:text-slate-50">
        Parameters
      </h1>

      <Obj parentName={`${toolParentName}.parameters`} />
    </>
  )
}
