import SignupForm from '@/components/auth/signup-form'
import Image from 'next/image'
import { Suspense } from 'react'

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className='bg-[#FAFAFA] py-[70px] min-h-screen'>
      <div className="relative h-[100px] mx-auto w-[200px]">
        <Image
          src="/xBankaLogo.svg"
          alt="xbanka"
          className="object-cover"
          fill
        />
      </div>
      <SignupForm />
    </div>
    </Suspense>
  )
}

export default page
