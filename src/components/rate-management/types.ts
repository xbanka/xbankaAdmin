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