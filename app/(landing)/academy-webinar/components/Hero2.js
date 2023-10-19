import MaxWidth from '@shared/layouts/MaxWidth';
import Subtitle1 from '@shared/typography/Subtitle1';
import CTA from './CTA';
import Image from 'next/image';
import webinarImg from 'public/images/landing-pages/elected-leaders.png';
import MarketingH2 from '@shared/typography/MarketingH2';
import WarningButton from '@shared/buttons/WarningButton';

export default function Hero2({ content }) {
  return (
    <MaxWidth>
      <div className="grid grid-cols-12 gap-8 mt-24 md:mt-48">
        <div className="col-span-12 md:col-span-6">
          <div className="text-right">
            <Image
              src="/images/landing-pages/star.svg"
              width={100}
              height={100}
              alt="Elected leaders"
              className="inline-block"
            />
          </div>
          <MarketingH2>
            Turning community leaders into elected officials
          </MarketingH2>
          <div className="my-12 text-xl">
            {content.hero2Desc}
            <br />
            <br />
            <ul>
              <li>Free and easy</li>
              <li>Practical skills &amp; real-world insights</li>
              <li>Personalized</li>
              coaching
            </ul>
          </div>
          <CTA clickId="hero2-reserve-cta" content={content}>
            <div className="flex items-center">
              <WarningButton>Reserve your free spot</WarningButton>
              <div className="text-xl font-medium text-purple-400 ml-3">
                Free!
              </div>
            </div>
          </CTA>
        </div>
        <div className="col-span-12 md:col-span-6 relative min-h-[350px] mt-12 md:mt-0">
          <Image
            src={webinarImg}
            sizes="(max-width: 768px) 50vw, 100vw"
            fill
            alt="Elected leaders"
            className="object-contain object-center "
          />
        </div>
      </div>
    </MaxWidth>
  );
}
