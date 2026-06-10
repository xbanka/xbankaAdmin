"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { User, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CustomerProps } from "@/lib/types/customer"
import FormField from "../forms/FormField"
import { DialogLayout } from "../layout/modalLayout"
import { zodResolver } from "@hookform/resolvers/zod"
import { NewCustomerFormValues, newCustomerSchema } from "@/lib/schema/customer.schema"

interface EditCustomerModalProps {
  isOpen: boolean
  onClose: () => void
  customer: CustomerProps | null
}

export default function EditCustomerModal({
  isOpen,
  onClose,
  customer,
}: EditCustomerModalProps) {
  const [isPending, setIsPending] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm<NewCustomerFormValues>({
    resolver: zodResolver(newCustomerSchema),
    defaultValues: {
      firstName: customer?.first_name || "",
      lastName: customer?.last_name || "",
      email: customer?.email || "",
      phoneNumber: customer?.phone_no || "",
      username: customer?.affiliate?.username || "",
    },
  })

  const onSubmit = async (data: NewCustomerFormValues) => {
    setIsPending(true)
    try {
      // Add your API call here
      console.log("Updating customer:", data)
      onClose()
    } catch (error) {
      console.error("Failed to update customer:", error)
    } finally {
      setIsPending(false)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
    console.log("close modal")
  }

  return (
    <DialogLayout
      className=""
      open={isOpen}
      onClose={handleClose}
      title="Edit Customer"
      footer={
        <>
          <Button className="flex-1 bg-transparent" onClick={handleClose} variant="outline">
            Cancel
          </Button>
          <Button
            disabled={isPending}
            variant="default"
            className="flex-1"
            onClick={handleSubmit(onSubmit)}
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </>
      }
    >
      <form className="space-y-5">
        <div className="flex items-center justify-between gap-5">
          <FormField
            id="firstName"
            label="First Name"
            icon={User}
            placeholder="First name"
            register={register}
            error={errors?.firstName}
          />
          <FormField
            id="lastName"
            label="Last Name"
            icon={User}
            placeholder="Last name"
            register={register}
            error={errors?.lastName}
          />
        </div>
        <div className="flex items-center justify-between gap-5">
          <FormField
            id="email"
            label="Email"
            icon={Mail}
            placeholder="Email"
            register={register}
            error={errors?.email}
          />
          <FormField
            id="phoneNumber"
            label="Phone Number"
            icon={Phone}
            placeholder="Phone Number"
            register={register}
            error={errors?.phoneNumber}
          />
        </div>
        <FormField
          id="username"
          label="Affiliate Username"
          icon={User}
          placeholder="Affiliate username"
          register={register}
          error={errors?.username}
        />
      </form>
    </DialogLayout>
  )
}
