import { Card } from "../ui/card";
import { cn } from "@/lib/utils";
import { ChatSummaryCardProps } from "./types";

const ChatSummaryCard = ({
  className,
  header,
  totalChats,
  footer,
  icon: Icon,
}: ChatSummaryCardProps) => {
  return (
    <Card
      className={cn(
        `hover:shadow-md transition-shadow border border-[#E5E3E3] rounded-[12px] p-5`,
        className
      )}
    >
      <div className="flex items-center justify-between mb-[12px]">
        <p className="text-sm font-[500] text-[#606368] ">{header}</p>
        {Icon && <Icon className="w-6 h-6" />}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-[22px] font-[700] text-[#111827] leading-[26px]">{totalChats}</p>
        <p className="font-[400] text-[12px] leading-[16px]">{footer}</p>
      </div>
    </Card>
  );
};

export default ChatSummaryCard;
