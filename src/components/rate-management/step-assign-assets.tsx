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
import { ALL_SEGMENTS, filterReviewAssets } from "./segment-selection";
import { fmt } from "@/lib/utils/formatNumber";
import { getXBankaRates } from "@/lib/utils/rates";

export function StepAssignAssets({
  assets,
  segments,
  loading = false,
  pendingApproval = false,
}: {
  assets: CryptoCurrencyTypes[];
  segments: Segment[];
  loading?: boolean;
  pendingApproval?: boolean;
}) {
  const segOptions = segments.map((s) => s.name);
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  const [selectedSegmentName, setSelectedSegmentName] = useState("");
  const [segmentFilter, setSegmentFilter] = useState<string>(ALL_SEGMENTS);
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
  const segmentFilterOptions = [
    { label: "All segments", value: ALL_SEGMENTS },
    ...segmentOptions,
  ];
  const visibleAssets = filterReviewAssets(assets, {
    segmentId: segmentFilter,
    query: searchQuery,
  });
  console.log("segments", segments);
  console.log("assets", assets);

  const toggleAsset = (row: CryptoCurrencyTypes) => {
    const isSelected = selectedAssetIds.includes(row.id);

    if (isSelected) {
      setSelectedAssetIds((prev) => prev.filter((id) => id !== row.id));
    } else {
      setSelectedAssetIds((prev) => [...prev, row.id]);
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
    setSelectedSegments((prev) => ({
      ...prev,
      [row.id]: segmentId,
    }));

    updateCryptoSegment({
      rateId: row.id,
      payload: {
        segmentId,
      },
    });
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
      key: "obiexRate",
      header: "Obiex Rate",
      render: (row: CryptoCurrencyTypes) => fmt(row.obiexRate ?? 0),
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
      key: "xbankaRate",
      header: "XBanka's Rate",
      render: (row: CryptoCurrencyTypes) => {
        const { buy, sell } = getXBankaRates(row);
        return (
          <div>
            <div className="text-[12px] text-[#111827]">Buy: {fmt(buy)}</div>
            <div className="text-[11px] text-[#9CA3AF]">Sell: {fmt(sell)}</div>
          </div>
        );
      },
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
          the segment&apos;s buy
          <br /> and sell spreads unless a custom override is added later.
        </p>
      </div>

      {pendingApproval && (
        <div
          role="status"
          className="mb-4 rounded-[8px] bg-teal-light px-3 py-2 text-[12px] text-teal-text"
        >
          Your spread change is waiting for approval. The rates below show the
          current live spreads until it is approved.
        </div>
      )}

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
            options={segmentFilterOptions}
            placeholder="All segments"
            value={segmentFilter}
            onChange={setSegmentFilter}
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
          data={visibleAssets}
          columns={columns}
          rowKey={(row) => row.id}
          itemsPerPage={10}
          totalCount={visibleAssets.length}
          isLoading={loading}
          emptyMessage={
            segments.length === 0
              ? "None of the selected segments has a buy or sell spread. Go back and set one."
              : "No assets in the selected segments."
          }
        />
      </div>
    </div>
  );
}
