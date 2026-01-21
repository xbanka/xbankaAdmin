import CreateAccountPage from "@/components/auth/super-admin-sign-up";
import Image from "next/image";

const page = () => {
  return (
    <div className="min-h-screen bg-[#F9F9F9] pt-4">
      <div className="relative h-[100px] mx-auto w-[200px]">
        <Image
          src="/xBankaLogo.svg"
          alt="xbanka"
          className="object-cover"
          fill
        />
      </div>
      <CreateAccountPage />
    </div>
  );
};

export default page;
