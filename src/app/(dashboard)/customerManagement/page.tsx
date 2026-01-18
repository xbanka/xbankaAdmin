"use client";

import { Button } from "@/components/ui/button";
import { useGetCustomer } from "@/lib/services/customer.service";
import { Input } from "@/components/ui/input";
import { DataTableLayout } from "@/components/DataTableLayout/DataTableLayout";
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import NewCustomerModal from "@/components/CustomerManagement/NewCustomerModal";
import Header from "@/components/ui/Header";
import { Upload } from "lucide-react";
import { CustomerProps } from "@/lib/types/customer";

export default function CustomerManagement() {
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useGetCustomer(search);

  const customers: CustomerProps[] = data?.data ?? [];

  const handleClose = () => {
    setOpenModal(false);
  };

  const columns = [
    { key: "first_name", header: "First Name" },
    { key: "last_name", header: "Last Name" },
    { key: "email", header: "Email" },
    { key: "phone_no", header: "Phone Number" },
    {
      key: "affiliate",
      header: "Affiliate",
      render: (item: CustomerProps) =>
        item.affiliate?.username ? (
          <span className="font-medium">{item.affiliate.username}</span>
        ) : (
          <span className="text-gray-400">—</span>
        ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-[24px]">
          <Header text="Customer Overview" />

          <Button size="sm" variant={"outline"}>
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
            className="w-full lg:w-[161px]"
            onClick={() => setOpenModal(true)}
          >
            + Add Customer
          </Button>
        </div>

        {/* Table */}
        <DataTableLayout<CustomerProps>
          data={customers}
          columns={columns}
          rowKey={(item) => item.id}
          isLoading={isLoading}
          isError={isError}
          errorMessage={error?.message ?? "Failed to load customers"}
          // totalCount={customerBody.total}
          currentPage={page}
          onPageChange={setPage}
          emptyMessage="No customers found."
        />
      </div>
      <NewCustomerModal isOpen={openModal} onClose={handleClose} />
    </DashboardLayout>
  );
}
