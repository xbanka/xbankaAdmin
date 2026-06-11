import { Button } from "../ui/button";

export const EmptySpreadSchedule = ({onClick}: {onClick: () => void}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px]">
      <div className="space-y-4">
        <div className="border border-teal-border p-0.75 rounded-[36px] w-[64px] h-[64px] mx-auto flex items-center justify-center">
          <h1 className="bg-text-teal text-[#FFFFFF] w-full h-[56px] rounded-[36px] mx-auto text-center flex items-center justify-center">
            %
          </h1>
        </div>
        <div className="space-y-1 text-center">
          <h1 className="font-[600] text-[24px] text-text-primary">
            {" "}
            No spread schedule configured yet
          </h1>
          <p className="font-normal text-[12px] text-text-secondary">
            Set up buy and sell spreads for asset segments before
            customer-facing crypto rates can go live.
          </p>
        </div>
        <Button onClick={onClick} className="mx-auto flex justify-center">
          + Create Spread Schedule
        </Button>
      </div>
    </div>
  );
};
