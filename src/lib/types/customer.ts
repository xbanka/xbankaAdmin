export interface CustomerProps {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_no: string;
  note?: string;
  affiliate?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    phone_no: string;
    bank: string;
    account_no: string;
    ref_code: string;
    custom_refcode: string;
    created_at: string;
  };
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