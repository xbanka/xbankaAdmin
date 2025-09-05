"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useMutation } from "@tanstack/react-query"
import { verifyEmailAction } from "@/lib/actions/actions"
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})

const InputOTPForm = () => {
    const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  })

  const { mutate, isPending } = useMutation({
      mutationFn: (data: string) => verifyEmailAction(data),
      onSuccess: (result) => {
        if (!result.success) {
          // Show API error in alert
          console.log(result.message);
          toast.error(result.message)
          //   setErrorMessage(result.message)
        } else {
          console.log("Signup success!", result.data);
          toast.success("Success")
          router.push("/auth/signin");
          form.reset();
        }
      },
      onError: (err) => {
        console.log("Signup failed:", err);
      },
    });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    mutate(data.pin)
    toast("You submitted the following values", {
      description: (
        <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto mt-[250px] w-2/3 space-y-6 flex flex-col items-center justify-center">
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem className="mx-auto flex flex-col items-center justify-center">
              <FormLabel className="mx-auto">One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription className="mx-auto">
                Please enter the token sent to your email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isPending} className="mx-auto justify-center" type="submit">{isPending ? "Submitting..." : "Submit"}</Button>
      </form>
    </Form>
  )
}

export default InputOTPForm