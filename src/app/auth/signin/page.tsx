"use client"
import { FormLayout } from "@/components/layout/FormLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import z from "zod";

const SignIn = () => {

    const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
    })

type FormValues = z.infer<typeof formSchema>

  const handleSubmit = (values: FormValues) => {
    console.log(values)
  }
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription>Sign in to your KeKe account</CardDescription>
      </CardHeader>
      <CardContent>
        <FormLayout<FormValues>
          schema={formSchema}
          defaultValues={{ username: "" }}
          onSubmit={handleSubmit}
        >
          {(form) => (
            <>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    {/* <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage /> */}
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </>
          )}
        </FormLayout>
      </CardContent>
    </Card>
    // <div className="min-h-screen flex items-center justify-center p-4">
    //   <div className="w-full space-y-6">
    //     {/* Logo/Brand */}
    //     <div className="text-center space-y-2">
    //       <div className="flex items-center justify-center gap-2">
    //         <div className="bg-blue-600 p-3 rounded-full">Xbanka</div>
    //       </div>
    //       <h1 className="text-3xl font-bold text-gray-900">Xbanka</h1>
    //       <p className="text-gray-600">Xbanka</p>
    //     </div>

    //     {/* Auth Forms */}
    //     <FormLayout<FormValues>
    //       schema={formSchema}
    //       defaultValues={{ username: "" }}
    //       onSubmit={handleSubmit}
    //     >
    //       {(form) => (
    //         <>
    //           <FormField
    //             control={form.control}
    //             name="username"
    //             render={({ field }) => (
    //               <FormItem>
    //                 <FormLabel>Username</FormLabel>
    //                 <FormControl>
    //                   <Input placeholder="shadcn" {...field} />
    //                 </FormControl>
    //                 {/* <FormDescription>
    //                   This is your public display name.
    //                 </FormDescription>
    //                 <FormMessage /> */}
    //               </FormItem>
    //             )}
    //           />
    //           <Button type="submit">Submit</Button>
    //         </>
    //       )}
    //     </FormLayout>

    //     {/* Toggle Auth Mode */}
    //     <div className="text-center">
    //       <Button variant="link" className="text-sm">
    //         Dont have an account
    //       </Button>
    //     </div>
    //   </div>
    // </div>
  );
};

export default SignIn