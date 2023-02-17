import MaxWidth from '@shared/layouts/MaxWidth';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import JaredImg from 'public/images/campaign/jared.png';
import AdminDelete from './AdminDelete';

export default function OnboardingWrapper({ children, title, self }) {
  const router = useRouter();
  const goBack = () => {
    router.back();
  };
  return (
    <div className="bg-white shadow-inner relative">
      <div
        className="pt-8 mx-3 lg:px-0 lg:pt-24 font-black border-b-4 border-teal-400  pb-2 mb-8 lg:hidden cursor-pointer"
        onClick={goBack}
      >
        BACK
      </div>
      <div className="relative mb-6 lg:mb-0 w-28 h-28  left-1/2 -ml-14  lg:absolute lg:-top-14 z-50">
        <Image src={JaredImg} fill className="object-contain" />
      </div>
      <MaxWidth>
        <div
          className="hidden lg:inline-block pt-24 font-black border-b-4 border-teal-400 pb-2 cursor-pointer"
          onClick={goBack}
        >
          BACK
        </div>
        <div className="max-w-[680px] mx-auto min-h-screen lg:min-h-[calc(100vh-80px)]">
          <h1 className="font-black text-4xl text-center  tracking-tight pb-14">
            {title}
          </h1>
          {children}
          {self !== '/onboarding' && <AdminDelete />}
        </div>
      </MaxWidth>
    </div>
  );
}
