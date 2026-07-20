import { CryptoCurrencyTypes, FeeType } from "@/lib/types/rates-types";

export type Step = 1 | 2 | 3 | 4;
 
export interface Segment {
  id: string;
  name: string;
  selected: boolean;
  buySpread: number;
  sellSpread: number;
  isActive: boolean;
  assets: CryptoCurrencyTypes[];
}
 
export interface SegmentSpread {
  id: string;
  buySpread: number;
  sellSpread: number;
  enabled: boolean;
}
 
export interface Asset {
  id: string;
  name: string;
  symbol: string;
  color: string;
  initial: string;
  currentSegment: string;
  buyRate: number;
  sellRate: number;
  status: "Active" | "Inactive";
  assignedSegment: string;
  checked: boolean;
}

export interface SpreadRow {
  id: string;
  asset: string;
  symbol: string;
  color: string;
  initial: string;
  buySpread: string;
  sellSpread: string;
  status: "Active" | "Inactive";
  requestedBy: string;
  requestedAt: string;
}

export interface EditSpreadModalProps {
  spreadData: CryptoCurrencyTypes;
  onClose: () => void;
  onSave: (buySpread: number, sellSpread: number) => void;
}

export interface SegmentResponse {
  id: string;
  name: string;
  isActive: boolean;
  buySpread: number;
  sellSpread: number;
  buyFeeType: FeeType;
  sellFeeType: FeeType;
  assets: CryptoCurrencyTypes[];
}

// components/rate-management/spread-history-types.ts

export type SpreadScope = "segment" | "asset";

export interface RateConfig {
  buy: number;
  sell: number;
}

export interface AffectedAsset {
  id: string;
  name: string;
  ticker: string;
  previousSpread: RateConfig;
  newSpread: RateConfig;
  status: "Updated" | "Unchanged" | "Deactivated";
}

export interface SpreadHistoryEntry {
  id: string;
  dateTime: string; // ISO string
  scope: SpreadScope;
  targetName: string;
  targetSubLabel: string; // "Segment" for segment scope, ticker (e.g. "ETH") for asset scope
  changeType: string;
  previousConfig: RateConfig;
  newConfig: RateConfig;
  affectedAssetsCount: number;
  updatedBy: {
    name: string;
    role: string;
  };
  changeSummary: string;
  effectiveUntil: string;
  status: "Active" | "Inactive";
  affectedAssets: AffectedAsset[];
}

// components/rate-management/spread-history-mock.ts

const sharedAffectedAssets: SpreadHistoryEntry["affectedAssets"] = [
  {
    id: "btc",
    name: "Bitcoin",
    ticker: "BTC",
    previousSpread: { buy: 2.0, sell: 1.75 },
    newSpread: { buy: 2.25, sell: 2.0 },
    status: "Updated",
  },
  {
    id: "eth",
    name: "Ethereum",
    ticker: "ETH",
    previousSpread: { buy: 2.0, sell: 1.75 },
    newSpread: { buy: 2.25, sell: 2.0 },
    status: "Updated",
  },
  {
    id: "usdt-1",
    name: "Tether",
    ticker: "USDT",
    previousSpread: { buy: 2.0, sell: 1.75 },
    newSpread: { buy: 2.25, sell: 2.0 },
    status: "Updated",
  },
  {
    id: "usdt-2",
    name: "Tether",
    ticker: "USDT",
    previousSpread: { buy: 2.0, sell: 1.75 },
    newSpread: { buy: 2.25, sell: 2.0 },
    status: "Updated",
  },
  {
    id: "usdc",
    name: "USD Coin",
    ticker: "USDC",
    previousSpread: { buy: 2.0, sell: 1.75 },
    newSpread: { buy: 2.25, sell: 2.0 },
    status: "Updated",
  },
];

export const SPREAD_HISTORY_MOCK: SpreadHistoryEntry[] = [
  {
    id: "sh-1",
    dateTime: "2026-10-24T14:30:00",
    scope: "segment",
    targetName: "Ethereum",
    targetSubLabel: "ETH",
    changeType: "Segment spread updated",
    previousConfig: { buy: 2.0, sell: 1.75 },
    newConfig: { buy: 2.5, sell: 2.25 },
    affectedAssetsCount: 8,
    updatedBy: { name: "Name", role: "Admin" },
    changeSummary:
      "The buy and sell spread for the major coins segment were updated, affecting 8 assets.",
    effectiveUntil: "Present",
    status: "Active",
    affectedAssets: sharedAffectedAssets,
  },
  {
    id: "sh-2",
    dateTime: "2026-10-24T14:30:00",
    scope: "asset",
    targetName: "Ethereum",
    targetSubLabel: "ETH",
    changeType: "Segment reassigned",
    previousConfig: { buy: 2.0, sell: 1.75 },
    newConfig: { buy: 3.0, sell: 2.75 },
    affectedAssetsCount: 1,
    updatedBy: { name: "Name", role: "Operation" },
    changeSummary:
      "Ethereum was moved from the Major coin segment to the Alt coin segment, updating its spread.",
    effectiveUntil: "Present",
    status: "Active",
    affectedAssets: [sharedAffectedAssets[1]],
  },
  {
    id: "sh-3",
    dateTime: "2026-10-24T14:30:00",
    scope: "asset",
    targetName: "Tether",
    targetSubLabel: "USDT",
    changeType: "Both spread updated",
    previousConfig: { buy: 2.0, sell: 1.75 },
    newConfig: { buy: 2.0, sell: 1.75 },
    affectedAssetsCount: 1,
    updatedBy: { name: "Name", role: "Superadmin" },
    changeSummary:
      "The buy and sell spread for Tether (Stable coin segment) were updated.",
    effectiveUntil: "Present",
    status: "Active",
    affectedAssets: [sharedAffectedAssets[2]],
  },
  {
    id: "sh-4",
    dateTime: "2026-10-24T14:30:00",
    scope: "asset",
    targetName: "Tether",
    targetSubLabel: "USDT",
    changeType: "Both spread updated",
    previousConfig: { buy: 2.0, sell: 1.75 },
    newConfig: { buy: 2.0, sell: 1.75 },
    affectedAssetsCount: 1,
    updatedBy: { name: "Name", role: "Operation" },
    changeSummary:
      "The buy and sell spread for Tether (Stable coin segment) were updated.",
    effectiveUntil: "Present",
    status: "Active",
    affectedAssets: [sharedAffectedAssets[3]],
  },
  {
    id: "sh-5",
    dateTime: "2026-10-24T14:30:00",
    scope: "asset",
    targetName: "USD Coin",
    targetSubLabel: "USDC",
    changeType: "Deactivated",
    previousConfig: { buy: 2.0, sell: 1.75 },
    newConfig: { buy: 2.0, sell: 1.75 },
    affectedAssetsCount: 1,
    updatedBy: { name: "Name", role: "Operation" },
    changeSummary: "USD Coin (Stable coin segment) was deactivated.",
    effectiveUntil: "Present",
    status: "Inactive",
    affectedAssets: [sharedAffectedAssets[4]],
  },
];