import Body1 from '@shared/typography/Body1';
import H2 from '@shared/typography/H2';
import Image from 'next/image';
import emptyImg from 'public/images/dashboard/empty-dashboard.jpg';
import { FaLock } from 'react-icons/fa';

export default function EmptyState() {
  return (
    <div className="relative h-[calc(100vh-60px)] max-w-[940px] mx-auto">
      <Image
        src={emptyImg}
        alt="Empty Dashboard"
        fill
        className=" object-contain object-top hidden lg:block"
      />
      <div className="absolute h-full w-full flex items-center justify-center">
        <div className="p-10 bg-white rounded-3xl flex flex-col items-center max-w-xl text-center">
          <FaLock />
          <H2 className="mt-10 mb-8">We&apos;ll have this for you shortly</H2>
          <Body1>
            We&apos;re working on gathering more information needed for this
            section. Hang tight while our team gathers this information for you.
          </Body1>
        </div>
      </div>
    </div>
  );
}
