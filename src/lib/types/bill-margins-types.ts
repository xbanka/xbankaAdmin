// AIRTIME and DATA never carry a margin and cannot be changed. Every product
// below starts at a FIXED ₦100, switched on, so there is nothing to add first.
export const BILL_PRODUCTS = ["ELECTRICITY", "CABLE_TV", "BETTING"] as const;

export type BillProduct = (typeof BILL_PRODUCTS)[number];

export type BillMarginType = "PERCENTAGE" | "FIXED";

/** One row of GET /api/bills/margins. */
export interface BillMargin {
  product: BillProduct;
  marginType: BillMarginType;
  marginValue: number;
  isActive: boolean;
  /** What the margin adds to a ₦1,000 bill (0 when switched off). */
  sampleOn1000?: number;
  /** null until someone changes the default. */
  updatedAt?: string | null;
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
