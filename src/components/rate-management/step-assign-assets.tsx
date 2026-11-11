import { cn } from "@/lib/utils";
import { Check, Search, SlidersHorizontal } from "lucide-react";
import { Asset, Segment } from "./types";
import { CryptoCurrencyTypes } from "@/lib/types/rates-types";
import { SelectFieldLayout } from "../forms/SelectFieldLayout";
import { Badge } from "./badge";
import { AssetIcon } from "./asset-icon";
import { DataTableLayout } from "../DataTableLayout/DataTableLayout";
import { useState } from "react";
import {
  useBulkAssignSegment,
  useUpdateBuyAndSpreadRates,
} from "@/lib/services/rates.service";
import { Input } from "../ui/input";
import { ALL_SEGMENTS, filterReviewAssets } from "./segment-selection";
import { fmt } from "@/lib/utils/formatNumber";
import { getSegmentSpreads, getXBankaRates } from "@/lib/utils/rates";

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
      className: "md:w-[50px]",
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
      className: "md:w-[200px]",
      render: (row: CryptoCurrencyTypes) => (
        <div className="flex items-center gap-3 min-w-0">
          <AssetIcon currency={row.currency} />
          <div className="min-w-0">
            <div
              className="font-semibold text-[13px] text-[#111827] truncate"
              title={row.name}
            >
              {row.name}
            </div>
            <div className="text-[11px] text-[#9CA3AF]">{row.currency}</div>
          </div>
        </div>
      ),
    },

    {
      key: "segment",
      header: "Current Segment",
      className: "md:w-[150px]",
      render: (row: CryptoCurrencyTypes) => row.segment?.name,
    },
    {
      key: "obiexRate",
      header: "Obiex Rate",
      className: "md:w-[130px]",
      render: (row: CryptoCurrencyTypes) => fmt(row.obiexRate ?? 0),
    },
    {
      key: "buyFeeValue",
      header: "Buy Rate",
      className: "md:w-[100px]",
      render: (row: CryptoCurrencyTypes) => `${row.segment?.buySpread}%`,
    },
    {
      key: "sellFeeValue",
      header: "Sell Rate",
      className: "md:w-[100px]",
      render: (row: CryptoCurrencyTypes) => `${row.segment?.sellSpread}%`,
    },
    {
      key: "xbankaRate",
      header: "XBanka's Rate",
      className: "md:w-[150px]",
      render: (row: CryptoCurrencyTypes) => {
        // Step 3 shows the segment spread, so the rate uses it too.
        const { buy, sell } = getXBankaRates(row, getSegmentSpreads(row));
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
      className: "md:w-[110px]",
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
      className: "md:w-[180px]",
      render: (row: CryptoCurrencyTypes) => {
        const currentSegmentId =
          selectedSegments[row.id] || row.segmentId || "";
        return (
          <SelectFieldLayout
            id={`segment-${row.id}`}
            value={currentSegmentId}
            onChange={(segmentId) => handleSegmentChange(row, segmentId)}
            options={segmentOptions}
            className="w-[130px]"
            selectClassName="h-9 px-3 text-[13px]"
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
      <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4 md:flex-wrap">
        <div className="grid grid-cols-2 gap-2.5 md:mb-6 md:flex md:items-center">
          <div className="relative col-span-2 w-full md:w-[200px]">
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
          <button className="flex h-10 w-full md:w-auto items-center justify-center md:justify-start gap-1.5 whitespace-nowrap border border-[#E5E7EB] rounded-lg px-3 py-2 text-[13px] text-[#6B7280] bg-white">
            <SlidersHorizontal size={14} /> Advanced filter
          </button>
        </div>
        <div className="md:ml-auto flex items-center justify-between md:justify-start gap-2">
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
            className="w-[220px]"
            selectClassName="px-3"
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

      <div className="w-full md:max-w-[700px] lg:min-w-[100%] xl:min-w-full">
        <DataTableLayout
          data={visibleAssets}
          columns={columns}
          rowKey={(row) => row.id}
          itemsPerPage={10}
          totalCount={visibleAssets.length}
          isLoading={loading}
          emptyMessage="No assets found."
        />
      </div>
    </div>
  );
}
