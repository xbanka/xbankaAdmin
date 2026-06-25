export function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[var(--grey-light)] rounded-xl p-4 flex flex-col gap-4">
      {children}
    </div>
  );
}