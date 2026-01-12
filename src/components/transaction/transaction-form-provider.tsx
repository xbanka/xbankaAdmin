"use client"

import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { transactionSchema } from "@/lib/schema/transaction.schema"
import { ReactNode } from "react"

export function TransactionFormProvider({ children }: {children: ReactNode}) {
  const methods = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      customer: {
        id: "",
        affiliateAttribution: "",
        assignedRep: "",
      },
      serviceType:  undefined,
      details: {},
    },
    mode: "onChange",
  })

  return <FormProvider {...methods}>{children}</FormProvider>
}
