"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, FieldValues } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { FormLayoutProps } from "./LayoutTypes"
import z from "zod/v3"

export function FormLayout<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  children,
}: FormLayoutProps<T>) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {children(form)}
      </form>
    </Form>
  )
}
