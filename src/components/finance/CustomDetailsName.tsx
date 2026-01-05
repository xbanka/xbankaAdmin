import React from 'react'

interface CustomDetailsNameProps {
    title: string,
    body: string
}

const CustomDetailsName = ({title, body}: CustomDetailsNameProps) => {
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <h3 className='font-[400] text-[12px] leading-[16px] text-[#606368]'>{title}</h3>
      <p className='font-[500] text-[14px] leading-[18px] text-[#111827] truncate'>{body}</p>
    </div>
  )
}

export default CustomDetailsName
