import Image from 'next/image';

import candidatesImg from '/public/images/homepage-jan23/homepage-candidates.png';
import candidatesImgSm from '/public/images/homepage-jan23/your-name.jpg';
import PurpleButton from '@shared/buttons/PurpleButton';
import Link from 'next/link';

export default function ForCandidates() {
  return (
    <div className="grid grid-cols-12 gap-3 relative justify-center items-center border-b border-neutral-300 pb-14 lg:pb-0">
      <div className="col-span-12 lg:col-span-6 ">
        <div className="hidden lg:block min-h-[600px] w-auto ml-0 relative">
          <Image
            src={candidatesImg}
            layout="fill"
            className="object-contain"
            alt=""
            placeholder="blur"
          />
        </div>
        <div className="lg:hidden min-h-[500px] md:min-h-[800px] w-screen -mr-8 relative">
          <Image
            src={candidatesImgSm}
            layout="fill"
            className="object-contain object-right"
            alt=""
            placeholder="blur"
          />
        </div>
      </div>
      <div className="col-span-12 lg:col-span-6 lg:pl-24">
        <h2 className="font-black text-4xl">For Candidates</h2>
        <div className="text-lg mt-2">
          Imagined running for office but not into Republicans or Democrats? We
          can help! Get access to free campaign tools and our team’s years of
          expertise to start or level up your candidacy.
        </div>
        <Link href="/run-for-office" className="mt-4 block">
          <PurpleButton className="tracking-wider py-5 px-8">
            LEARN MORE
          </PurpleButton>
        </Link>
      </div>
    </div>
  );
}
