"use client";

import { useState } from "react";
import { DataTableLayout } from "../../DataTableLayout/DataTableLayout";
import { SelectFieldLayout } from "../../forms/SelectFieldLayout";
import { useGetBillMarginHistory } from "@/lib/services/bill-margins.service";
import {
  BILL_PRODUCTS,
  BillMarginHistoryItem,
  BillProduct,
} from "@/lib/types/bill-margins-types";
import {
  BILL_PRODUCT_LABELS,
  describeChanges,
  parseHistoryMetadata,
  productLabel,
  sourceLabel,
} from "@/lib/utils/bill-margins";
import { formatDate } from "@/lib/formatDate";

const ALL = "ALL";

const PRODUCT_OPTIONS = [
  { label: "All products", value: ALL },
  ...BILL_PRODUCTS.map((p) => ({ label: BILL_PRODUCT_LABELS[p], value: p })),
];

export function BillMarginHistory() {
  const [product, setProduct] = useState<string>(ALL);
  const [page, setPage] = useState(1);

  const { data, isPending, error } = useGetBillMarginHistory(
    page,
    product === ALL ? undefined : (product as BillProduct),
  );

  const handleProductChange = (value: string) => {
    setProduct(value);
    setPage(1);
  };

  const columns = [
    {
      key: "createdAt",
      header: "Date & Time",
      className: "w-[140px]",
      render: (row: BillMarginHistoryItem) => (
        <div>
          <div className="text-[14px] font-medium leading-5 text-text-primary">
            {formatDate(row.createdAt)}
          </div>
          <div className="text-[12px] font-normal leading-[18px] text-[#9CA3AF]">
            {new Date(row.createdAt).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      ),
    },
    {
      key: "product",
      header: "Product",
      className: "w-[120px]",
      render: (row: BillMarginHistoryItem) => {
        const meta = parseHistoryMetadata(row.metadata);
        return (
          <div>
            <div className="text-[13px] font-medium text-[#111827]">
              {productLabel(meta.product)}
            </div>
            <div className="text-[11px] text-[#9CA3AF]">
              {sourceLabel(meta.source)}
            </div>
          </div>
        );
      },
    },
    {
      key: "changes",
      header: "Changes",
      className: "w-[260px]",
      render: (row: BillMarginHistoryItem) => {
        const lines = describeChanges(parseHistoryMetadata(row.metadata));
        return (
          <div className="text-[13px] text-[#111827] whitespace-normal space-y-0.5">
            {lines.length > 0 ? lines.map((l) => <div key={l}>{l}</div>) : "—"}
          </div>
        );
      },
    },
    {
      key: "note",
      header: "Reason",
      className: "w-[220px]",
      render: (row: BillMarginHistoryItem) => (
        <div
          className="text-[13px] text-[#111827] whitespace-normal"
          title={row.note}
        >
          {row.note || "—"}
        </div>
      ),
    },
    {
      key: "adminEmail",
      header: "Changed by",
      className: "w-[200px]",
      render: (row: BillMarginHistoryItem) => (
        <div>
          <div className="text-[12px] text-[#111827]" title={row.adminEmail}>
            {row.adminEmail}
          </div>
          {row.ip && <div className="text-[11px] text-[#9CA3AF]">{row.ip}</div>}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-2.5 mb-6">
        <SelectFieldLayout
          id="billMarginHistoryProduct"
          options={PRODUCT_OPTIONS}
          placeholder="All products"
          value={product}
          onChange={handleProductChange}
          className="w-full md:w-[180px]"
          selectClassName="border border-gray-300"
        />
      </div>
      <DataTableLayout
        data={data?.items ?? []}
        columns={columns}
        rowKey={(row) => `${row.createdAt}-${row.adminEmail}-${row.metadata}`}
        itemsPerPage={data?.limit ?? 25}
        totalCount={data?.total ?? 0}
        currentPage={page}
        onPageChange={setPage}
        emptyMessage="No bill margin changes recorded yet."
        isLoading={isPending}
        isError={!!error}
        errorMessage={error?.message || "Failed to load margin history."}
      />
    </div>
  );
}
