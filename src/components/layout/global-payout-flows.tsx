"use client";

import { useState } from "react";
import { DialogLayout } from "./modalLayout";
import { Button } from "../ui/button";
import { ConfirmPayoutSidebar } from "../finance/confirm-payout-sidebar";
import { PayoutDetailsSidebar } from "../finance/payout-details-sidebar";
import { SpreadApprovalDrawer } from "../notifications-panel/spread-approval-drawer";
import {
  useIndividualPayout,
  useProcessPayout,
  useRejectPayout,
} from "@/lib/services/payout.service";
import {
  useApproveRateProposal,
  useRejectRateProposal,
  UseGetRateProposalDetails,
} from "@/lib/services/rates.service";
import { usePayoutSidebarStore } from "@/store/usePayoutSidebarStore";
import { useRateProposalSidebarStore } from "@/store/useRateProposalSidebarStore";
import { usePermissions } from "@/hooks/usePermissions";

/**
 * Payout and rate-proposal approval flows, opened from notifications on any
 * page. Mounted once in the (dashboard) route layout, like
 * GlobalCustomerSidebar.
 */
export function GlobalPayoutFlows() {
  const [openModal, setOpenModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const { hasPermission } = usePermissions();

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

  const {
    isOpen: isRateProposalOpen,
    selectedProposalId,
    closeSidebar: closeRateProposalSidebar,
  } = useRateProposalSidebarStore();
  const {
    data: rateProposalDetails,
    isPending: rateProposalDetailsPending,
  } = UseGetRateProposalDetails(selectedProposalId ?? undefined);
  const { mutate: approveRateProposalMutation, isPending: approvingProposal } =
    useApproveRateProposal();
  const { mutate: rejectRateProposalMutation, isPending: decliningProposal } =
    useRejectRateProposal();

  const handleApproveProposal = () => {
    if (!selectedProposalId) return;
    approveRateProposalMutation(selectedProposalId, {
      onSuccess: () => closeRateProposalSidebar(),
    });
  };

  const handleDeclineProposal = () => {
    if (!selectedProposalId) return;
    rejectRateProposalMutation(selectedProposalId, {
      onSuccess: () => closeRateProposalSidebar(),
    });
  };

  const handleProcessPayout = () => {
    closeDetailsSidebar();
    openConfirmSidebar();
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
    <>
      <PayoutDetailsSidebar
        isOpen={isDetailsOpen}
        onClose={closeDetailsSidebar}
        payout={payout}
        onDecline={handleDeclinePayout}
        onProcess={handleProcessPayout}
        loading={individualPayoutPending}
        error={individualPayoutError?.message || ""}
        canApprove={hasPermission("finance:approve_payments")}
        canReject={hasPermission("finance:reject_payments")}
        canFlag={hasPermission("finance:flag_payments")}
      />

      <ConfirmPayoutSidebar
        isOpen={isConfirmOpen}
        onClose={closeConfirmSidebar}
        payout={payout}
        onConfirm={() => setOpenModal(true)}
        loading={false}
        error={""}
      />

      <SpreadApprovalDrawer
        isOpen={isRateProposalOpen}
        entry={
          isRateProposalOpen ? rateProposalDetails?.proposal ?? null : null
        }
        isLoading={isRateProposalOpen && rateProposalDetailsPending}
        onClose={closeRateProposalSidebar}
        onApprove={handleApproveProposal}
        onDecline={handleDeclineProposal}
        isApproving={approvingProposal}
        isDeclining={decliningProposal}
      />

      <DialogLayout
        open={openModal}
        onClose={() => setOpenModal(false)}
        title="Process Payout"
        footer={
          <div className="w-full flex gap-[20px]">
            <Button
              onClick={() => setOpenModal(false)}
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
              {rejectingPayout ? "Rejecting..." : "Reject"}
            </Button>
          </div>
        }
      >
        <h1>Are you sure you want to reject payout</h1>
      </DialogLayout>
    </>
  );
}
