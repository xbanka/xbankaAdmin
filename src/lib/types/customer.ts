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