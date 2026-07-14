import React from "react";
import { CardLayout } from "../ui/card-layout";
import { ArrowUp } from "lucide-react";

export interface DetailCardProps {
  title: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  value: number;
  label: string;
}

export const DetailCard = ({ title, Icon, value, label}: DetailCardProps) => {
  return (
    <CardLayout key={title} className="bg-white space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[16px] font-medium leading-6 text-text-secondary">{title}</span>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[24px] leading-[32px] font-semibold text-text-primary-font-color">{value}</span>
        {/* <span className="flex items-center gap-0.5 text-xs text-main-green font-medium">
          <ArrowUp className="h-3 w-3" />
          12% vs last week
        </span> */}
      </div>
      <div className="flex items-center gap-4">
        <div key={label} className="flex flex-col">
          <span className="text-xs font-normal leading-[18px] text-secondary-text">{label}</span>
          <span className={`text-[16px] leading-6 font-medium  `}>
            {value}
          </span>
        </div>
        <div key={label} className="flex flex-col">
          <span className="text-xs font-normal leading-[18px] text-secondary-text">{label}</span>
          <span className={`text-[16px] leading-6 font-medium `}>
            {value}
          </span>
        </div>
        <div key={label} className="flex flex-col">
          <span className="text-xs font-normal leading-[18px] text-secondary-text">{label}</span>
          <span className={`text-[16px] leading-6 font-medium `}>
            {value}
          </span>
        </div>
      </div>
    </CardLayout>
  );
};
