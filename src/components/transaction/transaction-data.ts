export interface TransactionRecord {
  id: string;

  affiliate_source: string;

  amount_in: string;        // "2000.00"
  amount_out: string;       // "40000.00"

  currency_in: string;      // "Dollar (USD)"
  currency_out: string;     // "NGN"

  attachment_url: string;

  service_type: "gift_card" | "crypto" | "bill_payments";

  status: "pending" | "completed" | "failed";

  vendor: string;

  created_at: string;       // ISO date string

  customer: {
    first_name: string;
    last_name: string;
    email: string;
    phone_no: string;
  };
}
