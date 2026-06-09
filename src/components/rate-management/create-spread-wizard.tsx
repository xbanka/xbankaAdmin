"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Modal } from "../ui/modal";
import { INITIAL_ASSETS, INITIAL_SEGMENTS, STEP_LABELS } from "./mock";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { StepAssignAssets } from "./step-assign-assets";
import { StepReview } from "./step-review";
import { StepSetSpread } from "./step-set-spread";
import { StepSegment } from "./step-segment";
import { Asset, Segment, SegmentSpread, Step } from "./types";

export function CreateSpreadWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<Step>(1);
  const [segments, setSegments] = useState<Segment[]>(INITIAL_SEGMENTS);
  const [spreads, setSpreads] = useState<SegmentSpread[]>([
    { id: "stable", buySpread: 2.5, sellSpread: 1.5, enabled: true },
    { id: "major", buySpread: 2.5, sellSpread: 1.5, enabled: true },
    { id: "alt", buySpread: 2.5, sellSpread: 1.5, enabled: true },
  ]);
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [setupNote, setSetupNote] = useState("");
 
  const selectedCount = segments.filter((s) => s.selected).length;
  const estimatedAssets = selectedCount * 7;
 
  const toggleSegment = (id: string) => {
    setSegments((prev) => prev.map((s) => (s.id === id ? { ...s, selected: !s.selected } : s)));
  };
 
  const updateSpread = (id: string, field: "buySpread" | "sellSpread", value: number) => {
    setSpreads((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };
 
  const toggleSpread = (id: string) => {
    setSpreads((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
  };
 
  const toggleAsset = (id: string) => {
    setAssets((prev) => prev.map((a) => (a.id === id ? { ...a, checked: !a.checked } : a)));
  };
 
  const updateAssetSegment = (id: string, seg: string) => {
    setAssets((prev) => prev.map((a) => (a.id === id ? { ...a, assignedSegment: seg } : a)));
  };
 
  return (
    <Modal onClose={onClose} className="max-w-[800px] px-0 pb-0 rounded-[16px]">
      {/* Wizard Header */}
      <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#0D9488] rounded-md flex items-center justify-center text-white text-[12px] font-black">X</div>
          <span className="text-[15px] font-bold text-[#0D9488]">xbanka</span>
        </div>
        <span className="text-[13px] text-[#6B7280] font-medium">Rate configuration setup</span>
        <div className="w-24" />
      </div>
 
      {/* Steps */}
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
                    done || current ? "bg-[#0D9488] text-white" : "bg-[#F3F4F6] text-[#9CA3AF]"
                  )}
                >
                  {done ? <Check size={13} /> : "%"}
                </div>
                <div
                  className={cn(
                    "text-[11px] font-medium whitespace-nowrap",
                    done || current ? "text-[#0D9488]" : "text-[#9CA3AF]"
                  )}
                >
                  {label}
                </div>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div
                  className={cn("w-14 h-[1.5px] mb-5 mx-1", done ? "bg-[#0D9488]" : "bg-[#E5E7EB]")}
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
          />
        )}
        {step === 2 && (
          <StepSetSpread
            segments={segments.filter((s) => s.selected)}
            spreads={spreads}
            onUpdateSpread={updateSpread}
            onToggleSpread={toggleSpread}
            setupNote={setupNote}
            onSetupNote={setSetupNote}
          />
        )}
        {step === 3 && (
          <StepAssignAssets
            assets={assets}
            segments={segments.filter((s) => s.selected)}
            onToggleAsset={toggleAsset}
            onUpdateSegment={updateAssetSegment}
          />
        )}
        {step === 4 && <StepReview segments={segments} spreads={spreads} assets={assets} />}
      </div>
 
      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E7EB] mt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <div className="flex gap-2.5">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep((s) => (s - 1) as Step)}>
              Back
            </Button>
          )}
          {step < 4 ? (
            <Button onClick={() => setStep((s) => (s + 1) as Step)}>
              {step === 1
                ? "Continue to Spread Segment"
                : step === 2
                ? "Continue to Assign Assets"
                : "Continue to Review"}
            </Button>
          ) : (
            <Button onClick={onClose}>Activate Spread Schedule</Button>
          )}
        </div>
      </div>
    </Modal>
  );
}