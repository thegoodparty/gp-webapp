import MaxWidth from '@shared/layouts/MaxWidth';
import Body1 from '@shared/typography/Body1';
import MarketingH2 from '@shared/typography/MarketingH2';
import Image from 'next/image';
import CTA from './CTA';
import WarningButton from '@shared/buttons/WarningButton';

const icons = [
  {
    icon: '/images/landing-pages/expert-icon.svg',
    title: 'Expert Insight',
    desc: (
      <>
        Advice from seasoned
        <br />
        political professionals
      </>
    ),
  },
  {
    icon: '/images/landing-pages/actionable-icon.svg',
    title: 'Actionable plan',
    desc: (
      <>
        Get a complete look at all
        <br />
        phases of running for office
      </>
    ),
  },
  {
    icon: '/images/landing-pages/winning-icon.svg',
    title: 'Winning results',
    desc: (
      <>
        100+ candidates supported
        <br />
        nationwide
      </>
    ),
  },
  {
    icon: '/images/landing-pages/free-icon.svg',
    title: 'Free',
    desc: (
      <>
        We&apos;re investing in the next
        <br />
        generation of leaders - You!
      </>
    ),
  },
];

export default function WhyAcademy() {
  return (
    <>
      <div className="bg-[linear-gradient(176deg,_rgba(0,0,0,0)_54.5%,_#13161A_55%)] h-[calc(100vw*0.09)] w-full" />
      <div className="bg-primary text-white text-center pt-12">
        <MaxWidth>
          <MarketingH2>Why Good Party Academy</MarketingH2>
          <div className="pt-24 grid grid-cols-12 gap-3 lg:gap-10 ">
            {icons.map((icon) => (
              <div
                className="col-span-12 md:col-span-6 lg:col-span-3 relative flex-col flex items-center"
                key={icon.title}
              >
                <Image src={icon.icon} width={180} height={180} alt="expert" />
                <h3 className=" text-3xl font-semibold my-8">{icon.title}</h3>
                <Body1 className="text-slate-700">{icon.desc}</Body1>
              </div>
            ))}
          </div>
          <div className="mt-16 md:mt-20 flex  justify-center">
            <CTA>
              <WarningButton>Reserve your spot</WarningButton>
            </CTA>
          </div>
        </MaxWidth>
      </div>
    </>
  );
}
