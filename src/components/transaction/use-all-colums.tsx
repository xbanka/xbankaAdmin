import { formatDate } from "@/lib/formatDate";
import { TransactionRecord } from "./transaction-data";
import { StatusBadge } from "./badge";
import { TierBadge } from "./tier-badge";

export function useAllColumns(handleCustomerClick: (item: TransactionRecord, e: React.MouseEvent) => void) {
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
          <span className="text-[var(--text-teal)] text-sm font-medium hover:underline block">
            {item.customer?.first_name} {item.customer?.last_name}
          </span>
        </div>
      ),
    },
    {
      key: "tier_level",
      header: "Tier Level",
      className: "md:w-[100px]",
    //   render: (item: TransactionRecord) => <TierBadge tier={item.customer?.tier} />,
      render: (item: TransactionRecord) => <span>bam</span>,
    },
    {
      key: "details",
      header: "Details",
      className: "md:w-[200px]",
      render: (item: TransactionRecord) => (
        <div className="flex flex-col">
          <span className="text-xs font-medium text-gray-800">{item.service_type ?? item.service_type}</span>
          <div className="flex items-center gap-1 mt-0.5 flex-wrap">
            {/* {item.source && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                {item.source}
              </span>
            )}
            {item.channel && (
              <span className="text-[10px] text-gray-400">via {item.channel}</span>
            )} */}
            bam
          </div>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      className: "md:w-[110px]",
      render: (item: TransactionRecord) => (
        <span className="text-xs font-medium text-gray-800">{item.amount_in ?? item.amount_out}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      className: "md:w-[110px]",
      render: (item: TransactionRecord) => <StatusBadge status={item.status} />,
    },
    {
      key: "action",
      header: "",
      className: "md:w-[60px]",
      render: (item: TransactionRecord) => (
        <button className="text-xs text-[var(--text-teal)] hover:underline">View</button>
      ),
    },
  ];
}