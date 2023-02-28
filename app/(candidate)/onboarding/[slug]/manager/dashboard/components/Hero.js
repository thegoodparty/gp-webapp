import PurpleButton from '@shared/buttons/PurpleButton';
import MaxWidth from '@shared/layouts/MaxWidth';
import Image from 'next/image';
import { FaRegLightbulb } from 'react-icons/fa';
import { IoRocket } from 'react-icons/io';
import { MdHowToVote } from 'react-icons/md';

import bgImg from '/public/images/landing-pages/hero-bg.png';

export default function Hero() {
  return (
    <MaxWidth>
      <div className=" bg-white rounded-2xl">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-12 lg:col-span-6">
            <div className=" px-16 py-14">
              <h1 className="font-black text-5xl mb-4">Campaign Manager</h1>
              <h2 className="text-zinc-500 text-lg mb-8">
                Good Party will be with you every step of the way so you can run
                a successful campaign.
              </h2>
              <div className="bg-slate-100 py-6 px-10 inline-block rounded-lg text-center">
                <div className="text-teal-400 text-xs font-black mb-1">
                  NEXT STEP
                </div>
                <div className="font-bold text-xl mb-1">Launch</div>
                <div className="mb-5">step 2 out of 12</div>
                <PurpleButton>
                  <div className="px-4">Continue</div>
                </PurpleButton>
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6 relative">
            <Image
              src={bgImg}
              sizes="100vw"
              fill
              className="object-contain object-right-top"
              alt=""
              placeholder="blur"
              priority
            />
          </div>
        </div>
      </div>
    </MaxWidth>
  );
}
