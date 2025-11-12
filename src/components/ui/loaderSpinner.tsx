import { cn } from '@/lib/utils';
import React from 'react';

interface LoaderSpinnerProps {
  className?: string
}

const LoaderSpinner = ({className}: LoaderSpinnerProps) => {
  return (
    <div
      className={cn("inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-abstractCyan border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]", className)}
      role="status">
      <span
        className="!-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
      ></span>
    </div>
  );
};

export default LoaderSpinner;

//  if (isPending || referralPending) {
//     return (
//       <div className="flex items-center justify-center left-0 right-0 absolute top-1/2 -translate-y-1/2">
//         <LoaderSpinner />
//       </div>
//     );
//   }