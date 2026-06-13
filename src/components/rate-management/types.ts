export type Step = 1 | 2 | 3 | 4;
 
export interface Segment {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  examples: string[];
  selected: boolean;
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
  asset: string;
  symbol: string;
  initial?: string;
  defaultBuySpread: number;
  defaultSellSpread: number;
  onClose: () => void;
  onSave: (buySpread: number, sellSpread: number) => void;
}