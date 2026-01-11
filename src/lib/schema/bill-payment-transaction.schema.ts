// lib/schemas/bill-payment-transaction.schema.ts
import { z } from "zod";

export const billPaymentTransactionSchema = z.object({

    serviceType: z.literal("bill-payments"),
    billCategory: z.string().min(1, "Bill category is required"),
    vendor: z.string().min(1, "Vendor is required"),
    quantity: z.string().min(1, "Quantity is required"),
    meterNumber: z.string().min(1, "Meter number is required"),
    meterType: z.string().min(1, "Meter type is required"),
    amountToPay: z.string().min(1, "Amount to pay is required"),
    transactionFee: z.string().min(1, "Transaction fee is required"),
    receivingAccountWallet: z.string().min(1, "Receiving account is required"),
    paymentDate: z.string().min(1, "Payment date is required"),

});

export type BillPaymentTransactionFormValues = z.infer<
  typeof billPaymentTransactionSchema
>;
