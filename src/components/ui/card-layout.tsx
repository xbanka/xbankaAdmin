import { cn } from '@/lib/utils';
import React from 'react'

export const CardLayout = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn("border border-card-border-secondary rounded-[12px] p-5 bg-card-primary", className)}>
      {children}
    </div>
  )
}
