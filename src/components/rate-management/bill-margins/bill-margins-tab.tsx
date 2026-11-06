"use client";

import { useState } from "react";
import { Edit, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { DataTableLayout } from "../../DataTableLayout/DataTableLayout";
import { Badge } from "../badge";
import { useGetBillMargins } from "@/lib/services/bill-margins.service";
import { BillMargin } from "@/lib/types/bill-margins-types";
import {
  MARGIN_TYPE_LABELS,
  formatMargin,
  productLabel,
} from "@/lib/utils/bill-margins";
import { formatDate } from "@/lib/formatDate";
import { BillMarginHistory } from "./bill-margin-history";
import { MarginModal, ToggleMarginModal } from "./margin-modal";

type SubView = "margins" | "history";

const SUB_VIEWS: { key: SubView; label: string }[] = [
  { key: "margins", label: "Margins" },
  { key: "history", label: "Change history" },
];

/**
 * Super Admin only (the API answers 403 to anyone else); the parent decides
 * whether to render this at all.
 */
export function BillMarginsTab() {
  const [subView, setSubView] = useState<SubView>("margins");
  const [editRow, setEditRow] = useState<BillMargin | null>(null);
  const [toggleRow, setToggleRow] = useState<BillMargin | null>(null);

  const { data, isPending, error } = useGetBillMargins();

  const columns = [
    {
      key: "product",
      header: "Product",
      className: "w-[160px]",
      render: (row: BillMargin) => (
        <div className="font-semibold text-[13px] text-[#111827]">
          {productLabel(row.product)}
        </div>
      ),
    },
    {
      key: "marginType",
      header: "Type",
      render: (row: BillMargin) =>
        row.configured && row.marginType
          ? MARGIN_TYPE_LABELS[row.marginType]
          : "—",
    },
    {
      key: "marginValue",
      header: "Margin",
      render: (row: BillMargin) =>
        row.configured ? formatMargin(row.marginType, row.marginValue) : "—",
    },
    {
      key: "status",
      header: "Status",
      render: (row: BillMargin) =>
        row.configured ? (
          <Badge
            active={row.isActive}
            text={row.isActive ? "Active" : "Inactive"}
          />
        ) : (
          <span className="text-[12px] text-[#9CA3AF]">Not configured</span>
        ),
    },
    {
      key: "updatedAt",
      header: "Last updated",
      render: (row: BillMargin) =>
        row.configured && row.updatedAt ? formatDate(row.updatedAt) : "—",
    },
    {
      key: "actions",
      header: "Action",
      render: (row: BillMargin) => (
        <button
          onClick={() => setEditRow(row)}
          className="flex items-center gap-1 leading-[22px] text-[14px] text-text-primary-font-color font-medium hover:opacity-70 transition-opacity"
        >
          {row.configured ? (
            <>
              <Edit size={16} className="text-[#004C99]" /> Edit
            </>
          ) : (
            <>
              <Plus size={16} className="text-[#004C99]" /> Add margin
            </>
          )}
        </button>
      ),
    },
    {
      key: "toggle",
      header: "",
      className: "w-[80px]",
      render: (row: BillMargin) =>
        row.configured ? (
          <button
            onClick={() => setToggleRow(row)}
            className={cn(
              "w-10 h-[22px] rounded-full relative transition-colors flex-shrink-0",
              row.isActive ? "bg-[#0D9488]" : "bg-[#D1D5DB]",
            )}
            role="switch"
            aria-checked={row.isActive}
            aria-label={`Toggle ${productLabel(row.product)} margin`}
          >
            <span
              className={cn(
                "absolute top-[3px] w-4 h-4 bg-white rounded-full transition-all",
                row.isActive ? "right-[3px]" : "left-[3px]",
              )}
            />
          </button>
        ) : null,
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-1 rounded-lg border border-[#E5E7EB] p-1 w-fit">
          {SUB_VIEWS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSubView(key)}
              className={cn(
                "px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors",
                subView === key
                  ? "bg-[#F0FDFA] text-text-primary"
                  : "text-text-secondary hover:text-text-primary",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="hidden md:block text-[12px] text-text-secondary">
          XBanka&apos;s margin on top of what the provider charges for each bill
          payment.
        </p>
      </div>

      {subView === "margins" ? (
        <DataTableLayout
          data={data ?? []}
          columns={columns}
          rowKey={(row) => row.product}
          itemsPerPage={10}
          totalCount={data?.length ?? 0}
          emptyMessage="No bill margins found."
          isLoading={isPending}
          isError={!!error}
          errorMessage={error?.message || "Failed to load bill margins."}
        />
      ) : (
        <BillMarginHistory />
      )}

      {editRow && (
        <MarginModal margin={editRow} onClose={() => setEditRow(null)} />
      )}
      {toggleRow && (
        <ToggleMarginModal
          margin={toggleRow}
          onClose={() => setToggleRow(null)}
        />
      )}
    </div>
  );
}
