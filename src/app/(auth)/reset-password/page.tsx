import ResetPasswordPage from '@/components/ResetPassword/ResetPassword'
import React from 'react'

const page = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) => {
    const { token } = await searchParams;
  return (
    <div>
      <ResetPasswordPage token={token} />
    </div>
  )
}

export default page
