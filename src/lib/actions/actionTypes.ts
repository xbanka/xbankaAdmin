export interface UserTypes {
  createdAt: string;
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  role: string;
}

export interface AffiliateSignUpTypes {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}
export interface loginTypes {
  email: string;
  password: string;
}

export interface passwordResetErpProps {
  token: string,
    password: string, 
    confirm: string
}
export interface forgotPasswordTypes{
  email: string
}
export interface createCustomerTypes {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
}

export interface createTransactionTypes {
  transactionId: string;
  type: string;
  amount: number;
  phone: string;
  status: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface updateUsersTypes {
  role: string;
  id: string;
}
