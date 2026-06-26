export type FeeType = 'FLAT' | 'PERCENTAGE' | string;

export interface CurrencyConfig {
  currency: string;
  name: string;
  isActive: boolean;
  buyFeeType: FeeType;
  buyFeeValue: number;
  sellFeeType: FeeType;
  sellFeeValue: number;
  segmentId: string
}

export interface ActiveConfig {
  isActive: boolean
}
export interface SegmentConfig {
  segmentId: string;
}

export interface AssetSegment {
  id: string;
  name: string;
  isActive: boolean;
  buyFeeType: FeeType;
  buySpread: number;
  sellFeeType: FeeType;
  sellSpread: number;
  createdAt: string;
  updatedAt: string;
}

export interface CryptoCurrencyTypes {
  id: string;                
  currency: string;            
  name: string;            
  isActive: boolean;
  buyFeeType: FeeType;
  buyFeeValue: number;
  sellFeeType: FeeType;
  sellFeeValue: number;
  overrideSegment: boolean;
  segment: AssetSegment | null;      
  segmentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateCryptoRatesArgs {
  rateId: string;
  payload: CurrencyConfig | SegmentConfig | ActiveConfig;
}

export interface UpdateSegmentPayload {
  id: string;
  name: string;
  isActive: boolean;
  buyFeeType: FeeType;
  buySpread: number;
  sellFeeType: FeeType;
  sellSpread: number;
}