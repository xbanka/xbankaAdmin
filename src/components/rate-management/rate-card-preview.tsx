// import React from "react";
// import { PreviewRow } from "./preview-row";
// import { fmt } from "@/lib/utils/formatNumber";
// import { Info } from "lucide-react";


// export const RateCardPreview = ({title}: ) => {
//   return (
//     <div className="mb-4 bg-card-primary p-3 border-l-3 rounded-[12px] border-success-border">
//       <div className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-2">
//         {title}
//       </div>
//       <PreviewRow label="Obiex Buy Rate" value={fmt(OBLEX_BUY_RATE)} />
//       <PreviewRow
//         label="Buy Spread"
//         value={`+${buySpread.toFixed(2)}%`}
//         valueClass="text-[#059669]"
//       />
//       <PreviewRow label="Spread Amount" value={fmt(buyAmt)} />
//       <PreviewRow
//         label="Customer Buy Rate"
//         value={fmt(customerBuyRate)}
//         valueClass="text-[15px] text-[#0D9488] font-semibold"
//       />
//       <div className="flex items-start gap-1 mt-2">
//         <Info size={13} className="text-[#9CA3AF] flex-shrink-0 mt-0.5" />
//         <p className="text-[11px] text-[#9CA3AF]">
//           Customer buys {symbol} at Oblex buy rate plus XBanka buy spread.
//         </p>
//       </div>
//     </div>
//   );
// };
