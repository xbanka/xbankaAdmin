import React from "react";
import { CardLayout } from "../ui/card-layout";
import { ArrowUp } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

type StatItem = {
  label: string;
  value: number | string;
  valueClassName?: string;
};

export interface DetailCardProps {
  title: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  value: number | string;
  trend?: string;
  stats: StatItem[];
  isLoading?: boolean;
}

export const DetailCard = ({
  title,
  Icon,
  value,
  trend,
  stats,
  isLoading,
}: DetailCardProps) => {
  return (
    <CardLayout className="bg-white space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-base font-medium text-text-secondary">
          {title}
        </span>

        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="flex items-center gap-2">
        {isLoading ? (
          <Skeleton className="h-7 w-16" />
        ) : (
          <span className="text-2xl font-semibold text-text-primary-font-color">
            {value}
          </span>
        )}

        {trend && (
          <span className="text-xs text-main-green">
            ↑ {trend}
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map((item) => (
          <div key={item.label}>
            <p className="text-xs text-secondary-text">
              {item.label}
            </p>

            {isLoading ? (
              <Skeleton className="mt-1 h-4 w-10" />
            ) : (
              <p
                className={`text-base font-medium ${item.valueClassName ?? ""}`}
              >
                {item.value}
              </p>
            )}
          </div>
        ))}
      </div>
    </CardLayout>
  );
};
