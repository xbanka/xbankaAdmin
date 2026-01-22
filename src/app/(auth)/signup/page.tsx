import SignupForm from '@/components/layout/signup-form'
import Image from 'next/image'

const page = () => {
  return (
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
  )
}

export default page
