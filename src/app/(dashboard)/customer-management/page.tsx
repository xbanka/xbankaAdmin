"use client";

import { Button } from "@/components/ui/button";
import { useGetCustomer } from "@/lib/services/customer.service";
import { Input } from "@/components/ui/input";
import { DataTableLayout } from "@/components/DataTableLayout/DataTableLayout";
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import NewCustomerModal from "@/components/customer-management/NewCustomerModal";
import Header from "@/components/ui/Header";
import { Eye, Upload } from "lucide-react";
import { CustomerProps } from "@/lib/types/customer";
import EditCustomerModal from "@/components/customer-management/EditCustomerModal";
import DeleteCustomerModal from "@/components/customer-management/DeleteCustomerModal";
import { formatDate } from "@/lib/formatDate";
import Image from "next/image";
import { tierImages } from "@/lib/utils/tier-images";
import CustomerDetailsSidebar from "@/components/customer-management/customer-details-sidebar";

export default function CustomerManagement() {
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");
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
  console.log("data:", data?.data?.data?.items);

  const customers: CustomerProps[] = data?.data?.data?.items ?? [];
  const meta = data?.data?.data?.meta;
  console.log("meta:", meta);

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

            <Button className="text-[#111827]" size="sm" variant={"outline"}>
              <Upload />
              Export
            </Button>
          </div>
          {/* Search */}
          <div className="flex flex-col gap-2 lg:flex-row items-start justify-between">
            <div className="flex gap-2 w-full lg:w-[200px]">
              <Input
                placeholder="Search customers..."
                value={search}
                className=""
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button
              className="w-full lg:w-[161px] text-[#FFFFFF]"
              onClick={() => setOpenModal(true)}
            >
              + Add Customer
            </Button>
          </div>

          {/* Table */}
          <DataTableLayout<CustomerProps>
            data={customers}
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
