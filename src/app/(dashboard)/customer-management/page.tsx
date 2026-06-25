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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomerProps } from "@/lib/types/customer";
import EditCustomerModal from "@/components/customer-management/EditCustomerModal";
import DeleteCustomerModal from "@/components/customer-management/DeleteCustomerModal";
import CustomerDetailModal from "@/components/customer-management/CustomerDetailModal";
import { formatDate } from "@/lib/formatDate";
import Image from "next/image";
import { tierImages } from "@/lib/utils/tier-images";

export default function CustomerManagement() {
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerProps | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const { data, isLoading, isError, error } = useGetCustomer(search);
  console.log("data:", data?.data?.data?.items);

  const customers: CustomerProps[] = data?.data?.data?.items ?? [];
  const meta = data?.data?.data?.meta;
  console.log("meta:", meta);

  // Client-side tier filtering on the loaded page.
  const displayedCustomers = customers.filter((c) => {
    if (tierFilter !== "all" && (c.tier ?? 0) !== Number(tierFilter))
      return false;
    return true;
  });

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
      key: "createdAt",
      header: "Date Joined",
      render: (item: CustomerProps) => <div>{formatDate(item.createdAt)}</div>,
    },
    {
      key: "actions",
      header: "Action",
      render: (item: CustomerProps) => (
        <button
          onClick={() => {
            setSelectedCustomer(item);
            setDetailOpen(true);
          }}
          className="flex items-center font-[500] text-[14px] leading-[22px] text-text-teal gap-2 hover:underline"
        >
          <Eye size={16} />
          View
        </button>
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
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            {/* Date range */}
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#E5E7EB] px-3 text-[14px] text-[#374151] hover:bg-gray-50"
            >
              <Calendar className="h-4 w-4 text-gray-400" />
              Oct 1 - Oct 31
            </button>

            {/* Advanced filter */}
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#E5E7EB] px-3 text-[14px] text-[#374151] hover:bg-gray-50"
            >
              Advanced filter
              <SlidersHorizontal className="h-4 w-4 text-gray-400" />
            </button>

            {/* Export */}
            <Button className="ml-auto h-10 text-white">
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
            emptyMessage="No transactions found."
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

        <CustomerDetailModal
          isOpen={detailOpen}
          onClose={() => setDetailOpen(false)}
          customer={selectedCustomer}
        />
      </div>
    </DashboardLayout>
  );
}
