import { SectionTitle } from "./section-title";

export function TransactionsTab() {
  // Placeholder — no transaction data from UserProfileData
  return (
    <div className="p-6 flex flex-col gap-4">
      <SectionTitle>Transaction Summary</SectionTitle>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[var(--grey-light)] rounded-xl p-4 flex flex-col items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-[var(--success-light)] flex items-center justify-center">
            <span className="text-[var(--success-text)] text-sm font-bold">✓</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] text-center">Total Transactions</p>
          <p className="text-xl font-bold text-[var(--text-primary)]">—</p>
        </div>
        <div className="bg-[var(--grey-light)] rounded-xl p-4 flex flex-col items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-[#FFF8D8] flex items-center justify-center">
            <span className="text-[#B29504] text-sm font-bold">○</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] text-center">Pending Transactions</p>
          <p className="text-xl font-bold text-[var(--text-primary)]">—</p>
        </div>
        <div className="bg-[var(--grey-light)] rounded-xl p-4 flex flex-col items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-[#FCE6E6] flex items-center justify-center">
            <span className="text-[#EF4444] text-sm font-bold">✕</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] text-center">Failed Transaction</p>
          <p className="text-xl font-bold text-[var(--text-primary)]">—</p>
        </div>
      </div>
      <p className="text-xs text-center text-[var(--text-secondary)] mt-4">
        Transaction history will be available here once data is connected.
      </p>
    </div>
  );
}