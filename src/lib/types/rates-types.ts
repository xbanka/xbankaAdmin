export type FeeType = 'FLAT' | 'PERCENTAGE' | string; 

export interface CurrencyConfig {
  currency: string;
  name: string;
  isActive: boolean;
  buyFeeType: FeeType;
  buyFeeValue: number;
  sellFeeType: FeeType;
  sellFeeValue: number;
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
  segment: string | null;      
  segmentId: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface UpdateCryptoRatesArgs {
  rateId: string;
  payload: CurrencyConfig;
}