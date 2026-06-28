export function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-bl-[12px] rounded-br-[12px] py-4 px-5 bg-card-primary border-x border-b border-card-border-secondary flex flex-col gap-4">
      {children}
    </div>
  );
}