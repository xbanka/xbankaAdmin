import z from "zod";

export const ServiceTypeEnum = z.enum([
  "crypto",
  "gift-card",
  "bill-payments",
])
