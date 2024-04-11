import LisaBottom from 'app/(landing)/get-a-demo/components/LisaBottom';
import Image from 'next/image';
import peopleImg from 'public/images/landing-pages/info-people.png';
import starImg from 'public/images/landing-pages/star.png';
import { Suspense } from 'react';
import CalendarIframe from './CalendarIframe';

const points = [
  {
    title: 'Voter Data Access',
    subTitle:
      'How to get access to voter data for a fraction of the cost. Run email campaigns, phone banks, and more without shelling out valuable campaign funds to data firms.',
  },
  {
    title: 'Text Messaging + Door Knocking Maps',
    subTitle:
      "How we'll schedule an SMS Campaign that we'll execute on your behalf with our volunteers and build out a door-knocking map targeting your likely voters.",
  },
  {
    title: 'Premium Support + Next Steps',
    subTitle:
      "How we'll give you 1-on-1 support throughout your campaign, payment details, and getting started with Good Party Pro.",
  },
];

export default function ProConsultationPage() {
  return (
    <div className="grid grid-cols-12 min-h-screen">
      <div className="col-span-12 md:col-span-6 bg-indigo-50 h-full flex justify-end">
        <div className="max-w-[640px] md:w-[50vw] pr-4 lg:pr-20 pl-4 xl:pl-0 pb-12">
          <h1 className="mt-16 lg:mt-24 font-semibold text-4xl ">
            Learn more about Good Party Pro
          </h1>
          <Image
            src={peopleImg}
            alt="Jared and Rob"
            width={157}
            height={57}
            className="my-8"
          />
          <h2 className="font-medium text-[32px] mb-5">
            What we&apos;ll talk about
          </h2>
          <div className="px-5">
            {points.map((point) => (
              <div key={point.title} className="flex items-start mb-4">
                <Image
                  src={starImg}
                  width={26}
                  height={26}
                  alt="star"
                  className="mt-1"
                />
                <div className="pl-3">
                  <h3 className="text-2xl font-medium">{point.title}</h3>
                  <div className="font-sfpro mt-2 leading-relaxed">
                    {point.subTitle}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden md:block">
            <Suspense>
              <LisaBottom />
            </Suspense>
          </div>
        </div>
      </div>
      <div className="col-span-12 md:col-span-6  h-full bg-[linear-gradient(142deg,_#8436F8_15.75%,_#8EAFE0_52.68%,_#90EEBF_88.1%)]">
        <div className="max-w-[640px] md:w-[50vw] pr-4 pl-4 xl:pr-0 flex items-center justify-center h-full">
          <CalendarIframe />
        </div>
      </div>
      <div className="col-span-12 md:hidden">
        <Suspense>
          <LisaBottom />
        </Suspense>
      </div>
    </div>
  );
}
