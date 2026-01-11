import { TransactionFormValues } from "../schema/transaction.schema";

export function mapTransactionToApiPayload(data: TransactionFormValues) {
  const { customer, serviceType, details } = data;

  if (serviceType === "crypto") {
    const payload = {
      service_type: "crypto",
      customer_id: data.customer.id,
      amount_in: Number(details.customerAmount),
      vendor: details.vendor,
      customer_account: details.customerAccountWallet,
      xbanka_account: details.xbankaAccount,
      crypto_pair: details.transactionType,
      vendor_rate: Number(details.vendorRate),
      xbanka_rate: Number(details.xbankaRate),
    };

    if (data.customer?.affiliateAttribution) {
      payload.affiliate_source = data.customer.affiliateAttribution;
    }
    return payload;
  }

  if (serviceType === "gift-card") {
    const payload = {
        service_type: "gift_card",
      customer_id: customer.id,

      amount_in: Number(details.cardFaceValue),
      customer_account: details.customerAccountWallet,
      vendor: details.vendor,

      gift_card_type: details.cardType,
      gift_card_code: details.giftCardCode,
      currency: details.currency,
      quantity: details.quantity,

      vendor_rate: Number(details.vendorRate),
      xbanka_rate: Number(details.xbankaRate),
    }

    if (data.customer?.affiliateAttribution) {
      payload.affiliate_source = data.customer.affiliateAttribution;
    }
    return payload
  }

  throw new Error("Unsupported service type");
}
