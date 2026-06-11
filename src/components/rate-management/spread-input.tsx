export function SpreadInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="block text-[12px] font-normal text-[#111827] mb-2">{label}</label>
      <div className="flex items-center bg-card-primary border border-card-border-secondary rounded-[8px] overflow-hidden focus-within:border-[#0D9488] focus-within:ring-[3px] focus-within:ring-[#0D9488]/10 transition-all">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="flex-1 outline-none px-3 py-2.5 text-[13px] font-medium bg-card-primary"
        />
        <span className="px-2.5 py-2 text-[#9CA3AF] text-[13px]">
          %
        </span>
      </div>
    </div>
  );
}
