'use client';

import { useForm, useFieldArray, type ControllerProps, useFormContext } from "react-hook-form";

// I think this works deadass
// Why was using zod types so hard for this usecase then???
type Schema = {
  name: string,
  description: string,
  type: "string" | "number" | "boolean" | "array" | "object",
  enum?: string[],
  properties?: Schema[],
  items?: Omit<Schema, "name" | "description">,
}

// The idea would be this
// Parent encapsulates everything + the form
// There are 3 main types: primitive, object, array
// Object can take on everything and uses an array
// Array can take on everything (minus the name and description) and uses just a plain object
// Now the nesting should not be too much of a problem since the types should be independent of each other, making it easier to nest together
const Functions = () => {
  const form = useForm<Schema>({
    defaultValues: {
      name: "",
      description: "",
      type: "string",
      enum: [],
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} >
    </form>
  )
}

const Obj = () => {
  const form = useFormContext<Schema>();
}

const Arr = () => {
  const form = useFormContext<Schema>();
}
