import ResetPasswordPage from '@/components/ResetPassword/ResetPassword'
import React from 'react'

const page = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) => {
    const { token } = await searchParams;
  return (
    <div className='bg-[#FAFAFA] pt-[70px] h-screen'>
      <ResetPasswordPage token={token} />
    </div>
  )
}

export default page
