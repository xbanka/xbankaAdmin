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