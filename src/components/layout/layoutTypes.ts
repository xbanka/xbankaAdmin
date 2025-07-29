import { ZodTypeAny } from "zod/v3"
import { ReactNode } from "react"
import { useForm, UseFormProps, SubmitHandler, FieldValues } from "react-hook-form"
import type { LucideIcon } from "lucide-react"

export interface FormLayoutProps<T extends FieldValues> {
  schema: ZodTypeAny
  defaultValues: UseFormProps<T>["defaultValues"]
  onSubmit: SubmitHandler<T>
  children: (form: ReturnType<typeof useForm<T>>) => ReactNode
}

export interface SummaryCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: string
    isPositive: boolean
  }
  className?: string
}