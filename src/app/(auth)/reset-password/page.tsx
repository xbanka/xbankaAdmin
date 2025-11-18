import ResetPasswordPage from '@/components/ResetPassword/ResetPassword'
import React from 'react'

const page = ({ searchParams }: { searchParams: { token?: string } }) => {
    const token = searchParams.token;
  return (
    <div>
      <ResetPasswordPage token={token} />
    </div>
  )
}

export default page
