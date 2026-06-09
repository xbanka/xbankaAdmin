import { cn } from "@/lib/utils";

export function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "w-10 h-[22px] rounded-full relative transition-colors flex-shrink-0",
        on ? "bg-[#0D9488]" : "bg-[#D1D5DB]"
      )}
      role="switch"
      aria-checked={on}
    >
      <span
        className={cn(
          "absolute top-[3px] w-4 h-4 bg-white rounded-full transition-all",
          on ? "right-[3px]" : "left-[3px]"
        )}
      />
    </button>
  );
}