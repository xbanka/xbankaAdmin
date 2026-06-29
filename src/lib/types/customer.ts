export interface KycStatus {
  bvnVerified: boolean;
  addressStatus: "PENDING" | "APPROVED" | "REJECTED" | string | null;
  idStatus: "PENDING" | "APPROVED" | "REJECTED" | string | null;
}
export interface CustomerProps {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  isEmailVerified: boolean;
  phoneNumber: string | null;
  currentStep: "BVN" | "ADDRESS" | "ID_CARD" | string; // Steps in your onboarding flow
  tier: number;
  kycStatus: KycStatus;
  createdAt: string; // ISO Date String
}

export type OnboardingStep = 
  | "SIGNUP" 
  | "EMAIL_VERIFIED" 
  | "BASIC_INFO" 
  | "BVN" 
  | "IDENTITY" 
  | "SELFIE" 
  | "ADDRESS" 
  | "COMPLETED" 
  | string;

export interface UserKycStatus {
  bvnVerified: boolean;
  idStatus: "PENDING" | "APPROVED" | "REJECTED" | string | null;
  addressStatus: "PENDING" | "APPROVED" | "REJECTED" | string | null;
}

export interface UserProfileData {
  userId: string;
  email: string;
  isEmailVerified: boolean;
  currentStep: OnboardingStep;
  referralCode: string | null;
  isTwoFactorEnabled: boolean;
  hasTransactionPin: boolean;
  firstName: string;
  lastName: string;
  phoneNumber: string; // Kept as string to preserve leading '0'
  dateOfBirth: string | null; // ISO Date String when populated
  gender: "male" | "female" | string | null;
  country: string | null;
  state: string | null;
  avatarUrl: string | null;
  completedOnboardingSteps: OnboardingStep[];
  kycStatus: UserKycStatus;
  createdAt: string; // ISO 8601 Date String
  updatedAt: string; // ISO 8601 Date String
}

export interface CustomerUserProfile{
  firstName: string;
  lastName: string;
  phoneNumber: string; // Stored as a string to preserve leading zeros like '0808...'
}

export interface CustomerAccountItem {
  id: string;
  email: string;
  createdAt: string; // ISO Date String
  profile: CustomerUserProfile | null;
}

export interface CustomerSearchSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerSelect: (customer: SelectedCustomer) => void;
  isLoading?: boolean;
}

export interface SelectedCustomer {
   affiliate: string;
  email: string;
  id: string;
  joinedAt: string;
  name: string;
  phone: string;
  totalTransactions: string;
  username: string;
}

export interface CustomerVerificationData {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  completedOnboardingSteps: string[];
  currentStep: string;
  kycStatus: KycStatus;
  hasTransactionPin: boolean;
  isActive: boolean;
  isEmailVerified: boolean;
  isTwoFactorEnabled: boolean;
  referralCode: string;
  createdAt: string; // or Date, if you parse it
  updatedAt: string; // or Date, if you parse it
  country: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  phoneNumber: string | null;
  state: string | null;
}

export interface CustomerCryptoAsset {
  id: string;
  currency: string; // e.g., "BNB", "BTC", "ETH"
  balance: number;
  addresses: any[]; // Kept as any[] per your request
}

export interface CustomerWalletData {
  userId: string;
  totalWallets: number;
  cryptoAssets: CustomerCryptoAsset[];
  fiatAssets: any[]; // Kept as any[] per your request
}

export interface GetCustomersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}