// // @ts-ignore
// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { Form } from "@/components/ui/form";
// import z from "zod";

// export function FormLayout({ schema, defaultValues, onSubmit, children }) {
//   const form = useForm<z.infer<typeof schema>>({
//     resolver: zodResolver(schema),
//     defaultValues,
//   });

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//         {children(form)}
//       </form>
//     </Form>
//   );
// }
