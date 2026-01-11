import z from "zod";

export const ServiceTypeEnum = z.enum([
  "crypto",
  "gift-card",
  "bill-payments",
])

export type ServiceType = "crypto" | "gift-card" | "bill-payments";
