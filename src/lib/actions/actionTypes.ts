export interface AffiliateSignUpTypes {
    firstName: string,
  lastName: string,
  email: string,
  password: string
}
export interface loginTypes{
  email: string,
  password: string,
}
export interface createCustomerTypes {
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  status: string
}

export interface createTransactionTypes {
  transactionId: string,
  type: string,
  amount: number,
  phone: string,
  status: string,
  email: string,
  firstName: string,
  lastName: string
}