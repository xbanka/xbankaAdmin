import { formatDate } from "@/lib/formatDate";
import { TransactionRecord } from "./transaction-data";

export function useFiatColumns(
  handleCustomerClick: (item: TransactionRecord, e: React.MouseEvent) => void,
) {
  return [
    {
      key: "txn_id",
      header: "Txn ID",
      className: "md:w-[130px]",
      render: (item: TransactionRecord) => (
        <span
          className="text-[var(--text-teal)] text-xs truncate block"
          title={item.txn_id}
        >
          {item.txn_id}
        </span>
      ),
    },
    {
      key: "created_at",
      header: "Date",
      className: "md:w-[110px]",
      render: (item: TransactionRecord) => (
        <span className="text-xs text-gray-600">
          {formatDate(item.created_at)}
        </span>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      className: "md:w-[130px]",
      render: (item: TransactionRecord) => (
        <div
          onClick={(e) => handleCustomerClick(item, e)}
          className="cursor-pointer"
        >
          <span className="text-[var(--text-teal)] text-sm font-medium hover:underline">
            {item.customer?.first_name} {item.customer?.last_name}
          </span>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      className: "md:w-[110px]",
      render: (item: TransactionRecord) => (
        <span className="text-xs text-gray-700">
          {/* {item.transaction_type ?? "—"} */}
          {"—"}
        </span>
      ),
    },
    {
      key: "direction",
      header: "Direction",
      className: "md:w-[90px]",
      render: (item: TransactionRecord) => (
        <span
        //   className={`text-xs font-medium ${item.direction === "Credit" ? "text-[var(--success-text)]" : "text-[var(--mainRed)]"}`}
          className={`text-xs font-medium`}
        >
          {/* {item.direction ?? "—"} */}
          {"—"}
        </span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      className: "md:w-[110px]",
      render: (item: TransactionRecord) => (
        <span className="text-xs font-medium text-gray-800">
          {item.amount_in ?? item.amount_out}
        </span>
      ),
    },
    {
      key: "channel",
      header: "Channel",
      className: "md:w-[140px]",
      render: (item: TransactionRecord) => (
        // <span className="text-xs text-gray-600">{item.channel ?? "—"}</span>
        <span className="text-xs text-gray-600">{"—"}</span>
      ),
    },
    {
      key: "provider",
      header: "Provider",
      className: "md:w-[110px]",
      render: (item: TransactionRecord) => (
        // <span className="text-xs text-gray-600">{item.provider ?? "—"}</span>
        <span className="text-xs text-gray-600">{"—"}</span>
      ),
    },
  ];
}
