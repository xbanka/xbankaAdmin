import { CreateTransactionPayload, CryptoTransactionPayload, GiftCardTransactionPayload } from "@/components/transaction/transaction-data";
import { TransactionFormValues } from "../schema/transaction.schema";

function assertCustomer(
  customer: TransactionFormValues["customer"]
): asserts customer is NonNullable<TransactionFormValues["customer"]> {
  if (!customer?.id) {
    throw new Error("Customer is required");
  }
}

function assertDetails(
  details: TransactionFormValues["details"]
): asserts details is NonNullable<TransactionFormValues["details"]> {
  if (!details) {
    throw new Error("Transaction details are required");
  }
}

export function mapTransactionToApiPayload(data: TransactionFormValues): CreateTransactionPayload {
  const { customer, serviceType, details } = data;

  assertCustomer(customer);
  assertDetails(details);

  if (serviceType === "crypto") {
    const payload: CryptoTransactionPayload = {
      service_type: "crypto",
      customer_id: customer.id ?? "",
      amount_in: Number(details.customerAmount),
      vendor: details.vendor,
      customer_account: details.customerAccountWallet,
      xbanka_account: details.xbankaAccount,
      crypto_pair: details.transactionType,
      vendor_rate: Number(details.vendorRate),
      xbanka_rate: Number(details.xbankaRate),
    };
    return payload;
  }

  if (serviceType === "gift-card") {
    const payload: GiftCardTransactionPayload = {
      service_type: "gift_card",
      customer_id: customer.id ?? "",

      amount_in: Number(details.cardFaceValue),
      customer_account: details.customerAccountWallet,
      vendor: details.vendor,

      gift_card_type: details.cardType,
      gift_card_code: details.giftCardCode,
      currency: details.currency,
      quantity: details.quantity,

      vendor_rate: Number(details.vendorRate),
      xbanka_rate: Number(details.xbankaRate),
    };

    return payload;
  }

  throw new Error("Unsupported service type");
}
