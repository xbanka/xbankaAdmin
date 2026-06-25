export type Tab = "profile" | "wallet" | "transactions" | "verification";

export const TABS: { key: Tab; label: string }[] = [
  { key: "profile", label: "Profile" },
  { key: "wallet", label: "Wallet" },
  { key: "transactions", label: "Transactions" },
  { key: "verification", label: "Verification" },
];