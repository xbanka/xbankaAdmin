export const BILL_PRODUCTS = [
  "AIRTIME",
  "DATA",
  "ELECTRICITY",
  "CABLE_TV",
  "BETTING",
] as const;

export type BillProduct = (typeof BILL_PRODUCTS)[number];

export type BillMarginType = "PERCENTAGE" | "FIXED";

/** One row of GET /api/bills/margins. Unconfigured products have no type. */
export interface BillMargin {
  product: BillProduct;
  configured: boolean;
  marginType?: BillMarginType | null;
  marginValue: number;
  isActive: boolean;
  updatedAt?: string | null;
}

/** POST /api/bills/margins. `changedBy` is filled in by the server. */
export interface CreateBillMarginPayload {
  product: BillProduct;
  marginType: BillMarginType;
  marginValue: number;
  isActive?: boolean;
  reason: string;
}

/** PUT /api/bills/margins/{product}: only the changed fields, plus reason. */
export interface UpdateBillMarginPayload {
  marginType?: BillMarginType;
  marginValue?: number;
  isActive?: boolean;
  reason: string;
}

export interface BillMarginHistoryItem {
  adminEmail: string;
  /** The reason the admin gave for the change. */
  note: string;
  ip?: string | null;
  createdAt: string;
  /** JSON string: { product, source, created, changes }. */
  metadata?: string | null;
}

export interface BillMarginHistoryPage {
  page: number;
  limit: number;
  total: number;
  items: BillMarginHistoryItem[];
}

export interface BillMarginFieldChange {
  from: unknown;
  to: unknown;
}

export interface BillMarginHistoryMetadata {
  product?: string;
  source?: string;
  created?: boolean;
  changes: Record<string, BillMarginFieldChange>;
}
