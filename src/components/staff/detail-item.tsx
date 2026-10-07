interface DetailItemProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

export function DetailItem({
  label,
  value,
  className = "",
}: DetailItemProps) {
  return (
    <div className={className}>
      <p className="text-xs text-secondary-text font-normal">{label}</p>
      <p className="font-medium text-[14px] text-text-primary-font-color mt-1">
        {value}
      </p>
    </div>
  );
}