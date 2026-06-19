import { formatDate } from "@/lib/formatDate";
import { TransactionRecord } from "./transaction-data";

export function useManualColumns(handleCustomerClick: (item: TransactionRecord, e: React.MouseEvent) => void) {
  return [
    {
      key: "txn_id",
      header: "Txn ID",
      className: "md:w-[130px]",
      render: (item: TransactionRecord) => (
        <span className="text-[var(--text-teal)] text-xs truncate block" title={item.txn_id}>
          {item.txn_id}
        </span>
      ),
    },
    {
      key: "created_at",
      header: "Date",
      className: "md:w-[110px]",
      render: (item: TransactionRecord) => (
        <span className="text-xs text-gray-600">{formatDate(item.created_at)}</span>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      className: "md:w-[130px]",
      render: (item: TransactionRecord) => (
        <div onClick={(e) => handleCustomerClick(item, e)} className="cursor-pointer">
          <span className="text-[var(--text-teal)] text-sm font-medium hover:underline">
            {item.customer?.first_name} {item.customer?.last_name}
          </span>
          {/* The "OTC" sub-label visible in design under some customer names */}
          {/* {item.source && (
            <span className="block text-[10px] text-gray-400">{item.source}</span>
          )} */}
          <span>ban</span>
        </div>
      ),
    },
    {
      key: "logged_by",
      header: "Logged By",
      className: "md:w-[110px]",
      render: (item: TransactionRecord) => (
        // <span className="text-xs text-gray-600">{item.logged_by ?? "—"}</span>
        <span>ban</span>
      ),
    },
    {
      key: "type",
      header: "Type",
      className: "md:w-[120px]",
      render: (item: TransactionRecord) => (
        // <span className="text-xs text-gray-700">{item.transaction_type ?? "—"}</span>
        <span>ban</span>
      ),
    },
    {
      key: "asset",
      header: "Asset",
      className: "md:w-[110px]",
      render: (item: TransactionRecord) => (
        // <span className="text-xs font-medium text-gray-700">{item.asset ?? "—"}</span>
        <span>ban</span>
      ),
    },
    {
      key: "customer_pays",
      header: "Customer Pays",
      className: "md:w-[130px]",
      render: (item: TransactionRecord) => (
        <span className="text-xs text-gray-800">{item.amount_in ?? "—"}</span>
      ),
    },
    {
      key: "customer_receives",
      header: "Customer Receives",
      className: "md:w-[140px]",
      render: (item: TransactionRecord) => (
        <span className="text-xs text-gray-800">{item.amount_out ?? "—"}</span>
      ),
    },
    {
      key: "channel",
      header: "Channel",
      className: "md:w-[110px]",
      render: (item: TransactionRecord) => (
        // <span className="text-xs text-gray-600">{item.channel ?? "—"}</span>
        <span>ban</span>
      ),
    },
  ];
}
