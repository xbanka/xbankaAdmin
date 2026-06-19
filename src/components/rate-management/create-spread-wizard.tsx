"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { INITIAL_ASSETS, STEP_LABELS } from "./mock";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { StepAssignAssets } from "./step-assign-assets";
import { StepReview } from "./step-review";
import { StepSetSpread } from "./step-set-spread";
import { StepSegment } from "./step-segment";
import { Asset, Segment, SegmentResponse, SegmentSpread, Step } from "./types";
import {
  useGetAllSegments,
  useGetCryptoRates,
  useUpdateAllSegments,
} from "@/lib/services/rates.service";

export function CreateSpreadWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<Step>(1);
  const [segments, setSegments] = useState<Segment[]>([]);

  const {
    data: segmentData,
    isPending: isPendingSegment,
    error: errorSegment,
  } = useGetAllSegments();
  const { mutate: updateSegments, isPending } = useUpdateAllSegments();
  const selectedSegments = segments.filter((s) => s.selected);

  const selectedCount = selectedSegments.length;

  const estimatedAssets = selectedSegments.reduce(
    (sum, segment) => sum + segment.assets.length,
    0,
  );
  const { data: cryptoData } = useGetCryptoRates();

  const cryptoAssets = cryptoData?.data ?? [];
  const [setupNote, setSetupNote] = useState("");

  const toggleSegment = (id: string) => {
    setSegments((prev) =>
      prev.map((s) => (s.id === id ? { ...s, selected: !s.selected } : s)),
    );
  };

  const updateSpread = (
    id: string,
    field: "buySpread" | "sellSpread",
    value: number,
  ) => {
    setSegments((prev) =>
      prev.map((segment) =>
        segment.id === id ? { ...segment, [field]: value } : segment,
      ),
    );
  };

  const toggleSpread = (id: string) => {
    setSegments((prev) =>
      prev.map((segment) =>
        segment.id === id
          ? {
              ...segment,
              isActive: !segment.isActive,
            }
          : segment,
      ),
    );
  };

  const handleSaveSegments = () => {
    const payload = segments
      .filter((segment) => segment.selected)
      .map((segment) => ({
        id: segment.id,
        name: segment.name,
        isActive: segment.isActive,
        buyFeeType: "PERCENTAGE",
        buySpread: segment.buySpread,
        sellFeeType: "PERCENTAGE",
        sellSpread: segment.sellSpread,
      }));

    updateSegments(payload, {
      onSuccess: () => {
        setStep(3);
      },
    });
  };

  useEffect(() => {
    if (segmentData?.data) {
      setSegments(
        segmentData.data.map((segment: SegmentResponse) => ({
          id: segment.id,
          name: segment.name,
          selected: true,
          isActive: segment.isActive ?? true,
          buySpread: segment.buySpread,
          sellSpread: segment.sellSpread,
          assets: segment.assets,
        })),
      );
    }
  }, [segmentData]);

  return (
    <div className="flex flex-col h-full bg-card-secondary">
      {/* Wizard Header */}
      {/* Steps */}
      <div>
        <div className="flex items-center justify-center gap-1 py-5 px-6">
          {STEP_LABELS.map((label, i) => {
            const num = i + 1;
            const done = step > num;
            const current = step === num;
            return (
              <div key={label} className="flex items-center gap-1">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-semibold",
                      done || current
                        ? "bg-[#0D9488] text-white"
                        : "bg-[#F3F4F6] text-[#9CA3AF]",
                    )}
                  >
                    {done ? <Check size={13} /> : "%"}
                  </div>
                  <div
                    className={cn(
                      "text-[11px] font-medium whitespace-nowrap",
                      done || current ? "text-[#0D9488]" : "text-[#9CA3AF]",
                    )}
                  >
                    {label}
                  </div>
                </div>
                {i < STEP_LABELS.length - 1 && (
                  <div
                    className={cn(
                      "w-14 h-[1.5px] mb-5 mx-1",
                      done ? "bg-[#0D9488]" : "bg-[#E5E7EB]",
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="px-6 pb-2">
          {step === 1 && (
            <StepSegment
              segments={segments}
              onToggle={toggleSegment}
              selectedCount={selectedCount}
              estimatedAssets={estimatedAssets}
              loading={isPendingSegment}
            />
          )}
          {step === 2 && (
            <StepSetSpread
              segments={segments.filter((s) => s.selected)}
              onUpdateSpread={updateSpread}
              onToggleSpread={toggleSpread}
              setupNote={setupNote}
              onSetupNote={setSetupNote}
            />
          )}
          {step === 3 && (
            <StepAssignAssets assets={cryptoAssets} segments={segments} />
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between px-6 py-4 border-t border-background-alt-neutral-grey">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <div className="flex gap-2.5">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep((s) => (s - 1) as Step)}
            >
              Back
            </Button>
          )}
          {step < 3 ? (
            <Button
              onClick={() => {
                if (step === 2) {
                  handleSaveSegments();
                  return;
                }

                setStep((s) => (s + 1) as Step);
              }}
              disabled={isPending}
            >
              {step === 1
                ? "Continue to Spread Segment"
                : "Continue to Assign Assets"}
            </Button>
          ) : (
            <Button onClick={onClose}>Done</Button>
          )}
        </div>
      </div>
    </div>
  );
}
