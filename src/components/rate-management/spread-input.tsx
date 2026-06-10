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
      <label className="block text-[11px] text-[#6B7280] mb-1.5">{label}</label>
      <div className="flex items-center border border-[#E5E7EB] rounded-lg overflow-hidden focus-within:border-[#0D9488] focus-within:ring-[3px] focus-within:ring-[#0D9488]/10 transition-all">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="flex-1 border-none outline-none px-3 py-2 text-[13px] font-medium bg-transparent"
        />
        <span className="px-2.5 py-2 text-[#9CA3AF] text-[13px] border-l border-[#E5E7EB]">%</span>
      </div>
    </div>
  );
}