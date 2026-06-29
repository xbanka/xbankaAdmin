import { cn } from "@/lib/utils";

export function SectionTitle({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <h4 className={cn("text-sm py-3 px-5 text-primary rounded-tl-[12px] rounded-tr-[12px] border border-card-border-secondary bg-card-secondary font-medium", className)}>
      {children}
    </h4>
  );
}
