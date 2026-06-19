import { cn } from "@/lib/utils";
import { Check, Search } from "lucide-react";
import { Asset, Segment } from "./types";
import { CryptoCurrencyTypes } from "@/lib/types/rates-types";
import { SelectFieldLayout } from "../forms/SelectFieldLayout";
import { Badge } from "./badge";
import { DataTableLayout } from "../DataTableLayout/DataTableLayout";
import { useState } from "react";
import {
  useBulkAssignSegment,
  useUpdateBuyAndSpreadRates,
} from "@/lib/services/rates.service";

export function StepAssignAssets({
  assets,
  segments,
  setStep,
}: {
  assets: CryptoCurrencyTypes[];
  segments: Segment[];
  setStep: () => void;
}) {
  const segOptions = segments.map((s) => s.name);
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  const [selectedSegmentName, setSelectedSegmentName] = useState("");
  const [selectedSegments, setSelectedSegments] = useState<
    Record<string, string>
  >({});
  const [setupNote, setSetupNote] = useState("");
  // const selectedCount = assets.filter((a) => a.checked).length;
  const { mutate: bulkAssign, error, isPending } = useBulkAssignSegment();
  const segmentOptions = segments.map((segment) => ({
    label: segment.name,
    value: segment.id,
  }));
  console.log("segments", segments);
  console.log("assets", assets);

  const toggleAsset = (row: CryptoCurrencyTypes) => {
    const isSelected = selectedAssetIds.includes(row.id);

    if (isSelected) {
      setSelectedAssetIds((prev) => prev.filter((id) => id !== row.id));
      return;
    }

    setSelectedAssetIds((prev) => [...prev, row.id]);

    const segmentId = selectedSegments[row.id] ?? row.segmentId;

    if (segmentId !== row.segmentId) {
      updateCryptoSegment({
        rateId: row.id,
        payload: {
          segmentId,
        },
      });
    }
  };

  const { mutate: updateCryptoSegment } = useUpdateBuyAndSpreadRates();

  const handleAssignSelected = () => {
    const updates = assets.filter(
      (asset) =>
        selectedAssetIds.includes(asset.id) &&
        selectedSegments[asset.id] &&
        selectedSegments[asset.id] !== asset.segmentId,
    );

    updates.forEach((asset) => {
      updateCryptoSegment({
        rateId: asset.id,
        payload: {
          segmentId: selectedSegments[asset.id],
        },
      });
    });
  };

  const handleSegmentChange = (row: CryptoCurrencyTypes, segmentId: string) => {
    // always update local UI state
    setSelectedSegments((prev) => ({
      ...prev,
      [row.id]: segmentId,
    }));

    // only send request if row is checked
    if (selectedAssetIds.includes(row.id)) {
      updateCryptoSegment({
        rateId: row.id,
        payload: {
          segmentId,
        },
      });
    }
  };

  const columns = [
    {
      key: "select",
      header: "",
      render: (row: CryptoCurrencyTypes) => (
        <input
          type="checkbox"
          checked={selectedAssetIds.includes(row.id)}
          onChange={() => toggleAsset(row)}
        />
      ),
    },

    {
      key: "asset",
      header: "Asset",
      render: (row: CryptoCurrencyTypes) => (
        <div>
          <div>{row.name}</div>
          <div>{row.currency}</div>
        </div>
      ),
    },

    {
      key: "segment",
      header: "Current Segment",
      render: (row: CryptoCurrencyTypes) => row.segment?.name,
    },
    {
      key: "buyFeeValue",
      header: "Buy Rate",
      render: (row: CryptoCurrencyTypes) => `${row.segment?.buySpread}%`,
    },
    {
      key: "sellFeeValue",
      header: "Sell Rate",
      render: (row: CryptoCurrencyTypes) => `${row.segment?.sellSpread}%`,
    },

    {
      key: "status",
      header: "Status",
      render: (row: CryptoCurrencyTypes) => (
        <Badge
          active={row.isActive}
          text={row.isActive ? "Active" : "Inactive"}
        />
      ),
    },

    {
      key: "assign",
      header: "Assign Segment",
      render: (row: CryptoCurrencyTypes) => {
        const currentSegmentId =
          selectedSegments[row.id] || row.segmentId || "";
        return (
          <SelectFieldLayout
            id={`segment-${row.id}`}
            value={currentSegmentId}
            onChange={(segmentId) => handleSegmentChange(row, segmentId)}
            options={segmentOptions}
          />
        );
      },
    },
  ];

  // const handleBulkAssign = () => {
  //   const selectedSegment = segments.find(
  //     (segment) => segment.name === selectedSegmentName,
  //   );

  //   if (!selectedSegment) return;

  //   bulkAssign({
  //     segmentId: selectedSegment.id,
  //     payload: {
  //       assetIds: selectedAssetIds,
  //       setupNote,
  //     },
  //   });

  //   bulkAssign(
  //     {
  //       segmentId: selectedSegment.id,
  //       payload: {
  //         assetIds: selectedAssetIds,
  //         setupNote,
  //       },
  //     },
  //     {
  //       onSuccess: () => {
  //         setStep;
  //       },
  //     },
  //   );
  // };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-[16px] font-bold mb-1">
          Assign Assets to Segments
        </h3>
        <p className="text-[12px] font-normal text-text-secondary">
          Assign each supported asset to a spread segment. Assets will inherit
          the segment's buy
          <br /> and sell spreads unless a custom override is added later.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="flex items-center gap-1.5 border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-[12px] text-[#9CA3AF] bg-white w-36">
          <Search size={13} /> Search asset
        </div>
        <select className="border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-[12px] text-[#6B7280] bg-white">
          <option>Major coins</option>
          {segOptions.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select className="border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-[12px] text-[#6B7280] bg-white">
          <option>Status: All</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[12px] text-[#6B7280]">
            {/* {selectedCount} asset selected */}
          </span>
          <select className="border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-[12px] text-[#6B7280] bg-white">
            <option>Assigned selected to</option>
            {segOptions.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <button className="w-8 h-8 rounded-lg bg-[#0D9488] flex items-center justify-center text-white">
            <Check size={15} />
          </button>
        </div>
      </div>

      <div className="border-b border-x border-[#E5E7EB] rounded-[8px] overflow-hidden">
        <DataTableLayout
          data={assets}
          columns={columns}
          rowKey={(row) => row.id}
          itemsPerPage={10}
          totalCount={assets.length}
        />
      </div>
    </div>
  );
}
