import PurpleButton from '@shared/buttons/PurpleButton';
import MaxWidth from '@shared/layouts/MaxWidth';
import Image from 'next/image';
import Link from 'next/link';
import NextStepButton from './NextStepButton';

import bgImg from '/public/images/landing-pages/hero-bg.png';

export default function Hero({ nextStep, campaignSteps, campaign }) {
  return (
    <MaxWidth>
      <div className=" bg-white rounded-2xl">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-12 lg:col-span-6">
            <div className="p-8">
              <h1 className="font-black text-5xl mb-4">Campaign Manager</h1>
              <h2 className="text-zinc-500 text-lg mb-8 leading-relaxed">
                Good Party will be with you every step of the way so you can run
                a successful campaign.
              </h2>
              <div className="bg-teal-400 text-white text-xs font-black mb-4 mt-14 inline-block py-1 px-2 rounded">
                NEXT STEP
              </div>
              <div className="flex items-baseline mb-5">
                <div className="font-bold text-2xl">
                  {campaignSteps[nextStep.sectionIndex]?.title}
                </div>
                <div className="ml-3 text-zinc-500">
                  step {nextStep.step} out of{' '}
                  {campaignSteps[nextStep.sectionIndex]?.steps.length}
                </div>
              </div>
              <NextStepButton
                nextStep={nextStep}
                campaignSteps={campaignSteps}
                campaign={campaign}
              />
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
