export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-sm py-3 px-5 text-primary rounded-tl-[12px] rounded-tr-[12px] border border-card-border-secondary bg-card-secondary font-medium">
      {children}
    </h4>
  );
}
