"use client";
import type React from "react";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { HeaderActions } from "../notifications-panel/header-actions";
import { DialogLayout } from "./modalLayout";
import { Button } from "../ui/button";
import { ConfirmPayoutSidebar } from "../finance/confirm-payout-sidebar";
import { PayoutDetailsSidebar } from "../finance/payout-details-sidebar";
import {
  useIndividualPayout,
  useProcessPayout,
  useRejectPayout,
} from "@/lib/services/payout.service";
import { usePayoutSidebarStore } from "@/store/usePayoutSidebarStore";
import { useState } from "react";
import { LucideIcon } from "lucide-react";
import { useNotificationDrawerStore } from "@/store/useNotificationDrawerStore";
import { SpreadApprovalDrawer } from "../notifications-panel/spread-approval-drawer";

interface DashboardLayoutProps {
  children?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  href?: string;
  title?: string;
  isPending?: boolean;
  error?: string | null;
  icon?: LucideIcon;
  id?: string | number;
}

export function DashboardLayout({
  children,
  breadcrumbs = [],
  isPending,
  error,
  icon: Icon,
  id,
  href,
}: DashboardLayoutProps) {
  const [openModal, setOpenModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const { notification, close } = useNotificationDrawerStore();
  const {
    isDetailsOpen,
    isConfirmOpen,
    openConfirmSidebar,
    closeDetailsSidebar,
    closeConfirmSidebar,
    selectedPayoutId,
  } = usePayoutSidebarStore();
  const {
    data: individualPayout,
    isPending: individualPayoutPending,
    error: individualPayoutError,
  } = useIndividualPayout(selectedPayoutId ?? null);

  const payout = individualPayout?.data;

  const { mutate: processPayoutMutation, isPending: processingPayout } =
    useProcessPayout();
  const { mutate: rejectPayoutMutation, isPending: rejectingPayout } =
    useRejectPayout();

  const handleProcessPayout = () => {
    closeDetailsSidebar();
    openConfirmSidebar();
  };

  const handleConfirmPayout = () => {
    setOpenModal(true);
  };

  const handleDeclinePayout = () => {
    closeDetailsSidebar();
    setRejectModal(true);
  };

  const handleReject = () => {
    if (!payout) return;

    rejectPayoutMutation(payout.id, {
      onSuccess: () => {
        setRejectModal(false);
        closeConfirmSidebar();
        closeDetailsSidebar();
      },
    });
  };

  const handlePayout = () => {
    if (!payout) return;

    processPayoutMutation(payout.id, {
      onSuccess: () => {
        setOpenModal(false);
        closeConfirmSidebar();
        closeDetailsSidebar();
      },
    });
  };
  return (
    <div className="w-full flex-1 min-w-0">
      <SidebarInset className="max-w-full flex-1 min-w-0">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            {Icon ? (
              <BreadcrumbItem className="flex items-center gap-2 mb-4">
                <BreadcrumbLink href={href} className="flex items-center">
                  <Icon className="w-5 h-5 cursor-pointer text-gray-600" />
                  {id && (
                    <h2 className="text-lg font-semibold text-gray-900">
                      {id}
                    </h2>
                  )}
                </BreadcrumbLink>
              </BreadcrumbItem>
            ) : (
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center">
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {crumb.href ? (
                        <BreadcrumbLink href={crumb.href}>
                          {crumb.label}
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  </div>
                ))}
              </BreadcrumbList>
            )}
          </Breadcrumb>
          <HeaderActions />
        </header>
        <div className="w-full bg-off-white min-w-0 min-h-screen">
          {/* Handle loading */}
          {isPending && (
            <div className="flex flex-1 items-center justify-center text-gray-500">
              Loading...
            </div>
          )}

          {/* Handle error */}
          {error && !isPending && (
            <div className="flex flex-1 items-center justify-center text-red-500">
              {error || "Something went wrong"}
            </div>
          )}

          {/* Render children only if no error and not loading */}
          {!isPending && !error && (
            <div className="block w-full max-w-full min-w-0">{children}</div>
          )}

          {/* {notification?.type === "spread-approval" && (
            <SpreadApprovalDrawer notification={notification} onClose={close} />
          )} */}

          {payout && (
            <PayoutDetailsSidebar
              isOpen={isDetailsOpen}
              onClose={closeDetailsSidebar}
              payout={payout}
              onDecline={handleDeclinePayout}
              onProcess={handleProcessPayout}
              loading={individualPayoutPending}
              error={individualPayoutError?.message || ""}
            />
          )}

          {payout && (
            <ConfirmPayoutSidebar
              isOpen={isConfirmOpen}
              onClose={closeConfirmSidebar}
              payout={payout}
              onConfirm={handleConfirmPayout}
              loading={false}
              error={""}
            />
          )}

          <DialogLayout
            open={openModal}
            onClose={() => setOpenModal(false)}
            title="Process Payout"
            footer={
              <div className="w-full flex gap-[20px]">
                <Button
                  onClick={() => setOpenModal(!openModal)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>

                <Button
                  disabled={processingPayout}
                  variant="default"
                  onClick={handlePayout}
                  className="flex-1"
                >
                  {processingPayout ? "Confirming..." : "Confirm"}
                </Button>
              </div>
            }
          >
            <h1>Are you sure you want to confirm payout</h1>
          </DialogLayout>
          <DialogLayout
            open={rejectModal}
            onClose={() => setRejectModal(false)}
            title="Reject Payout"
            footer={
              <div className="w-full flex gap-[20px]">
                <Button
                  onClick={() => setRejectModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>

                <Button
                  disabled={rejectingPayout}
                  variant="destructive"
                  onClick={handleReject}
                  className="flex-1"
                >
                  {processingPayout ? "Rejecting..." : "Reject"}
                </Button>
              </div>
            }
          >
            <h1>Are you sure you want to reject payout</h1>
          </DialogLayout>
        </div>
      </SidebarInset>
    </div>
  );
}
