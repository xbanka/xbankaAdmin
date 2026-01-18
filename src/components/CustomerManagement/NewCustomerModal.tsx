import { Mail, Phone, User } from "lucide-react";
import FormField from "../layout/FormField";
import { DialogLayout } from "../layout/modalLayout";
import { Button } from "../ui/button";
import { useCreateCustomer } from "@/lib/services/customer.service";
import { useForm } from "react-hook-form";
import {
  NewCustomerFormValues,
  newCustomerSchema,
} from "@/lib/schema/customer.schema";
import { zodResolver } from "@hookform/resolvers/zod";

interface NewCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewCustomerModal = ({ isOpen, onClose }: NewCustomerModalProps) => {
  const { mutate, isPending } = useCreateCustomer();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewCustomerFormValues>({
    resolver: zodResolver(newCustomerSchema),
  });

  const onSubmit = (values: NewCustomerFormValues) => {
    mutate(
      {
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        phone_no: values.phoneNumber,
        note: values.note,
        affiliate_username: values.username,
      },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      }
    );
  };

  return (
    <DialogLayout
      className=""
      open={isOpen}
      onClose={onClose}
      title="Add Customer"
      footer={
        <>
          <Button className="flex-1" onClick={onClose} variant="outline">
            Cancel
          </Button>

          <Button
            disabled={isPending}
            variant="default"
            className="flex-1"
            onClick={handleSubmit(onSubmit)}
          >
            {isPending ? "Saving..." : "Save"}
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
            error={errors.firstName}
          />
          <FormField
            id="lastName"
            label="Last Name"
            icon={User}
            placeholder="Last name"
            register={register}
            error={errors.lastName}
          />
        </div>
        <div className="flex items-center justify-between gap-5">
          <FormField
            id="email"
            label="Email"
            icon={Mail}
            placeholder="Email"
            register={register}
            error={errors.email}
          />
          <FormField
            id="phoneNumber"
            label="Phone Number"
            icon={Phone}
            placeholder="Phone Number"
            register={register}
            error={errors.phoneNumber}
          />
        </div>
        <FormField
            id="username"
            label="Affiliate Username"
            icon={User}
            placeholder="Affiliate username"
            register={register}
            error={errors.username}
          />
      </form>
    </DialogLayout>
  );
};

export default NewCustomerModal;
