import React from 'react'

interface FinanceDetailsHeaderProps {
    title: string, 
    content: React.ReactNode
}

const FinanceDetailsHeader = ({title, content}: FinanceDetailsHeaderProps) => {
  return (
    <div className="space-y-1">
      <h1 className="font-[400] text-[12px] leading-[16px] text-[#606368]">{title}</h1>
      {content}
    </div>
  )
}

export default FinanceDetailsHeader
