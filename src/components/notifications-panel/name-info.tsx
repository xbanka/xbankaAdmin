
export const NameInfo = ({ title, value }: { title: string; value: string }) => {
  return (
    <div className="flex flex-col gap-1">
        <p className="font-medium text-[12px] leading-[20px] text-secondary-text">{title}</p>
        <h1 className="font-normal text-[14px] leading-6 text-text-primary-font-color">{value}</h1>
    </div>
  )
}
