"use client";

import { Button } from "@/components/ui/button";
import { useGetCustomer } from "@/lib/services/customer.service";
import { Input } from "@/components/ui/input";
import { DataTableLayout } from "@/components/DataTableLayout/DataTableLayout";
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import NewCustomerModal from "@/components/customer-management/NewCustomerModal";
import Header from "@/components/ui/Header";
import { Eye, Search, Calendar, SlidersHorizontal, Download } from "lucide-react";
import { CustomerProps } from "@/lib/types/customer";
import EditCustomerModal from "@/components/customer-management/EditCustomerModal";
import DeleteCustomerModal from "@/components/customer-management/DeleteCustomerModal";
import { formatDate } from "@/lib/formatDate";
import Image from "next/image";
import { tierImages } from "@/lib/utils/tier-images";
import CustomerDetailsSidebar from "@/components/customer-management/customer-details-sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const fmtShort = (d: string) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
    : "Any";

export default function CustomerManagement() {
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [dateOpen, setDateOpen] = useState(false);
  const [advOpen, setAdvOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<"" | "newest" | "oldest">("");
  const [page, setPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerProps | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [customerDetailsOpen, setCustomerDetailsOpen] = useState(false);

  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null,
  );
  const { data, isLoading, isError, error } = useGetCustomer(search);

  const customers: CustomerProps[] = data?.data?.data?.items ?? [];
  const meta = data?.data?.data?.meta;

  // Client-side filtering + sorting on the loaded page.
  const displayedCustomers = customers
    .filter((c) => {
      if (tierFilter !== "all" && (c.tier ?? 0) !== Number(tierFilter))
        return false;
      if (statusFilter === "active" && !c.isEmailVerified) return false;
      if (statusFilter === "unverified" && c.isEmailVerified) return false;
      if (dateFrom && new Date(c.createdAt) < new Date(dateFrom)) return false;
      if (dateTo) {
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999);
        if (new Date(c.createdAt) > end) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (!sortOrder) return 0;
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sortOrder === "oldest" ? da - db : db - da;
    });

  const dateLabel =
    dateFrom || dateTo
      ? `${fmtShort(dateFrom)} – ${fmtShort(dateTo)}`
      : "Date joined";

  const clearAllFilters = () => {
    setSearch("");
    setTierFilter("all");
    setStatusFilter("all");
    setDateFrom("");
    setDateTo("");
    setSortOrder("");
    setAdvOpen(false);
  };

  const handleExport = () => {
    if (displayedCustomers.length === 0) return;
    const rows = displayedCustomers.map((c) => ({
      "Full Name": `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim() || "-",
      Email: c.email ?? "",
      "Phone Number": c.phoneNumber ?? "",
      "KYC Tier": c.tier ?? 0,
      Status: c.isEmailVerified ? "Active" : "Unverified",
      "Date Joined": formatDate(c.createdAt),
    }));
    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(","),
      ...rows.map((r) =>
        headers
          .map(
            (h) =>
              `"${String(r[h as keyof typeof r] ?? "").replace(/"/g, '""')}"`,
          )
          .join(","),
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "customers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const columns = [
    {
      key: "firstName",
      header: "Full Name",
      render: (item: CustomerProps) => (
        <div>
          {item.firstName ? `${item.firstName + " " + item.lastName}` : "-"}
        </div>
      ),
    },
    { key: "email", header: "Email" },
    {
      key: "phoneNumber",
      header: "Phone Number",
      render: (item: CustomerProps) => (
        <div>{item.phoneNumber ? item.phoneNumber : "-"}</div>
      ),
    },
    {
      key: "kyc",
      header: "KYC Tier",
      render: (item: CustomerProps) => {
        const tier = item.tier ?? 0;

        return (
          <Image
            src={tierImages[tier] || "/Tier0.svg"}
            alt={`Tier ${tier}`}
            width={67}
            height={24}
          />
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (item: CustomerProps) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
            item.isEmailVerified
              ? "bg-[#D1FAE5] text-[#037508]"
              : "bg-[#FFF8D8] text-[#B29504]"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {item.isEmailVerified ? "Active" : "Unverified"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Date Joined",
      render: (item: CustomerProps) => <div>{formatDate(item.createdAt)}</div>,
    },
    {
      key: "actions",
      header: "Action",
      render: (item: CustomerProps) => (
        <div
          onClick={() => {
            setSelectedCustomerId(item.userId);
            setCustomerDetailsOpen(true);
          }}
          className="flex items-center font-[500] text-[14px] leading-[22px] text-text-teal gap-2 cursor-pointer"
        >
          <Eye size={16} />
          View
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout breadcrumbs={[{ label: "Customer Management" }]}>
      <div className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-[24px]">
            <Header text="Customer Overview" />

            <Button
              className="text-[#FFFFFF]"
              onClick={() => setOpenModal(true)}
            >
              + Add Customer
            </Button>
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative w-full min-w-[240px] sm:w-auto sm:flex-1 sm:max-w-[360px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email or phone"
                value={search}
                className="h-10 pl-10"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Tier filter */}
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="h-10 w-[130px] border-[#E5E7EB] text-[#374151]">
                <SelectValue placeholder="All Tiers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="0">Tier 0</SelectItem>
                <SelectItem value="1">Tier 1</SelectItem>
                <SelectItem value="2">Tier 2</SelectItem>
                <SelectItem value="3">Tier 3</SelectItem>
              </SelectContent>
            </Select>

            {/* Status filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-10 w-[140px] border-[#E5E7EB] text-[#374151]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>

            {/* Date range */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDateOpen((o) => !o)}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#E5E7EB] px-3 text-[14px] text-[#374151] hover:bg-gray-50"
              >
                <Calendar className="h-4 w-4 text-gray-400" />
                {dateLabel}
              </button>
              {dateOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setDateOpen(false)}
                  />
                  <div className="absolute left-0 top-12 z-20 w-[260px] space-y-3 rounded-lg border border-[#E5E7EB] bg-white p-4 shadow-lg">
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-gray-500">
                        From
                      </label>
                      <input
                        type="date"
                        value={dateFrom}
                        max={dateTo || undefined}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="w-full rounded-md border border-[#E5E7EB] px-2 py-1.5 text-sm outline-none focus:border-[#2DD4BF]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-gray-500">
                        To
                      </label>
                      <input
                        type="date"
                        value={dateTo}
                        min={dateFrom || undefined}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="w-full rounded-md border border-[#E5E7EB] px-2 py-1.5 text-sm outline-none focus:border-[#2DD4BF]"
                      />
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => {
                          setDateFrom("");
                          setDateTo("");
                        }}
                        className="text-[12px] text-gray-500 hover:underline"
                      >
                        Clear
                      </button>
                      <button
                        onClick={() => setDateOpen(false)}
                        className="text-[12px] font-medium text-abstractCyan hover:underline"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Advanced filter */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setAdvOpen((o) => !o)}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#E5E7EB] px-3 text-[14px] text-[#374151] hover:bg-gray-50"
              >
                Advanced filter
                <SlidersHorizontal className="h-4 w-4 text-gray-400" />
              </button>
              {advOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setAdvOpen(false)}
                  />
                  <div className="absolute right-0 top-12 z-20 w-[200px] rounded-lg border border-[#E5E7EB] bg-white p-2 text-sm shadow-lg">
                    <p className="px-2 py-1 text-[11px] uppercase tracking-wide text-gray-400">
                      Sort by date joined
                    </p>
                    {(
                      [
                        ["newest", "Newest first"],
                        ["oldest", "Oldest first"],
                      ] as const
                    ).map(([val, label]) => (
                      <button
                        key={val}
                        onClick={() => {
                          setSortOrder(val);
                          setAdvOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left hover:bg-gray-50 ${
                          sortOrder === val
                            ? "text-abstractCyan font-medium"
                            : "text-[#374151]"
                        }`}
                      >
                        {label}
                        {sortOrder === val && <span>✓</span>}
                      </button>
                    ))}
                    <div className="my-1 border-t border-[#F0F0F0]" />
                    <button
                      onClick={clearAllFilters}
                      className="w-full rounded-md px-2 py-1.5 text-left text-[#EF4444] hover:bg-red-50"
                    >
                      Clear all filters
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Export */}
            <Button onClick={handleExport} className="ml-auto h-10 text-white">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>

          {/* Table */}
          <DataTableLayout<CustomerProps>
            data={displayedCustomers}
            columns={columns}
            rowKey={(item) => item.userId}
            isLoading={isLoading}
            isError={isError}
            errorMessage={error?.message ?? "Failed to load customers"}
            emptyMessage="No customers found."
            totalCount={meta?.totalItems}
            itemsPerPage={meta?.itemsPerPage}
            currentPage={page}
            onPageChange={setPage}
          />
        </div>
        <NewCustomerModal isOpen={openModal} onClose={handleClose} />
        <EditCustomerModal
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
          customer={selectedCustomer}
        />

        <DeleteCustomerModal
          isOpen={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          customer={selectedCustomer}
        />
      </div>
      <CustomerDetailsSidebar
        isOpen={customerDetailsOpen}
        customerId={selectedCustomerId}
        onClose={() => {
          setCustomerDetailsOpen(false);
          setSelectedCustomerId(null);
        }}
      />
    </DashboardLayout>
  );
}
