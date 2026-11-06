import {
  BILL_PRODUCTS,
  BillMargin,
  BillMarginHistoryMetadata,
  BillMarginHistoryPage,
  BillMarginType,
  BillProduct,
  UpdateBillMarginPayload,
} from "../types/bill-margins-types";

export const BILL_PRODUCT_LABELS: Record<BillProduct, string> = {
  AIRTIME: "Airtime",
  DATA: "Data",
  ELECTRICITY: "Electricity",
  CABLE_TV: "Cable TV",
  BETTING: "Betting",
};

export const MARGIN_TYPE_LABELS: Record<BillMarginType, string> = {
  PERCENTAGE: "Percentage",
  FIXED: "Fixed (₦)",
};

export const MIN_REASON_LENGTH = 3;

const FIELD_LABELS: Record<string, string> = {
  marginType: "Margin type",
  marginValue: "Margin value",
  isActive: "Status",
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

// The core backend's success bodies are passed through unchanged, so accept
// the payload bare or wrapped in the { data } envelope other routes use.
const unwrap = (body: unknown): unknown =>
  isRecord(body) && "data" in body ? body.data : body;

export const productLabel = (product: string | undefined | null) =>
  (product && BILL_PRODUCT_LABELS[product as BillProduct]) || product || "—";

export function formatMargin(
  type: BillMarginType | null | undefined,
  value: number,
): string {
  if (type === "PERCENTAGE") return `${value}%`;
  if (type === "FIXED") return `₦${value.toLocaleString("en-NG")}`;
  return "—";
}

/**
 * Always returns the five products in a stable order. A product the response
 * leaves out is shown as not configured rather than disappearing.
 */
export function normalizeMargins(body: unknown): BillMargin[] {
  const payload = unwrap(body);
  const list: unknown[] = Array.isArray(payload)
    ? payload
    : isRecord(payload) && Array.isArray(payload.items)
      ? payload.items
      : [];

  const byProduct = new Map<string, BillMargin>();
  for (const entry of list) {
    if (isRecord(entry) && typeof entry.product === "string") {
      byProduct.set(entry.product, entry as unknown as BillMargin);
    }
  }

  return BILL_PRODUCTS.map(
    (product) =>
      byProduct.get(product) ?? {
        product,
        configured: false,
        marginValue: 0,
        isActive: false,
      },
  );
}

export function normalizeHistory(
  body: unknown,
  requestedPage: number,
): BillMarginHistoryPage {
  const payload = unwrap(body);
  const source = isRecord(payload) ? payload : {};
  const items = Array.isArray(source.items) ? source.items : [];

  return {
    page: typeof source.page === "number" ? source.page : requestedPage,
    limit: typeof source.limit === "number" ? source.limit : 25,
    total: typeof source.total === "number" ? source.total : items.length,
    items,
  } as BillMarginHistoryPage;
}

export function parseHistoryMetadata(
  metadata: string | null | undefined,
): BillMarginHistoryMetadata {
  const empty: BillMarginHistoryMetadata = { changes: {} };
  if (!metadata) return empty;

  try {
    const parsed: unknown = JSON.parse(metadata);
    if (!isRecord(parsed)) return empty;
    return {
      product: typeof parsed.product === "string" ? parsed.product : undefined,
      source: typeof parsed.source === "string" ? parsed.source : undefined,
      created: parsed.created === true,
      changes: isRecord(parsed.changes)
        ? (parsed.changes as BillMarginHistoryMetadata["changes"])
        : {},
    };
  } catch {
    return empty;
  }
}

const formatChangeValue = (field: string, value: unknown): string => {
  if (value === null || value === undefined || value === "") return "—";
  if (field === "isActive") return value ? "Active" : "Inactive";
  if (field === "marginType") {
    return MARGIN_TYPE_LABELS[value as BillMarginType] ?? String(value);
  }
  return String(value);
};

/** "Margin value: 3 → 5" lines for one history entry. */
export function describeChanges(meta: BillMarginHistoryMetadata): string[] {
  return Object.entries(meta.changes).map(
    ([field, { from, to }]) =>
      `${FIELD_LABELS[field] ?? field}: ${
        meta.created ? "" : `${formatChangeValue(field, from)} → `
      }${formatChangeValue(field, to)}`,
  );
}

export interface MarginFormValues {
  marginType: BillMarginType;
  marginValue: string;
  isActive: boolean;
  reason: string;
}

export type MarginFormErrors = Partial<
  Record<"marginValue" | "reason", string>
>;

export function validateMarginForm(values: MarginFormValues): MarginFormErrors {
  const errors: MarginFormErrors = {};
  const raw = values.marginValue.trim();
  const value = Number(raw);

  if (raw === "" || Number.isNaN(value)) {
    errors.marginValue = "Enter a margin value.";
  } else if (value < 0) {
    errors.marginValue = "Margin cannot be negative.";
  } else if (values.marginType === "PERCENTAGE" && value > 100) {
    errors.marginValue = "A percentage margin cannot exceed 100.";
  }

  if (values.reason.trim().length < MIN_REASON_LENGTH) {
    errors.reason = `Give a reason of at least ${MIN_REASON_LENGTH} characters.`;
  }

  return errors;
}

/**
 * The PUT body: only fields that differ from what is saved, plus the reason.
 * Returns null when nothing changed, because the backend answers 400 to an
 * update that changes nothing.
 */
export function buildUpdatePayload(
  current: BillMargin,
  values: MarginFormValues,
): UpdateBillMarginPayload | null {
  const payload: UpdateBillMarginPayload = { reason: values.reason.trim() };
  let changed = false;

  if (values.marginType !== current.marginType) {
    payload.marginType = values.marginType;
    changed = true;
  }
  if (Number(values.marginValue) !== current.marginValue) {
    payload.marginValue = Number(values.marginValue);
    changed = true;
  }
  if (values.isActive !== current.isActive) {
    payload.isActive = values.isActive;
    changed = true;
  }

  return changed ? payload : null;
}
