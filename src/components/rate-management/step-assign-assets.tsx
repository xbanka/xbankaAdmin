import { cn } from "@/lib/utils";
import { Check, Search, SlidersHorizontal } from "lucide-react";
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
import { Input } from "../ui/input";
import { SEGMENT_TYPES } from "./mock";

export function StepAssignAssets({
  assets,
  segments,
}: {
  assets: CryptoCurrencyTypes[];
  segments: Segment[];
}) {
  const segOptions = segments.map((s) => s.name);
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  const [selectedSegmentName, setSelectedSegmentName] = useState("");
  const [selectedTransactionType, setSelectedTransactionType] =
    useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSegments, setSelectedSegments] = useState<
    Record<string, string>
  >({});
  const [bulkSegmentId, setBulkSegmentId] = useState("");
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
      className: "w-[10px]",
      render: (row: CryptoCurrencyTypes) => (
        <div
          onClick={() => toggleAsset(row)}
          className={cn(
            "w-5 h-5 rounded flex items-center justify-center border cursor-pointer transition-all",
            selectedAssetIds.includes(row.id)
              ? "bg-[#0D9488] border-[#0D9488]"
              : "bg-transparent border-[#D1D5DB]",
          )}
        >
          {selectedAssetIds.includes(row.id) && (
            <Check size={12} className="text-white" />
          )}
        </div>
      ),
    },

    {
      key: "asset",
      header: "Asset",
      render: (row: CryptoCurrencyTypes) => (
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-black/50 text-[11px] font-bold flex-shrink-0"
            // style={{ background: row.color }}
          ></div>
          <div>
            <div>{row.name}</div>
            <div>{row.currency}</div>
          </div>
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

  const handleBulkAssign = () => {
    if (!bulkSegmentId) return;

    if (selectedAssetIds.length === 0) return;

    bulkAssign(
      {
        segmentId: bulkSegmentId,
        payload: {
          assetIds: selectedAssetIds,
          setupNote,
        },
      },
      {
        onSuccess: () => {
          setSelectedAssetIds([]);
          setBulkSegmentId("");
        },
      },
    );
  };

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
        <div className="flex items-center gap-2.5 mb-6">
          <div className="relative max-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <SelectFieldLayout
            id="transactionType"
            options={SEGMENT_TYPES}
            placeholder="All segment"
            value={selectedTransactionType}
            onChange={setSelectedTransactionType}
            className="w-full md:w-[180px]"
            selectClassName="border border-gray-300"
          />
          <button className="flex items-center gap-1.5 border border-[#E5E7EB] rounded-lg px-3 py-2 text-[13px] text-[#6B7280] bg-white">
            <SlidersHorizontal size={14} /> Advanced filter
          </button>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[12px] text-[#6B7280]">
            {selectedAssetIds.length} asset
            {selectedAssetIds.length !== 1 ? "s" : ""} selected
          </span>
          <SelectFieldLayout
            id="bulk-segment"
            value={bulkSegmentId}
            onChange={setBulkSegmentId}
            options={segmentOptions}
            placeholder="Assign selected to"
          />
          <button
            onClick={handleBulkAssign}
            disabled={
              !bulkSegmentId || selectedAssetIds.length === 0 || isPending
            }
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center text-white",
              !bulkSegmentId || selectedAssetIds.length === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#0D9488]",
            )}
          >
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
